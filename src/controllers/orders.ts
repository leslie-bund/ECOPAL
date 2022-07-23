import { addOrder, OrderData, postPone } from "../models/orders";
import { Request, Response } from 'express';
import { zipCodeDays } from "./admin";
import { validateRescheduleDate, validateUserPayInput } from "../utils/utils";
var debug = require('debug')('ecopal:server');

export async function makeNewOrder(req: Request, res: Response) {

    const { value, error } = await validateUserPayInput(req.body);
    if (error) {
        res.cookie('msg', `${error}`);
        return res.redirect('/users/getorders')
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
        res.cookie('msg', `${res.locals.user.firstname}<br> Order Successful `)
        return res.redirect('/users/getorders')
    } else {
        res.cookie('msg', `Order unsuccessful <br> please try again`)
        return res.redirect('/users/getorders')
    }
}

export async function rescheduleOrder(req: Request, res: Response) {
    
    const { value, error } = await validateRescheduleDate(req.body.newDate);
    
    if (error) {
        res.cookie('msg', 'Cannot backdate rescheduled')
        return res.redirect('/users/getorders');
    }
    const result = await postPone(req.params.id, req.body);
    if (result.modifiedCount > 0) {
        res.cookie('msg', 'Pickup rescheduled')
        return res.redirect('/users/getorders');
    }
}

export async function confirmOrder(req: Request, res: Response) {
    //  For confirming the orders - from driver's side
   const updated = await OrderData.updateOne({ _id: req.params.id}, {
    $set : { [`trips.${req.body.index}.userConfirm`] : true }
  })

  
  if(updated.modifiedCount > 0) {
    res.cookie('msg', 'Confirmed');
    return res.redirect('/users/getorders');
  }
  res.cookie('msg', 'Unsuccessful');
  return res.redirect('/users/getorders');
}