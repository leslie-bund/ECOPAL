import { string } from "joi";
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
        driverConfirm: Boolean,
        userConfirm: Boolean,
        date: Date
    }]
})

export const OrderData = mongoose.model('Orders', orderSchema);

export async function addOrder(order: order) {
    try {
        const newOrder = new OrderData(order);
        const value = await newOrder.save();
        debug('Order: ', value);
        return { value: value, error: null }
    } catch (err) {
        return { value: null, error: err }
    }
}

//Post user

//login
// export async function logInUser(user: Login) {
//   //check database for user details
//   try {
//     const confirmUser = await UserData.findOne({ emailAddress: user.emailAddress }).exec();
//     if (confirmUser){
//       return { value: JSON.parse(JSON.stringify(confirmUser)), error: null };
//     }
//     return { error: true }
//   } catch (err) {
//     const dataObj = { value: null, error: err };
//     return dataObj
//   }
// }
