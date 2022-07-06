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
export async function addAdmin(user: AdminReg) {
  try {
    const adminData = new AdminData(user)
    adminData.password = await hashPassword(user.password)
    const value = await adminData.save()
    const dataObj = { value: value, error: null }
    return dataObj
    // return value;
  } catch (err) {
    console.error(err)
    // return err;
    const dataObj = { value: null, error: err }
    return dataObj
  }
}

//login
export async function logInAdmin(user: Login) {
    //check database for user details
    try {
      const confirmAdmin = await AdminData.findOne({ emailAddress: user.emailAddress }).exec();
      if (confirmAdmin){
        return { value: JSON.parse(JSON.stringify(confirmAdmin)), error: null };
      }
      return { error: true }
    } catch (err) {
      const dataObj = { value: null, error: err }
      return dataObj
    }
  }
