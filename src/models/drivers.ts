import mongoose from "mongoose";
import { DriverReg, hashPassword } from "../utils/utils";

const driverRegSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    emailAddress: String,
    phone: String,
    address: String,
    zipcode: String,
    licenseNumber: String,
    password: String
})

export async function addDriver(user:DriverReg) {
    const DriverData = mongoose.model('DriverData', driverRegSchema);
    const driverData = new DriverData(user);
    driverData.password = await hashPassword(user.password);
    const value = await driverData.save();
    return value;
}