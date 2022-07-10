import express, { Response, Request } from 'express';
import { addDriver, editDriver, logInDriver } from '../models/drivers';
import bcrypt from 'bcrypt';
import { validateDriverRegInput, emailHasMxRecord, getUserAuthToken, validateLoginInput } from '../utils/utils';
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
  const result = await editDriver(req.params.id, req.body);
 if(result.error){
     return res.status(404).render('error', {error: result.error});
 }
 console.log("Bug"+req.body);
 console.log("Bug2"+result.value);
 return res.status(200).render('index',{page: 'login', message: result.value});
//    res.status(200).redirect('/users/getallorders'); --use when page is ready.

}