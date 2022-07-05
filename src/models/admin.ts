import mongoose from "mongoose";
import { hashPassword } from "../utils/utils";
var debug = require('debug')('ecopal:server');


const adminRegSchema = new mongoose.Schema({
    companyName: String,
    emailAddress: {type: String, unique: true},
    password: String,
    role: { type: String, default: 'admin' }
})

export const AdminData = mongoose.model('AdminData', adminRegSchema);
export async function addAdmin(user: AdminReg){
    const adminData = new AdminData(user);
    adminData.password = await hashPassword(user.password);
    const value = await adminData.save();
    return value;
}