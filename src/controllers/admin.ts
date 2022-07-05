import { Response, Request } from 'express';
import { addAdmin } from '../models/admin';
import { validateAdminRegInput, emailHasMxRecord, getUserAuthToken } from '../utils/utils';
var debug = require('debug')('ecopal:server');


export async function createAdmin(req: Request, res: Response) {
    let user: AdminReg = {
        companyName: req.body.companyName,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }

    //validate input;
    const { value, error } = await validateAdminRegInput(user);
    if(error){
        const err: string = error.details[0].message;
        return res.status(400).render('index', { message: error.details[0].message });
    }

    // Provide DNS mxRecord Lookup for Admin
    const validMail = await emailHasMxRecord(value.emailAddress);

    if (!validMail) {
        const message = `Please provide a working email address`;
        return res.status(400).render('index', { message: message });
    }

    let message;
    try {   
        const adminData = await addAdmin(user);
        message = `Successfully registered ${adminData.companyName} and ${adminData._id}`;

        // Set user's cookies here before redirecting
        const token = getUserAuthToken(adminData);

        // Redirect the user to the User dashboard route
        res.cookie('authorization', `${token}`);

        // return res.status(200).redirect('/users/getorders'); ---work with this when available!
    } catch (error) {
        message = `Email has been claimed please choose another email`;
        return res.status(200).render('index', { page: 'signup' , message: message });    
        
    }
}
