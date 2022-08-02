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
exports.allOrderZipCodes = exports.postPone = exports.addOrder = exports.OrderData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var debug = require('debug')('ecopal:server');
const orderSchema = new mongoose_1.default.Schema({
    user: {
        fullName: String,
        email: String
    },
    addressOfBin: String,
    zipCode: String,
    trips: [{
            driverConfirm: { type: Boolean, default: false },
            userConfirm: { type: Boolean, default: false },
            date: Date
        }]
});
exports.OrderData = mongoose_1.default.model('Orders', orderSchema);
function addOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newOrder = new exports.OrderData(order);
            const value = yield newOrder.save();
            return { value: value, error: null };
        }
        catch (err) {
            return { value: null, error: err };
        }
    });
}
exports.addOrder = addOrder;
function postPone(id, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        // For rescheduling
        return exports.OrderData.updateOne({ _id: id }, {
            $set: { [`trips.${obj.index}.date`]: new Date(obj.newDate) }
        });
    });
}
exports.postPone = postPone;
function allOrderZipCodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const zipArr = yield exports.OrderData.distinct('zipCode');
        return zipArr;
    });
}
exports.allOrderZipCodes = allOrderZipCodes;
