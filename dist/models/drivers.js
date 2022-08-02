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
exports.alldrivers = exports.orderForDriver = exports.editDriver = exports.logInDriver = exports.addDriver = exports.DriverData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils/utils");
const orders_1 = require("./orders");
var debug = require('debug')('ecopal:server');
const driverRegSchema = new mongoose_1.default.Schema({
    firstname: String,
    lastname: String,
    emailAddress: { type: String, unique: true },
    phone: String,
    address: String,
    zipcode: String,
    licenseNumber: String,
    password: String,
    role: { type: String, default: 'driver' },
    status: { type: String, default: 'Pending' },
});
exports.DriverData = mongoose_1.default.model('DriverData', driverRegSchema);
function addDriver(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const driverData = new exports.DriverData(user);
            driverData.password = yield (0, utils_1.hashPassword)(user.password);
            const value = yield driverData.save();
            const dataObj = { value: value, error: null };
            return dataObj;
        }
        catch (err) {
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.addDriver = addDriver;
//login
function logInDriver(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //check database for user details
        try {
            const confirmDriver = yield exports.DriverData.findOne({ emailAddress: user.emailAddress }).exec();
            if (confirmDriver) {
                return { value: JSON.parse(JSON.stringify(confirmDriver)), error: null };
            }
            return { error: true };
        }
        catch (err) {
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.logInDriver = logInDriver;
//update driver
function editDriver(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //find the document by id
            const dataObj = yield exports.DriverData.findById(id);
            //check if it exists
            if (!dataObj) {
                throw new Error('Driver by this _id is not available');
            }
            //set it new values
            dataObj.set({
                address: user.address || dataObj.address,
                phone: user.phone || dataObj.phone,
                zipcode: user.zipcode || dataObj.zipcode,
                status: user.status || dataObj.status
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
exports.editDriver = editDriver;
// TODO
function orderForDriver(serviceZip) {
    return __awaiter(this, void 0, void 0, function* () {
        // prepare order for each driver
        return yield orders_1.OrderData.find({ zipCode: serviceZip }, { trips: 1, addressOfBin: 1 }).exec();
    });
}
exports.orderForDriver = orderForDriver;
function alldrivers() {
    return __awaiter(this, void 0, void 0, function* () {
        const driveArr = yield exports.DriverData.find({}, { password: 0 }).exec();
        const driveObj = {
            "pending": [],
            "suspended": [],
            "approved": []
        };
        for (let i of JSON.parse(JSON.stringify(driveArr))) {
            driveObj[i.status.toLocaleLowerCase()].push(i);
        }
        return driveObj;
    });
}
exports.alldrivers = alldrivers;
