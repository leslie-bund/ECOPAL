import express, { Response, Request } from 'express'
import { addUser, logInUser } from '../models/users'
import {
  Login,
  UserReg,
  validateLoginInput,
  validateUserRegInput,
} from '../utils/utils'
import bcrypt from 'bcrypt'

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
    const err: string = error.details[0].message
    res.locals.message = err;
    res.locals.error = err
    return res.status(400).render('error')
  }
  // Perform User email DNS mxRecord lookup

  const userData = await addUser(user)
  const message = 'Successfully registered'
  if (userData.error) {
    res.locals.message = userData.error;
    res.locals.error = userData.error;
    return res.render('error')
  }
  return res
    .status(200)
    .render('index', { value: userData.value, message: message })
  // return res.status(200).redirect('/users/getorders'); ---work with this when available!
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
