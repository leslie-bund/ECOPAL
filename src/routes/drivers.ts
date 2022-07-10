import express, { Router, Response, Request } from 'express';
import { verifyDriver } from '../utils/utils';
import { createDriver, logIn } from '../controllers/drivers';
const router = Router();

router.post('/register', createDriver);
router.post('/login',logIn);


router.use(verifyDriver);

router.get('/allorders', function(req, res, next) {

    // res.locals.user holds objet of driver's details. Have to strigify and parse to retrieve the data from bson
    return res.status(200).render('driverDashboard', { 
        page: 'profile', 
        message: `Successful logged in driver \n ${res.locals.user.firstname}`, 
        user: res.locals.user
    });

})

// router.post('/register', function(req, res, next) {

// })

// router.post('/login', function(req, res, next) {

// })

router.put('/updateOrder', function(req, res, next) {

})

// Add driver routes after login


export default router
