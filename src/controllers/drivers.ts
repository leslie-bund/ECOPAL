import express, { Response, Request } from 'express';
import { addDriver } from '../models/drivers';
import { DriverReg, validateDriverRegInput } from '../utils/utils';


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
        return res.status(400).render('error', { error: err });
    }

    // Provide DNS mx Records lookup


    const driverData = await addDriver(user);
    const message = 'Successfully registered';
    return res.status(200).render('index', {value: driverData, message: message }); //--remove when allorders page is available.
    // return res.status(200).redirect('/drivers/allorders'); ---use when page is available
}