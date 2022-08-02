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
exports.getOrders = exports.editUser = exports.logInUser = exports.addUser = exports.UserData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils/utils");
const orders_1 = require("./orders");
var debug = require('debug')('ecopal:server');
const userRegSchema = new mongoose_1.default.Schema({
    firstname: String,
    lastname: String,
    emailAddress: { type: String, unique: true },
    phone: String,
    address: String,
    zipcode: String,
    password: String,
    role: { type: String, default: 'user' },
});
exports.UserData = mongoose_1.default.model('UserData', userRegSchema);
//Post user
function addUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = new exports.UserData(user);
            userData.password = yield (0, utils_1.hashPassword)(user.password);
            const value = yield userData.save();
            const dataObj = { value: value, error: null };
            return dataObj;
        }
        catch (err) {
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.addUser = addUser;
//login
function logInUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //check database for user details
        try {
            const confirmUser = yield exports.UserData.findOne({ emailAddress: user.emailAddress }).exec();
            if (confirmUser) {
                return { value: JSON.parse(JSON.stringify(confirmUser)), error: null };
            }
            return { error: true };
        }
        catch (err) {
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.logInUser = logInUser;
function editUser(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //find the document by id
            const dataObj = yield exports.UserData.findById(id);
            //check if it exists
            if (!dataObj) {
                throw new Error('User by this _id is not available');
            }
            //set it new values
            dataObj.set({
                address: user.address,
                phone: user.phone,
                zipcode: user.zipcode,
            });
            //save back to database and return result
            const data = yield dataObj.save();
            const result = { value: data, error: null };
            return result;
        }
        catch (err) {
            const result = { value: null, error: err };
            return result;
        }
    });
}
exports.editUser = editUser;
function getOrders(mail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //find order of a particular user;
            const dataObj = yield orders_1.OrderData.find({ 'user.email': mail }, { trips: true }).exec();
            const userOrders = {
                history: [],
                confirm: [],
                future: []
            };
            for (let orderElement of dataObj) {
                orderElement.trips.forEach((trip, _index) => {
                    const _a = JSON.parse(JSON.stringify(trip)), { _id } = _a, tripData = __rest(_a, ["_id"]);
                    if (trip.driverConfirm && trip.userConfirm) {
                        userOrders.history.push(tripData);
                    }
                    if (trip.driverConfirm && !trip.userConfirm) {
                        userOrders.confirm.push(Object.assign({ id: orderElement._id.toString(), _index }, tripData));
                    }
                    if (!trip.driverConfirm && !trip.userConfirm) {
                        userOrders.future.push(Object.assign({ id: orderElement._id.toString(), _index }, tripData));
                    }
                });
            }
            return userOrders;
        }
        catch (err) {
            return;
        }
    });
}
exports.getOrders = getOrders;
