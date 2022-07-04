import express, { Response, Request } from 'express';
import { addUser } from '../models/users';
import { UserReg, validateUserRegInput } from '../utils/utils';


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
        console.log(err);
        return res.render('error', { error: err });
    }

    // Perform User email DNS mxRecord lookup


    const userData = await addUser(user);
    const message = 'Successfully registered';
    return res.status(200).render('index', {value: userData, message: message });    
    // return res.status(200).redirect('/users/getorders'); ---work with this when available!
}

// export async function getAllUsers(req: Request, res: Response) {
//     const allUsers = await readAllUsers();
//     if(!allUsers){
//         return res.status(400).render('index', {})
//     }
// }

