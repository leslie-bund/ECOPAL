import { boolean, string } from "joi";
import mongoose from "mongoose";
import { hashPassword } from "../utils/utils";
var debug = require('debug')('ecopal:server');


const orderSchema = new mongoose.Schema({
    user: {
        fullName: String,
        email: String
    },
    addressOfBin: String,
    zipCode: String,
    trips: [{
        driverConfirm: { type: Boolean, default: false },
        userConfirm:  { type: Boolean, default: false },
        date: Date
    }]
})

export const OrderData = mongoose.model('Orders', orderSchema);

export async function addOrder(order: order) {
    try {
        const newOrder = new OrderData(order);
        const value = await newOrder.save();
        return { value: value, error: null }
    } catch (err) {
        return { value: null, error: err }
    }
}

export async function postPone(id: string, obj: { index: number, newDate: string }) {
    // For rescheduling
    return OrderData.updateOne({ _id: id}, {
      $set : { [`trips.${obj.index}.date`] : new Date(obj.newDate) }
    })
    
}

export async function allOrderZipCodes() {
    const zipArr = await OrderData.distinct('zipCode');
    return zipArr;
}

