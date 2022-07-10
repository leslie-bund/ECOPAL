import { addOrder } from "../models/orders";
import { Request, Response } from 'express';
import { zipCodeDays } from "./admin";
import { validateUserPayInput } from "../utils/utils";
var debug = require('debug')('ecopal:server');

export async function makeNewOrder(req: Request, res: Response) {

    const { value, error } = await validateUserPayInput(req.body);
    if (error) {
        return res.render('userDashboard', { 
            page: 'pay', 
            message: error, 
            user: res.locals.user 
        })
    }

    let dayOfWeekForZip: number = 0;
    for (let i of Object.keys(zipCodeDays)) {
        if(+value.zipCode.slice(-3) > +i) {
            dayOfWeekForZip = zipCodeDays[i];
        }
    }
    
    const currentDate = new Date();
    const dayOfWeekOfPay = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() + Math.abs(dayOfWeekForZip - dayOfWeekOfPay))

    const dateArr = []
    for (let i = 0; i < value.price; i++) {
        dateArr.push(currentDate.toISOString());
        currentDate.setDate(currentDate.getDate() + 14);
    }

    let validOrder: order = {
        user: {
            fullName: value.fullName,
            email: res.locals.user.emailAddress
        },
        addressOfBin: value.binAddress,
        zipCode: value.zipCode,
        trips: dateArr.map(element => {
            return {
                driverConfirm: false,
                userConfirm: false,
                date: new Date(element)
            }
        })
    }

    const orderObj = await addOrder(validOrder);

    if (!orderObj.error) {
        return res.status(200).render('userDashboard', { 
            page: 'pay', 
            message: `Successful added user Order \n ${res.locals.user.firstname}`, 
            user: res.locals.user 
        })
    } else {
        return res.status(200).render('userDashboard', { 
            page: 'profile', 
            message: `Order Unsuccessful please try again`, 
            user: res.locals.user 
        })
    }

    // return res.send(req.body);
}