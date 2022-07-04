import mongoose from "mongoose";
import { UserReg, hashPassword } from "../utils/utils";


const userRegSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    emailAddress: {type: String, unique: true},
    phone: String,
    address: String,
    zipcode: String,
    password: String,

})





//Post user, driver and admin
export async function addUser(user:UserReg) {
   const UserData = mongoose.model('UserData', userRegSchema);
   const userData = new UserData(user);
   userData.password = await hashPassword(user.password);
   const value = await userData.save();
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








