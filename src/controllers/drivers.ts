import express, { Response, Request } from 'express';
import { addDriver, editDriver, logInDriver, orderForDriver } from '../models/drivers';
import { zipCodeDays } from './admin';
import bcrypt from 'bcrypt';
import { validateDriverRegInput, emailHasMxRecord, getUserAuthToken, validateLoginInput } from '../utils/utils';
import { any } from 'joi';
import { OrderData } from '../models/orders';
var debug = require('debug')('ecopal:server');


export async function createDriver(req: Request, res: Response) {
    //define the request from the user;
    let user: DriverReg = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        emailAddress: req.body.emailAddress,
        phone: req.body.phone,
        address: req.body.address,
        zipcode: req.body.zipcode,
        licenseNumber: req.body.licenseNumber,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    //validate input;
    const { value, error } = await validateDriverRegInput (user);
    if(error){
        const err: string = error.details[0].message;
        return res.status(400).render('index', { page: 'signup', message: error.details[0].message });
    }

    // Provide DNS mx Records lookup
    const validMail = await emailHasMxRecord(value.emailAddress);

    if (!validMail) {
        const message = `Please provide a working email address`;
        return res.status(205).render('index', { page: 'signup', message: message });
    }

    let message;

    const driverData = await addDriver(user);
    if(!driverData.error) {
        // Set user's cookies here before redirecting
        const token = getUserAuthToken(JSON.parse(JSON.stringify(driverData.value)));

        res.cookie('authorization', `${token}`);
        
        // Redirect the user to the User dashboard route
        res.redirect('/drivers/allorders');
    }
 
    if(driverData.error){
        return res.status(200).render('index', {page: 'signup', message: driverData.error }); 
    }
}

//loginUser;
export async function logIn(req: Request, res: Response) {
    try {
      let user: Login = {
        emailAddress: req.body.emailAddress,
        password: req.body.password,
      }
      const { error } = await validateLoginInput(user)
      if (!error) {
        const dataObj = await logInDriver(user)
        if (!dataObj?.error && (await bcrypt.compare(user.password, dataObj?.value.password))) {
            const token = getUserAuthToken(JSON.parse(JSON.stringify(dataObj.value)));
            res.cookie('authorization', `${token}`);

            //Redirect to driver dashboard
            res.redirect('/drivers/allorders');
            // return res.status(200).render('index', { page: 'home', message: 'Successful login' })
        } else {
          res.status(400)
          throw new Error('Invalid emailAddress or password')
        }
      }
    } catch (err) {
        return res.render('index', { page: 'login' , message: err }); 
    }
  }


//update
export async function update (req: Request, res: Response){
  if(!req.body){
      const message = 'No data provided'
      return res.status(400).render('error', {error: message});
  }
  const result = await editDriver(res.locals.user._id, req.body);
 if(result.error){
     return res.status(404).render('error', {error: result.error});
 }
  const token = getUserAuthToken(JSON.parse(JSON.stringify(result.value)));
  res.cookie('authorization', `${token}`);
  res.cookie('msg','Successfully updated');
  res.redirect('/drivers/allorders');

}
// TODO
export async function getDriverOrders(req: Request, res: Response) {
  
    const data = await orderForDriver(res.locals.user.zipcode);
    let orders = JSON.parse(JSON.stringify(data)).map((element: Pick<order, '_id' | 'trips' | 'addressOfBin'>)=>{
      let foundIndex: number | null = null;
      const found = element.trips.find((trip, index: number)=> {
        foundIndex = index;
        return !trip.driverConfirm && new Date(trip.date).toDateString() === new Date().toDateString() 
      })
      if(found) {
        return {
          orderId: element._id,
          address: element.addressOfBin,
          trip: found,
          tripIndex: foundIndex,
        }
      }
    }).filter((element: driverOrder) => element)

  return res.status(200).render('driverDashboard', { 
      page: 'orders', 
      message: res.locals.user.message || `Successful logged in driver \n ${res.locals.user.firstname}`, 
      user: res.locals.user,
      orders
  });
}

export async function driverConfirmOrder(req: Request, res: Response) {
  //  For confirming the orders - from driver's side
   const updated = await OrderData.updateOne({ _id: req.params.id}, {
    $set : { [`trips.${req.body.index}.driverConfirm`] : true }
  })

  
  if(updated.modifiedCount > 0) {
    res.cookie('msg', 'Confirmed');
    return res.redirect('/drivers/allorders');
  }
  res.cookie('msg', 'Unsuccessful');
  return res.redirect('/drivers/allorders');
}