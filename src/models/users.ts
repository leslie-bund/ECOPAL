import mongoose from 'mongoose'
import { hashPassword } from '../utils/utils'
import { OrderData } from './orders'
var debug = require('debug')('ecopal:server')

const userRegSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  emailAddress: { type: String, unique: true },
  phone: String,
  address: String,
  zipcode: String,
  password: String,
  role: { type: String, default: 'user' },
})

export const UserData = mongoose.model('UserData', userRegSchema)
//Post user
export async function addUser(user: UserReg) {
  try {
    const userData = new UserData(user)
    userData.password = await hashPassword(user.password)
    const value = await userData.save()
    const dataObj = { value: value, error: null }
    return dataObj
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
    if (confirmUser){
      return { value: JSON.parse(JSON.stringify(confirmUser)), error: null };
    }
    return { error: true }
  } catch (err) {
    const dataObj = { value: null, error: err };
    return dataObj
  }
}

export async function editUser(id: string, user: user) {
  try {
    //find the document by id
    const dataObj = await UserData.findById(id)
    //check if it exists
    if (!dataObj) {
      throw new Error('User by this _id is not available')
    }
    //set it new values
    dataObj.set({
      address: user.address,
      phone: user.phone,
      zipcode: user.zipcode,
    });
    //save back to database and return result
    const data = await dataObj.save();
    const result = { value: data, error: null }
    return result;
  } catch (err) {
    const result = { value: null, error: err }
    return result;
  }
}

export async function getOrders(mail:string) {
  try{
    //find order of a particular user;
    const dataObj = await OrderData.find({'user.email': mail}, { trips: true }).exec();
    const userOrders: orderCollection = {
      history: [],
      confirm: [],
      future: []
    }
  
    for(let orderElement of dataObj) {
      orderElement.trips.forEach((trip, _index) => {
        const { _id, ...tripData } = JSON.parse(JSON.stringify(trip))
        if(trip.driverConfirm && trip.userConfirm){
            userOrders.history.push(tripData);
        }
        if(trip.driverConfirm && !trip.userConfirm){
          userOrders.confirm.push(
            {
              id: orderElement._id.toString(),
              _index,
              ...tripData
            }
          );
        }
        if(!trip.driverConfirm && !trip.userConfirm){
          userOrders.future.push(
            {
              id: orderElement._id.toString(),
              _index,
              ...tripData
            }
          );
        }
      })
    }

    return userOrders;

  }catch(err){
    
    return
  }
}

