import { Response, Request } from 'express'
import {
  validateAdminRegInput,
  emailHasMxRecord,
  validateLoginInput,
  getUserAuthToken,
} from '../utils/utils'
const debug = require('debug')('ecopal:server')
import { alldrivers, editDriver } from '../models/drivers'
import { allOrderZipCodes } from '../models/orders'
import { addAdmin, logInAdmin, editAdmin } from '../models/admin'
import bcrypt from 'bcrypt'
import { UserData } from '../models/users'

export async function createAdmin(req: Request, res: Response) {
  let user: AdminReg = {
    companyName: req.body.companyName,
    emailAddress: req.body.emailAddress,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  }

  //validate input;
  const { value, error } = await validateAdminRegInput(user)
  if (error) {
    const err: string = error.details[0].message
    return res
      .status(400)
      .render('index', { page: 'signup', message: error.details[0].message })
  }

  // Provide DNS mxRecord Lookup for Admin
  const validMail = await emailHasMxRecord(value.emailAddress)

  if (!validMail) {
    const message = `Please provide a working email address`
    return res.status(400).render('index', { page: 'signup', message: message })
  }

  const adminData = await addAdmin(user)

  // Set user's cookies here before redirecting
  if (!adminData.error) {
    const token = getUserAuthToken(JSON.parse(JSON.stringify(adminData.value)))

    // Redirect the user to the User dashboard route
    res.cookie('authorization', `${token}`)
    res.redirect('/admin/alldrivers');
  }

  if(adminData.error) {
      let message = `Email has been claimed please choose another email`;
      return res.status(200).render('index', { page: 'signup' , message: message });   
  }
}

//loginUser;
export async function logIn(req: Request, res: Response) {
    try {
      let user: Login = {
        emailAddress: req.body.emailAddress,
        password: req.body.password,
      }
      const { error } = await validateLoginInput(user);
      if (!error) {
        const dataObj = await logInAdmin(user)
        if (!dataObj?.error && (await bcrypt.compare(user.password, dataObj?.value.password))) {
            const token = getUserAuthToken(JSON.parse(JSON.stringify(dataObj.value)));
            res.cookie('authorization', `${token}`);

            // redirect to Admin dashboard.
            res.redirect('/admin/alldrivers');
        } else {
          res.status(400);
          throw new Error('Invalid emailAddress or password');
        }
      }
    } catch (err) {
        return res.render('index', { page: 'login' , message: err });
    }
}

export const zipCodeDays: {[k: string]: number} = {
  "100": 1, //Mon
  "200": 2, //Tue
  "300": 3, //Wed
  "400": 4, //Thur
  "500": 5, //Fri
  "600": 6, //Sat
  "700": 1,
  "800": 3,
  "900": 4
}

//update
export async function update (req: Request, res: Response){
  if(!req.body){
      const message = 'No data provided'
      res.cookie('msg',`${ message }`);
      return res.redirect('/admin/alldrivers');
  }
  const { currentPassword, ...user } = req.body;
  //validate input;
  const { value, error } = await validateAdminRegInput(user)
  if (error) {
    const err: string = error.details[0].message
    res.cookie('msg',`${ err }`);
    return res.redirect('/admin/alldrivers');
  }

const result = await editAdmin(req.params.id, req.body);
 if(result.error){
     res.cookie('msg',`${ result.error }`);
     return res.redirect('/admin/alldrivers');
 }

 const token = getUserAuthToken(JSON.parse(JSON.stringify(result.value)));
 res.cookie('authorization', `${token}`);
 res.cookie('msg','Successfully updated');
 res.redirect('/admin/alldrivers');
}

export async function getDrivers(req: Request, res: Response) {
    
  const confirmUser = await UserData.find({}).exec();
  debug('All users: ', confirmUser)
  // Get all drivers for sorting between Approved, Suspended, Pending
  const driversObj = await alldrivers()
  // Get all zipcodes of reistered orders
  const zips = await allOrderZipCodes();

  // res.locals.user holds objet of admin's details. Have to strigify and parse to retrieve the data from bson
  return res.status(200).render('adminDashboard', { 
      page: 'drivers', 
      message: res.locals.message || 
              `Successful logged in
               ${res.locals.user.companyName}`, 
      user: res.locals.user,
      zips,
      drivers: driversObj
  });
}

export async function changeDriverInfo(req: Request, res: Response) {
  const { status, zipcode } = req.body;
  if (!status && !zipcode) {
    res.cookie('msg', 'Cannot update without zipcode')
    return res.redirect('/admin/alldrivers')
  } else if (status && !zipcode) {
    delete req.body.zipcode;
  }
  const result  = await editDriver(req.params.id, req.body);
  if(result.error){
    res.cookie('msg', `${result.error}`)
    return res.redirect('/admin/alldrivers')
  }
  res.cookie('msg', 'Driver updated');
  return res.redirect('/admin/alldrivers')
}