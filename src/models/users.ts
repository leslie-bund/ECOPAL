import mongoose from "mongoose";
import { hashPassword } from "../utils/utils";
var debug = require('debug')('ecopal:server');


const userRegSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    emailAddress: {type: String, unique: true},
    phone: String,
    address: String,
    zipcode: String,
    password: String,
    role: { type: String, default: 'user' }

})


//Post user, driver and admin
export const UserData = mongoose.model('UserData', userRegSchema);
export async function addUser(user:UserReg) {
   const userData = new UserData(user);
   userData.password = await hashPassword(user.password);
   const value = await userData.save();
   return value;
}









