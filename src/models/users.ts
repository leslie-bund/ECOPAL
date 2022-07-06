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

export const UserData = mongoose.model('UserData', userRegSchema)
//Post user
export async function addUser(user: UserReg) {
  try {
      const userData = new UserData(user)
      userData.password = await hashPassword(user.password)
      const value = await userData.save()
      const dataObj = { value: value, error: null }
      return dataObj;
  } catch (err) {
    const dataObj = { value: null, error: err }
    return dataObj
  }
}

//login
export async function logInUser(user: Login) {
  //check database for user details
  try {
    const confirmUser = await UserData.findOne({ emailAddress: user.emailAddress }).exec();
    debug(confirmUser);
    if (confirmUser){
      return JSON.parse(JSON.stringify(confirmUser));
    }
    
  } catch (err) {
    const dataObj = { value: null, error: err }
    return dataObj
  }
}
