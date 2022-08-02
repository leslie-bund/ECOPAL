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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = exports.update = exports.logIn = exports.createUser = void 0;
const users_1 = require("../models/users");
const utils_1 = require("../utils/utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
var debug = require('debug')('ecopal:server');
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //define the request from the user;
        let user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            emailAddress: req.body.emailAddress,
            phone: req.body.phone,
            address: req.body.address,
            zipcode: req.body.zipcode,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };
        //validate input;
        const { value, error } = yield (0, utils_1.validateUserRegInput)(user);
        if (error) {
            return res
                .status(400)
                .render('index', { page: 'signup', message: error.details[0].message });
        }
        // Perform User email DNS mxRecord lookup
        const validMail = yield (0, utils_1.emailHasMxRecord)(value.emailAddress);
        if (!validMail) {
            const message = `Please provide a working email address`;
            return res.status(400).render('index', { page: 'signup', message: message });
        }
        const userData = yield (0, users_1.addUser)(user);
        if (userData.error) {
            return res
                .status(200)
                .render('index', { page: 'signup', message: JSON.stringify(userData) });
        }
        if (!userData.error) {
            // Set user's cookies here before redirecting
            const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(userData.value)));
            // Redirect the user to the User dashboard route
            res.cookie('authorization', `${token}`);
            // return res.status(200).redirect('/users/getorders'); ---work with this when available!
            res.redirect('/users/getorders');
            // return res.status(200).render('index', { page: 'home' , message: 'Successful Signup' });
        }
    });
}
exports.createUser = createUser;
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
                const dataObj = yield (0, users_1.logInUser)(user);
                if (!(dataObj === null || dataObj === void 0 ? void 0 : dataObj.error) && (yield bcrypt_1.default.compare(user.password, dataObj === null || dataObj === void 0 ? void 0 : dataObj.value.password))) {
                    const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(dataObj.value)));
                    res.cookie('authorization', `${token}`);
                    // Redirect to user dashboard --when dashboard is ready
                    res.redirect('/users/getorders');
                    return;
                }
                else {
                    res.status(400);
                    throw new Error('Invalid emailAddress or password');
                }
            }
        }
        catch (err) {
            return res.status(400).render('index', { page: 'login', message: err });
        }
    });
}
exports.logIn = logIn;
//update
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body) {
            const message = 'No data provided';
            return res.status(400).render('error', { error: message });
        }
        const result = yield (0, users_1.editUser)(res.locals.user._id, req.body);
        if (result.error) {
            return res.status(404).render('error', { error: result.error });
        }
        //testing
        const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(result.value)));
        res.cookie('authorization', `${token}`);
        res.cookie('msg', 'Successfully updated');
        res.redirect('/users/getorders');
    });
}
exports.update = update;
//orders
function orders(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderArr = yield (0, users_1.getOrders)(res.locals.user.emailAddress);
        return res.status(200).render('userDashboard', {
            page: 'orders',
            message: res.locals.message || `Successful logged in user \n ${res.locals.user.firstname}`,
            user: res.locals.user,
            orders: orderArr
        });
    });
}
exports.orders = orders;
