import express, { Response, Request } from 'express';
import { addAdmin, logInAdmin } from '../models/admin';
import { AdminReg, Login, validateAdminRegInput, validateLoginInput } from '../utils/utils';
import bcrypt from 'bcrypt'


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
        res.locals.message = err;
        res.locals.error = err
        res.status(400).render('error')
        // return res.status(400).render('error', {error: err});
    }

    // Provide DNS mxRecord Lookup for Admin

    const adminData = await addAdmin(user);
    const message = 'Successfully registered';
    if(adminData.error){
        res.locals.message = adminData.error;
        res.locals.error = adminData.error;
        res.status(404).render('error')
        // return res.render('error', {error: adminData.error})
    }
    return res.status(200).render('index', {value: adminData.value, message: message});  //--remove when allorders page is available.
    // return res.status(200).redirect('/admin/alldrivers') -- use when page is available.
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
        const dataObj = await logInAdmin(user)
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
