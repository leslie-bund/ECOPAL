import express, { Response, Request } from 'express'
import { addUser, editUser, getOrders, logInUser } from '../models/users'
import {
  validateUserRegInput,
  emailHasMxRecord,
  getUserAuthToken,
  validateLoginInput,
} from '../utils/utils'
import bcrypt from 'bcrypt'
var debug = require('debug')('ecopal:server')

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
    confirmPassword: req.body.confirmPassword,
  }

  //validate input;
  const { value, error } = await validateUserRegInput(user)
  if (error) {
    return res
      .status(400)
      .render('index', { page: 'signup', message: error.details[0].message })
  }

  // Perform User email DNS mxRecord lookup
  const validMail = await emailHasMxRecord(value.emailAddress)

  if (!validMail) {
    const message = `Please provide a working email address`
    return res.status(400).render('index', { page: 'signup', message: message })
  }

  const userData = await addUser(user)
  if (userData.error) {
    return res
      .status(200)
      .render('index', { page: 'signup', message: JSON.stringify(userData) })
  }

  if (!userData.error) {
    // Set user's cookies here before redirecting
    const token = getUserAuthToken(JSON.parse(JSON.stringify(userData.value)))

    // Redirect the user to the User dashboard route
    res.cookie('authorization', `${token}`)

    // return res.status(200).redirect('/users/getorders'); ---work with this when available!
    res.redirect('/users/getorders')
    // return res.status(200).render('index', { page: 'home' , message: 'Successful Signup' });
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
      if (!dataObj?.error && (await bcrypt.compare(user.password, dataObj?.value.password))) {
        const token = getUserAuthToken(
          JSON.parse(JSON.stringify(dataObj.value)),
        )
        res.cookie('authorization', `${token}`)

        // Redirect to user dashboard --when dashboard is ready
        res.redirect('/users/getorders')
        return;
      } else {
        res.status(400);
        throw new Error('Invalid emailAddress or password')
      }
    }
  } catch (err) {
    return res.status(400).render('index', { page: 'login', message: err })
  }
}



//update
export async function update(req: Request, res: Response) {
  if (!req.body) {
    const message = 'No data provided'
    return res.status(400).render('error', { error: message })
  }
  const result = await editUser(res.locals.user._id, req.body)
  if (result.error) {
    return res.status(404).render('error', { error: result.error })
  }
  //testing
  const token = getUserAuthToken(JSON.parse(JSON.stringify(result.value)))
  res.cookie('authorization', `${token}`)
  res.cookie('msg', 'Successfully updated')
  res.redirect('/users/getorders')
}

//orders
export async function orders(_req: Request, res: Response) {
  const orderArr = await getOrders(res.locals.user.emailAddress);

  return res.status(200).render('userDashboard', { 
      page: 'orders', 
      message: res.locals.message || `Successful logged in user \n ${res.locals.user.firstname}`, 
      user: res.locals.user,
      orders: orderArr
  })

}