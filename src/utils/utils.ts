import Joi from 'joi'
import bcrypt from 'bcrypt'
import dns from 'dns/promises';
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { AdminData } from '../models/admin';
import { DriverData } from '../models/drivers';
import { UserData } from '../models/users';
var debug = require('debug')('ecopal:server');




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

//--Validate login users;
export async function validateLoginInput(user: Login) {
    const schema = Joi.object({
      emailAddress: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      }),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
        .required(),
    })
    return schema.validate(user);
  }

//logout
export const logout =( async function(req: Request, res: Response, next: NextFunction){
    res.cookie('token', '')
    req.cookies.token = ''
    res.cookie('user', '')
    req.cookies.user = ''
    // res.cookie(req.cookies.token, '') 
    res.status(200).redirect('/');
})

export async function emailHasMxRecord(email: string): Promise<boolean> {
    try {
        const domain = email.split('@')[1];
        const record = await dns.resolveMx(domain);
        return true;
    } catch (error) {
        return false;
    }
}
const secretKey = process.env.JWT_SECRET_KEY;

export function getUserAuthToken(user: user) {
    const { password, ...authUser } = user;
    if (secretKey) {
        return jwt.sign({ ...authUser, time: Date.now() }, secretKey, { expiresIn: 300 }) 
    }
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authorization;

    try {
        if(secretKey) {
            const payload = jwt.verify(token, secretKey);
            const confirmUser = await UserData.findOne(JSON.parse(JSON.stringify(payload))).exec();
            next();
        }
    } catch (error) {
        debug(error);
    }
}

export async function verifyDriver(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authorization;

    try {
        if(secretKey) {
            const payload = jwt.verify(token, secretKey);
            const confirmUser = await DriverData.findOne(JSON.parse(JSON.stringify(payload))).exec();
            next();
        }
    } catch (error) {
        debug(error);
    }
}


export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authorization;

    try {
        if(secretKey) {
            const payload = jwt.verify(token, secretKey);
            const confirmUser = await AdminData.findOne(JSON.parse(JSON.stringify(payload))).exec();
            next();
        }
    } catch (error) {
        debug(error);
    }
}