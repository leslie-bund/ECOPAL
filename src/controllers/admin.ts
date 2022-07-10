import { Response, Request } from 'express'
import {
  validateAdminRegInput,
  emailHasMxRecord,
  validateLoginInput,
  getUserAuthToken,
} from '../utils/utils'
var debug = require('debug')('ecopal:server')
import { addAdmin, logInAdmin, editAdmin } from '../models/admin'
import bcrypt from 'bcrypt'

export async function createAdmin(req: Request, res: Response) {
  let user: AdminReg = {
    companyName: req.body.companyName,
    emailAddress: req.body.emailAddress,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  }

  //validate input;
  const { value, error } = await validateAdminRegInput(user)
  if (error) {
    const err: string = error.details[0].message
    return res
      .status(400)
      .render('index', { page: 'signup', message: error.details[0].message })
  }

  // Provide DNS mxRecord Lookup for Admin
  const validMail = await emailHasMxRecord(value.emailAddress)

  if (!validMail) {
    const message = `Please provide a working email address`
    return res.status(400).render('index', { page: 'signup', message: message })
  }

  const adminData = await addAdmin(user)

  // Set user's cookies here before redirecting
  if (!adminData.error) {
    const token = getUserAuthToken(JSON.parse(JSON.stringify(adminData.value)))

    // Redirect the user to the User dashboard route
    res.cookie('authorization', `${token}`)
    // return res.status(200).redirect('/users/getorders'); ---work with this when available!
    res.redirect('/admin/alldrivers');
    // return res.status(200).render('index', { page: 'home', value: 'Successful signup admin' });
  }

  if(adminData.error) {
      let message = `Email has been claimed please choose another email`;
      return res.status(200).render('index', { page: 'signup' , message: message });   
  }
}

//loginUser;
export async function logIn(req: Request, res: Response) {
    try {
      let user: Login = {
        emailAddress: req.body.emailAddress,
        password: req.body.password,
      }
      const { error } = await validateLoginInput(user);
      if (!error) {
        const dataObj = await logInAdmin(user)
        if (!dataObj?.error && (await bcrypt.compare(user.password, dataObj?.value.password))) {
            const token = getUserAuthToken(JSON.parse(JSON.stringify(dataObj.value)));
            res.cookie('authorization', `${token}`);

            // redirect to Admin dashboard.
            res.redirect('/admin/alldrivers');
        } else {
          res.status(400);
          throw new Error('Invalid emailAddress or password');
        }
      }
    } catch (err) {
        return res.render('index', { page: 'login' , message: err });
    }
}

export const zipCodeDays: {[k: string]: number} = {
  "100": 1, //Mon
  "200": 2, //Tue
  "300": 3, //Wed
  "400": 4, //Thur
  "500": 5, //Fri
  "600": 6, //Sat
  "700": 1,
  "800": 3,
  "900": 4
}

//update
export async function update (req: Request, res: Response){
  if(!req.body){
      const message = 'No data provided'
      return res.status(400).render('error', {error: message});
  }
  const result = await editAdmin(req.params.id, req.body);
 if(result.error){
     return res.status(404).render('error', {error: result.error});
 }
 console.log("Bug"+req.body);
 console.log("Bug2"+result.value);
 return res.status(200).render('index',{page: 'login', message: result.value});
//    res.status(200).redirect('/users/getallorders'); --use when page is ready.

}
