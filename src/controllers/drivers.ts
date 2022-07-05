import express, { Response, Request } from 'express';
import { addDriver } from '../models/drivers';
import { validateDriverRegInput, emailHasMxRecord, getUserAuthToken } from '../utils/utils';
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
        return res.status(400).render('index', { message: error.details[0].message });
    }

    // Provide DNS mx Records lookup
    const validMail = await emailHasMxRecord(value.emailAddress);

    if (!validMail) {
        const message = `Please provide a working email address`;
        return res.status(205).render('index', { page: 'signup', message: message });
    }

    let message;
    try {   
        const driverData = await addDriver(user);
        message = `Successfully registered ${driverData.firstname} ${driverData.lastname} and ${driverData._id}`;


        // Set user's cookies here before redirecting
        const token = getUserAuthToken(driverData);

        // Redirect the user to the User dashboard route
        res.cookie('authorization', `${token}`);
        
        // return res.status(200).redirect('/users/getorders'); ---work with this when available!

        
    } catch (error) {
        message = `Email has been claimed please choose another email`;
        return res.status(200).render('index', { page: 'signup' , message: message });    
        
    }
}