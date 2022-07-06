import express, { Response, Request } from 'express';
import { addUser, logInUser } from '../models/users';
import { validateUserRegInput, emailHasMxRecord, getUserAuthToken, validateLoginInput } from '../utils/utils';
import bcrypt from 'bcrypt';
var debug = require('debug')('ecopal:server');


export async function createUser(req: Request, res: Response) {
  //define the request from the user;
  let user: UserReg = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    emailAddress: req.body.emailAddress,
    phone: req.body.phone,
    address: req.body.address,
    zipcode: req.body.zipcode,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
    }

    //validate input;
    const { value, error } = await validateUserRegInput (user);
    if(error){
        return res.status(400).render('index', { page: 'signup', message: error.details[0].message });
    }

    // Perform User email DNS mxRecord lookup
    const validMail = await emailHasMxRecord(value.emailAddress);

    if (!validMail) {
        const message = `Please provide a working email address`;
        return res.status(400).render('index', { page: 'signup', message: message });
    }

    const userData = await addUser(user);
    if (userData.error) {
        return res.status(200).render('index', { page: 'signup' , message: userData }); 
    }

    if(!userData.error) {
        // Set user's cookies here before redirecting
        const token = getUserAuthToken(JSON.parse(JSON.stringify(userData)));

        // Redirect the user to the User dashboard route
        res.cookie('authorization', `${token}`);

        // return res.status(200).redirect('/users/getorders'); ---work with this when available!
        return res.status(200).render('index', { page: 'login' , message: 'Successful Login' });
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
      const dataObj = await logInUser(user)
      if (dataObj && (await bcrypt.compare(user.password, dataObj.password))) {
        const token = getUserAuthToken(JSON.parse(JSON.stringify(dataObj)));
        res.cookie('authorization', `${token}`);

        // Redirect to user dashboard
        return res.status(200).render('index', { message: 'Successful login' })
      } else {
        res.status(400)
        throw new Error('Invalid emailAddress or password')
      }
    }
  } catch (err) {
    return res.status(400).render('index', { page: 'login' , message: err });
  }
}
