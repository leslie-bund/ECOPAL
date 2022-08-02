"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDriverInfo = exports.getDrivers = exports.update = exports.zipCodeDays = exports.logIn = exports.createAdmin = void 0;
const utils_1 = require("../utils/utils");
const debug = require('debug')('ecopal:server');
const drivers_1 = require("../models/drivers");
const orders_1 = require("../models/orders");
const admin_1 = require("../models/admin");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../models/users");
function createAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = {
            companyName: req.body.companyName,
            emailAddress: req.body.emailAddress,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };
        //validate input;
        const { value, error } = yield (0, utils_1.validateAdminRegInput)(user);
        if (error) {
            const err = error.details[0].message;
            return res
                .status(400)
                .render('index', { page: 'signup', message: error.details[0].message });
        }
        // Provide DNS mxRecord Lookup for Admin
        const validMail = yield (0, utils_1.emailHasMxRecord)(value.emailAddress);
        if (!validMail) {
            const message = `Please provide a working email address`;
            return res.status(400).render('index', { page: 'signup', message: message });
        }
        const adminData = yield (0, admin_1.addAdmin)(user);
        // Set user's cookies here before redirecting
        if (!adminData.error) {
            const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(adminData.value)));
            // Redirect the user to the User dashboard route
            res.cookie('authorization', `${token}`);
            res.redirect('/admin/alldrivers');
        }
        if (adminData.error) {
            let message = `Email has been claimed please choose another email`;
            return res.status(200).render('index', { page: 'signup', message: message });
        }
    });
}
exports.createAdmin = createAdmin;
//loginUser;
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = {
                emailAddress: req.body.emailAddress,
                password: req.body.password,
            };
            const { error } = yield (0, utils_1.validateLoginInput)(user);
            if (!error) {
                const dataObj = yield (0, admin_1.logInAdmin)(user);
                if (!(dataObj === null || dataObj === void 0 ? void 0 : dataObj.error) && (yield bcrypt_1.default.compare(user.password, dataObj === null || dataObj === void 0 ? void 0 : dataObj.value.password))) {
                    const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(dataObj.value)));
                    res.cookie('authorization', `${token}`);
                    // redirect to Admin dashboard.
                    res.redirect('/admin/alldrivers');
                }
                else {
                    res.status(400);
                    throw new Error('Invalid emailAddress or password');
                }
            }
        }
        catch (err) {
            return res.render('index', { page: 'login', message: err });
        }
    });
}
exports.logIn = logIn;
exports.zipCodeDays = {
    "100": 1,
    "200": 2,
    "300": 3,
    "400": 4,
    "500": 5,
    "600": 6,
    "700": 1,
    "800": 3,
    "900": 4
};
//update
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body) {
            const message = 'No data provided';
            res.cookie('msg', `${message}`);
            return res.redirect('/admin/alldrivers');
        }
        const _a = req.body, { currentPassword } = _a, user = __rest(_a, ["currentPassword"]);
        //validate input;
        const { value, error } = yield (0, utils_1.validateAdminRegInput)(user);
        if (error) {
            const err = error.details[0].message;
            res.cookie('msg', `${err}`);
            return res.redirect('/admin/alldrivers');
        }
        const result = yield (0, admin_1.editAdmin)(req.params.id, req.body);
        if (result.error) {
            res.cookie('msg', `${result.error}`);
            return res.redirect('/admin/alldrivers');
        }
        const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(result.value)));
        res.cookie('authorization', `${token}`);
        res.cookie('msg', 'Successfully updated');
        res.redirect('/admin/alldrivers');
    });
}
exports.update = update;
function getDrivers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const confirmUser = yield users_1.UserData.find({}).exec();
        debug('All users: ', confirmUser);
        // Get all drivers for sorting between Approved, Suspended, Pending
        const driversObj = yield (0, drivers_1.alldrivers)();
        // Get all zipcodes of reistered orders
        const zips = yield (0, orders_1.allOrderZipCodes)();
        // res.locals.user holds objet of admin's details. Have to strigify and parse to retrieve the data from bson
        return res.status(200).render('adminDashboard', {
            page: 'drivers',
            message: res.locals.message ||
                `Successful logged in
               ${res.locals.user.companyName}`,
            user: res.locals.user,
            zips,
            drivers: driversObj
        });
    });
}
exports.getDrivers = getDrivers;
function changeDriverInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { status, zipcode } = req.body;
        if (!status && !zipcode) {
            res.cookie('msg', 'Cannot update without zipcode');
            return res.redirect('/admin/alldrivers');
        }
        else if (status && !zipcode) {
            delete req.body.zipcode;
        }
        const result = yield (0, drivers_1.editDriver)(req.params.id, req.body);
        if (result.error) {
            res.cookie('msg', `${result.error}`);
            return res.redirect('/admin/alldrivers');
        }
        res.cookie('msg', 'Driver updated');
        return res.redirect('/admin/alldrivers');
    });
}
exports.changeDriverInfo = changeDriverInfo;
