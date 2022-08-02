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
exports.driverConfirmOrder = exports.getDriverOrders = exports.update = exports.logIn = exports.createDriver = void 0;
const drivers_1 = require("../models/drivers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils/utils");
const orders_1 = require("../models/orders");
var debug = require('debug')('ecopal:server');
function createDriver(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //define the request from the user;
        let user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            emailAddress: req.body.emailAddress,
            phone: req.body.phone,
            address: req.body.address,
            zipcode: req.body.zipcode,
            licenseNumber: req.body.licenseNumber,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        };
        //validate input;
        const { value, error } = yield (0, utils_1.validateDriverRegInput)(user);
        if (error) {
            const err = error.details[0].message;
            return res.status(400).render('index', { page: 'signup', message: error.details[0].message });
        }
        // Provide DNS mx Records lookup
        const validMail = yield (0, utils_1.emailHasMxRecord)(value.emailAddress);
        if (!validMail) {
            const message = `Please provide a working email address`;
            return res.status(205).render('index', { page: 'signup', message: message });
        }
        let message;
        const driverData = yield (0, drivers_1.addDriver)(user);
        if (!driverData.error) {
            // Set user's cookies here before redirecting
            const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(driverData.value)));
            res.cookie('authorization', `${token}`);
            // Redirect the user to the User dashboard route
            res.redirect('/drivers/allorders');
        }
        if (driverData.error) {
            return res.status(200).render('index', { page: 'signup', message: driverData.error });
        }
    });
}
exports.createDriver = createDriver;
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
                const dataObj = yield (0, drivers_1.logInDriver)(user);
                if (!(dataObj === null || dataObj === void 0 ? void 0 : dataObj.error) && (yield bcrypt_1.default.compare(user.password, dataObj === null || dataObj === void 0 ? void 0 : dataObj.value.password))) {
                    const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(dataObj.value)));
                    res.cookie('authorization', `${token}`);
                    //Redirect to driver dashboard
                    res.redirect('/drivers/allorders');
                    // return res.status(200).render('index', { page: 'home', message: 'Successful login' })
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
//update
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body) {
            const message = 'No data provided';
            return res.status(400).render('error', { error: message });
        }
        const result = yield (0, drivers_1.editDriver)(res.locals.user._id, req.body);
        if (result.error) {
            return res.status(404).render('error', { error: result.error });
        }
        const token = (0, utils_1.getUserAuthToken)(JSON.parse(JSON.stringify(result.value)));
        res.cookie('authorization', `${token}`);
        res.cookie('msg', 'Successfully updated');
        res.redirect('/drivers/allorders');
    });
}
exports.update = update;
// TODO
function getDriverOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0, drivers_1.orderForDriver)(res.locals.user.zipcode);
        let orders = JSON.parse(JSON.stringify(data)).map((element) => {
            let foundIndex = null;
            const found = element.trips.find((trip, index) => {
                foundIndex = index;
                return !trip.driverConfirm && new Date(trip.date).toDateString() === new Date().toDateString();
            });
            if (found) {
                return {
                    orderId: element._id,
                    address: element.addressOfBin,
                    trip: found,
                    tripIndex: foundIndex,
                };
            }
        }).filter((element) => element);
        return res.status(200).render('driverDashboard', {
            page: 'orders',
            message: res.locals.user.message || `Successful logged in driver \n ${res.locals.user.firstname}`,
            user: res.locals.user,
            orders
        });
    });
}
exports.getDriverOrders = getDriverOrders;
function driverConfirmOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //  For confirming the orders - from driver's side
        const updated = yield orders_1.OrderData.updateOne({ _id: req.params.id }, {
            $set: { [`trips.${req.body.index}.driverConfirm`]: true }
        });
        if (updated.modifiedCount > 0) {
            res.cookie('msg', 'Confirmed');
            return res.redirect('/drivers/allorders');
        }
        res.cookie('msg', 'Unsuccessful');
        return res.redirect('/drivers/allorders');
    });
}
exports.driverConfirmOrder = driverConfirmOrder;
