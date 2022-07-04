import express, { Response, Request } from 'express';
import { addAdmin, addDriver, addUser, readAllUsers } from '../models/users';
import { AdminReg, DriverReg, UserReg, validateAdminRegInput, validateDriverRegInput, validateUserRegInput } from '../utils/utils';


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
        const err: string = error.details[0].message;
        return res.status(400).render('error', { error: err });
    }

    // Perform User email DNS mxRecord lookup


    const userData = await addUser(user);
    const message = 'Successfully registered';
    return res.status(200).render('index', {value: userData, message: message });    
}

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
    return res.status(200).render('index', {value: driverData, message: message });
}

export async function createAdmin(req: Request, res: Response) {
    let user: AdminReg = {
        companyName: req.body.companyName,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    //validate input;
    const { error } = await validateAdminRegInput(user);
    if(error){
        const err: string = error.details[0].message;
        return res.status(400).render('error', {error: err});
    }

    // Provide DNS mxRecord Lookup for Admin


    const adminData = await addAdmin(user);
    const message = 'Successfully registered';
    return res.status(200).render('index', {value: adminData, message: message});
}

// export async function getAllUsers(req: Request, res: Response) {
//     const allUsers = await readAllUsers();
//     if(!allUsers){
//         return res.status(400).render('index', {})
//     }
// }

