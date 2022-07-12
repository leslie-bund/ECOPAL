import mongoose from 'mongoose'
import { hashPassword } from '../utils/utils'
var debug = require('debug')('ecopal:server')

const adminRegSchema = new mongoose.Schema({
  companyName: String,
  emailAddress: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' },
})

export const AdminData = mongoose.model('AdminData', adminRegSchema)
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

//update driver
export async function editAdmin(id: string, user: user) {
  try {
    //find the document by id
    const dataObj = await AdminData.findById(id)
    //check if it exists
    if (!dataObj) {
      throw new Error('Driver by this _id is not available')
    }
    //set it new values
    dataObj.set({
      password: user.password
    });
    //save back to database and return result
    const data = await dataObj.save();
    const result = { value: data, error: null }
    return result

  } catch (err) {
    const result = { value: null, error: err }
    return result;
  }
}