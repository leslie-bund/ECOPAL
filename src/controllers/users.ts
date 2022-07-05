import express, { Response, Request } from 'express';
import { addUser } from '../models/users';
import { validateUserRegInput, emailHasMxRecord, getUserAuthToken } from '../utils/utils';
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
    let message;
    try {   
        const userData = await addUser(user);
        message = `Successfully registered ${userData.firstname} ${userData.lastname} and ${userData._id}`;

        // Set user's cookies here before redirecting
        const token = getUserAuthToken(userData);

        // Redirect the user to the User dashboard route
        res.cookie('authorization', `${token}`);

        // return res.status(200).redirect('/users/getorders'); ---work with this when available!
    } catch (error) {
        message = `Email has been claimed please choose another email`;
        return res.status(200).render('index', { page: 'signup' , message: message });    
        
    }

}


