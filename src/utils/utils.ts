import * as fs from 'fs'
import { Stream } from 'stream'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import express, { Response, Request, NextFunction } from 'express'


export interface UserReg {
    firstname: string
    lastname: string
    emailAddress: string
    phone: string
    address: string
    zipcode: string
    password: string
    confirmPassword: string
}

export interface DriverReg{
    firstname: string
    lastname: string
    emailAddress: string
    phone: string
    address: string
    zipcode: string
    licenseNumber: string
    password: string
    confirmPassword: string
}

export interface AdminReg{
    companyName: string
    emailAddress: string
    password: string
    confirmPassword: string
}


export async function validateUserRegInput(user: UserReg) {
    //define a schema
    const schema = Joi.object({
        id: Joi.string(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        emailAddress: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] },
          }),
        phone: Joi.string().length(11).required(),
        address: Joi.string().min(5).required(),
        zipcode: Joi.string().length(6).required(),
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
        .required(),
        confirmPassword: Joi.ref('password'),
    })
    return schema.validate(user)
    
}

export async function validateDriverRegInput(user: DriverReg) {
    //define a schema
    const schema = Joi.object({
        id: Joi.string(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        emailAddress: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] },
          }),
        phone: Joi.string().length(11).required(),
        address: Joi.string().min(5).required(),
        zipcode: Joi.string().length(6).required(),
        licenseNumber: Joi.string().alphanum().min(10),
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
        .required(),
        confirmPassword: Joi.ref('password'),
    })
    return schema.validate(user)
    
}

export async function validateAdminRegInput(user: AdminReg) {
    //define a schema
    const schema = Joi.object({
        id: Joi.string(),
        companyName: Joi.string(),
        emailAddress: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] },
          }),
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
        .required(),
        confirmPassword: Joi.ref('password'),
    })
    return schema.validate(user)
    
}

//hashing passwords
export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)
    return hashed
}

//logout
export const logout =( async function(req: Request, res: Response, next: NextFunction){
    res.cookie('token', '')
    req.cookies.token = ''
    res.cookie('user', '')
    req.cookies.user = ''
    // res.cookie(req.cookies.token, '') 
    res.status(200).redirect('/users/login');
})

