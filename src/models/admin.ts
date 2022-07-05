import mongoose from "mongoose";
import { AdminReg, hashPassword } from "../utils/utils";


const adminRegSchema = new mongoose.Schema({
    companyName: String,
    emailAddress: String,
    password: String
})

export async function addAdmin(user: AdminReg){
    const AdminData = mongoose.model('AdminData', adminRegSchema);
    const adminData = new AdminData(user);
    adminData.password = await hashPassword(user.password);
    const value = await adminData.save();
    return value;
}