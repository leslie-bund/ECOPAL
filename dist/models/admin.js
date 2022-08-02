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
exports.editAdmin = exports.logInAdmin = exports.addAdmin = exports.AdminData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils/utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
var debug = require('debug')('ecopal:server');
const adminRegSchema = new mongoose_1.default.Schema({
    companyName: String,
    emailAddress: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'admin' },
});
exports.AdminData = mongoose_1.default.model('AdminData', adminRegSchema);
function addAdmin(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const adminData = new exports.AdminData(user);
            adminData.password = yield (0, utils_1.hashPassword)(user.password);
            const value = yield adminData.save();
            const dataObj = { value: value, error: null };
            return dataObj;
            // return value;
        }
        catch (err) {
            console.error(err);
            // return err;
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.addAdmin = addAdmin;
//login
function logInAdmin(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //check database for user details
        try {
            const confirmAdmin = yield exports.AdminData.findOne({ emailAddress: user.emailAddress }).exec();
            if (confirmAdmin) {
                return { value: JSON.parse(JSON.stringify(confirmAdmin)), error: null };
            }
            return { error: true };
        }
        catch (err) {
            const dataObj = { value: null, error: err };
            return dataObj;
        }
    });
}
exports.logInAdmin = logInAdmin;
//update driver
function editAdmin(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //find the document by id
            const dataObj = yield exports.AdminData.findById(id);
            //check if it exists
            if (!dataObj) {
                throw new Error('Driver by this _id is not available');
            }
            const match = yield bcrypt_1.default.compare(user.currentPassword, dataObj === null || dataObj === void 0 ? void 0 : dataObj.password);
            if (!match) {
                throw new Error('Current password does not match');
            }
            const adminPass = yield (0, utils_1.hashPassword)(user.password);
            //set it new values
            dataObj.set({
                password: adminPass
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
exports.editAdmin = editAdmin;
