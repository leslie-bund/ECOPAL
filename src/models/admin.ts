import mongoose from 'mongoose'
import { AdminReg, hashPassword, Login } from '../utils/utils'
const debug = require('debug')('ecopal:server');

const adminRegSchema = new mongoose.Schema({
  companyName: String,
  emailAddress: String,
  password: String,
})

const AdminData = mongoose.model('AdminData', adminRegSchema)
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
      debug(confirmAdmin);
      console.log('conBug'+confirmAdmin);
      if (confirmAdmin){
        return JSON.parse(JSON.stringify(confirmAdmin));
      }
    } catch (err) {
      const dataObj = { value: null, error: err }
      return dataObj
    }
  }
