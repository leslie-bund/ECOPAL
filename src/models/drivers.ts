import { string } from 'joi'
import mongoose from 'mongoose'
import { hashPassword } from '../utils/utils'
import { OrderData } from './orders'
var debug = require('debug')('ecopal:server')

const driverRegSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  emailAddress: { type: String, unique: true },
  phone: String,
  address: String,
  zipcode: String,
  licenseNumber: String,
  password: String,
  role: { type: String, default: 'driver' },
  status: { type: String, default: 'Pending' },
})

export const DriverData = mongoose.model('DriverData', driverRegSchema)
export async function addDriver(user: DriverReg) {
  try {
    const driverData = new DriverData(user)
    driverData.password = await hashPassword(user.password)
    const value = await driverData.save()
    const dataObj = { value: value, error: null }
    return dataObj
  } catch (err) {
    const dataObj = { value: null, error: err }
    return dataObj
  }
}

//login
export async function logInDriver(user: Login) {
    //check database for user details
    try {
      const confirmDriver = await DriverData.findOne({ emailAddress: user.emailAddress }).exec();
      if (confirmDriver){
        return { value: JSON.parse(JSON.stringify(confirmDriver)), error: null };
      }
      return { error: true }
    } catch (err) {
      const dataObj = { value: null, error: err }
      return dataObj
    }
}

//update driver
export async function editDriver(id: string, user: user) {
  try {
    //find the document by id
    const dataObj = await DriverData.findById(id)
    //check if it exists
    if (!dataObj) {
      throw new Error('Driver by this _id is not available')
    }
    //set it new values
    dataObj.set({
      address: user.address || dataObj.address,
      phone: user.phone || dataObj.phone,
      zipcode: user.zipcode || dataObj.zipcode,
      status: user.status || dataObj.status
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
// TODO
export async function orderForDriver(serviceZip: string) {
  // prepare order for each driver
  return await OrderData.find({ zipCode: serviceZip }, { trips: 1, addressOfBin: 1 }).exec(); 
}

export async function alldrivers(){
  const driveArr = await DriverData.find({}, { password: 0 }).exec();
  
  const driveObj: {[k: string]: driverPayload[]} = {
    "pending": [],
    "suspended": [],
    "approved": []
  }

  for(let i of JSON.parse(JSON.stringify(driveArr))) {
    driveObj[i.status.toLocaleLowerCase()].push(i);
  }

  return driveObj;

}