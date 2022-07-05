import express, { Response, Request } from 'express';
import { addDriver, logInDriver } from '../models/drivers';
import { logInUser } from '../models/users';
import { DriverReg, validateDriverRegInput, Login, validateLoginInput } from '../utils/utils';
import bcrypt from 'bcrypt'


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
    const { error } = await validateDriverRegInput (user);
    if(error){
        const err: string = error.details[0].message;
        res.locals.message = err;
        res.locals.error = err
        return res.status(400).render('error')
        // return res.status(400).render('error', { error: err });
    }

    // Provide DNS mx Records lookup

    const driverData = await addDriver(user);
    const message = 'Successfully registered';
    if(driverData.error){
        res.locals.message = driverData.error;
        res.locals.error = driverData.error;
        res.status(404).render('error')
        // return res.render('error', {error: driverData.error})
    }
    return res.status(200).render('index', {value: driverData.value, message: message }); //--remove when allorders page is available.
    // return res.status(200).redirect('/drivers/allorders'); ---use when page is available
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
        if (dataObj && (await bcrypt.compare(user.password, dataObj.password))) {
          return res.status(200).render('index', { value: 'Successful login' })
        } else {
          res.status(400)
          throw new Error('Invalid emailAddress or password')
        }
      }
    } catch (err) {
      res.locals.message = err;
      res.locals.error = err
      res.render('error')
    }
  }