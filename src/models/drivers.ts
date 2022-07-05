import mongoose from 'mongoose'
import { DriverReg, hashPassword, Login } from '../utils/utils'
const debug = require('debug')('ecopal:server');

const driverRegSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  emailAddress: String,
  phone: String,
  address: String,
  zipcode: String,
  licenseNumber: String,
  password: String,
})

const DriverData = mongoose.model('DriverData', driverRegSchema)
export async function addDriver(user: DriverReg) {
  try {
    const driverData = new DriverData(user)
    driverData.password = await hashPassword(user.password)
    const value = await driverData.save()
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
export async function logInDriver(user: Login) {
    //check database for user details
    try {
      const confirmDriver = await DriverData.findOne({ emailAddress: user.emailAddress }).exec();
      debug(confirmDriver);
      console.log('conBug'+confirmDriver);
      if (confirmDriver){
        return JSON.parse(JSON.stringify(confirmDriver));
      }
    } catch (err) {
      const dataObj = { value: null, error: err }
      return dataObj
    }
  }