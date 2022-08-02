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
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmOrder = exports.rescheduleOrder = exports.makeNewOrder = void 0;
const orders_1 = require("../models/orders");
const admin_1 = require("./admin");
const utils_1 = require("../utils/utils");
var debug = require('debug')('ecopal:server');
function makeNewOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value, error } = yield (0, utils_1.validateUserPayInput)(req.body);
        if (error) {
            res.cookie('msg', `${error}`);
            return res.redirect('/users/getorders');
        }
        let dayOfWeekForZip = 0;
        for (let i of Object.keys(admin_1.zipCodeDays)) {
            if (+value.zipCode.slice(-3) > +i) {
                dayOfWeekForZip = admin_1.zipCodeDays[i];
            }
        }
        const currentDate = new Date();
        const dayOfWeekOfPay = currentDate.getDay();
        currentDate.setDate(currentDate.getDate() + Math.abs(dayOfWeekForZip - dayOfWeekOfPay));
        const dateArr = [];
        for (let i = 0; i < value.price; i++) {
            dateArr.push(currentDate.toISOString());
            currentDate.setDate(currentDate.getDate() + 14);
        }
        let validOrder = {
            user: {
                fullName: value.fullName,
                email: res.locals.user.emailAddress
            },
            addressOfBin: value.binAddress,
            zipCode: value.zipCode,
            trips: dateArr.map(element => {
                return {
                    driverConfirm: false,
                    userConfirm: false,
                    date: new Date(element)
                };
            })
        };
        const orderObj = yield (0, orders_1.addOrder)(validOrder);
        if (!orderObj.error) {
            res.cookie('msg', `${res.locals.user.firstname}<br> Order Successful `);
            return res.redirect('/users/getorders');
        }
        else {
            res.cookie('msg', `Order unsuccessful <br> please try again`);
            return res.redirect('/users/getorders');
        }
    });
}
exports.makeNewOrder = makeNewOrder;
function rescheduleOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value, error } = yield (0, utils_1.validateRescheduleDate)(req.body.newDate);
        if (error) {
            res.cookie('msg', 'Cannot backdate rescheduled');
            return res.redirect('/users/getorders');
        }
        const result = yield (0, orders_1.postPone)(req.params.id, req.body);
        if (result.modifiedCount > 0) {
            res.cookie('msg', 'Pickup rescheduled');
            return res.redirect('/users/getorders');
        }
    });
}
exports.rescheduleOrder = rescheduleOrder;
function confirmOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //  For confirming the orders - from driver's side
        const updated = yield orders_1.OrderData.updateOne({ _id: req.params.id }, {
            $set: { [`trips.${req.body.index}.userConfirm`]: true }
        });
        if (updated.modifiedCount > 0) {
            res.cookie('msg', 'Confirmed');
            return res.redirect('/users/getorders');
        }
        res.cookie('msg', 'Unsuccessful');
        return res.redirect('/users/getorders');
    });
}
exports.confirmOrder = confirmOrder;
