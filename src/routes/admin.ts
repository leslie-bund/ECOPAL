import express, { Router, Response, Request } from 'express';
import { verifyAdmin } from '../utils/utils'; 
import { createAdmin, logIn, update } from '../controllers/admin';
const router = Router();


router.post('/register', createAdmin);
router.post('/login',logIn);

//update Admin info
router.put('/update/:id', update );

// router.get('/update/:id', updateUser);

router.use(verifyAdmin)

router.get('/alldrivers', function(req, res, next) {

    // res.locals.user holds objet of admin's details. Have to strigify and parse to retrieve the data from bson
    return res.status(200).render('adminDashboard', { 
        page: 'profile', 
        message: `Successful logged in Admin \n ${res.locals.user.companyName}`, 
        user: res.locals.user
    });
})

router.put('/updateDriver/:id', function(req, res, next) {

})

router.get('/updatePrice', function(req,res, next) {

})

router.post('/updatePrice', function(req, res, next) {

})
// Add admin routes after login

export default router;