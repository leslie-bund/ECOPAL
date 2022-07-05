import mongoose from "mongoose";
import { hashPassword } from "../utils/utils";
var debug = require('debug')('ecopal:server');

const driverRegSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    emailAddress: {type: String, unique: true},
    phone: String,
    address: String,
    zipcode: String,
    licenseNumber: String,
    password: String,
    role: { type: String, default: 'driver' }
})

export const DriverData = mongoose.model('DriverData', driverRegSchema);
export async function addDriver(user:DriverReg) {
    const driverData = new DriverData(user);
    driverData.password = await hashPassword(user.password);
    const value = await driverData.save();
    return value;
}