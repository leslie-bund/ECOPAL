import mongoose from "mongoose";
import { UserReg, AdminReg, DriverReg, hashPassword } from "../utils/utils";


const userRegSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    emailAddress: String,
    phone: String,
    address: String,
    zipcode: String,
    password: String,

})

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

const adminRegSchema = new mongoose.Schema({
    companyName: String,
    emailAddress: String,
    password: String
})

//Post user, driver and admin
export async function addUser(user:UserReg) {
   const UserData = mongoose.model('UserData', userRegSchema);
   const userData = new UserData(user);
   userData.password = await hashPassword(user.password);
   const value = await userData.save();
   return value;
}

export async function addDriver(user:DriverReg) {
    const DriverData = mongoose.model('DriverData', driverRegSchema);
    const driverData = new DriverData(user);
    driverData.password = await hashPassword(user.password);
    const value = await driverData.save();
    return value;
}

export async function addAdmin(user: AdminReg){
    const AdminData = mongoose.model('AdminData', adminRegSchema);
    const adminData = new AdminData(user);
    adminData.password = await hashPassword(user.password);
    const value = await adminData.save();
    return value;
}

//Get all users, drivers and admins.
export async function readAllUsers (){
    const UserData = mongoose.model('UserData', userRegSchema);
    // const userData = new UserData();
    try{
        const allUsers = UserData.find();
        if(!allUsers){
            throw new Error('Something went wrong'); 
        }
        const  allUsersObj= {value: allUsers, error: null};
        console.log(allUsersObj);
        return allUsersObj;

    }catch(err){


    }
   

}








