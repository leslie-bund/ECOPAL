import express, { Response, Request } from 'express';
import { addAdmin } from '../models/admin';
import { AdminReg, validateAdminRegInput } from '../utils/utils';


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
    return res.status(200).render('index', {value: adminData, message: message});  //--remove when allorders page is available.
    // return res.status(200).redirect('/admin/alldrivers') -- use when page is available.
}
