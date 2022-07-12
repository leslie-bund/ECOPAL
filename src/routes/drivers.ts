import express, { Router, Response, Request } from 'express';
import { verifyDriver } from '../utils/utils';
import { createDriver, logIn, update } from '../controllers/drivers';
const router = Router();

router.post('/register', createDriver);
router.post('/login',logIn);

//verify driver
router.use(verifyDriver);

router.get('/allorders', function(req, res, next) {

    // res.locals.user holds objet of driver's details. Have to strigify and parse to retrieve the data from bson
    return res.status(200).render('driverDashboard', { 
        page: 'profile', 
        message: res.locals.message || `Successful logged in driver \n ${res.locals.user.firstname}`, 
        user: res.locals.user
    });

})

//update driver info
router.put('/update_driver', update);

router.put('/updateOrder', function(req, res, next) {

     // For confirming the orders - from driver's side
    //  OrderData.updateOne({ _id: 'orderID'}, {
    //   $set : { 'trips.indexOfOrder.driverconfirm' : true }
    // })
})

// Add driver routes after login


export default router
