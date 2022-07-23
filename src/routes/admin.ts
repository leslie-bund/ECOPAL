import express, { Router, Response, Request } from 'express';
import { verifyAdmin } from '../utils/utils'; 
import { createAdmin, logIn, update, getDrivers, changeDriverInfo } from '../controllers/admin';
const router = Router();


router.post('/register', createAdmin);
router.post('/login',logIn);



router.use(verifyAdmin)

router.get('/alldrivers', getDrivers)

router.put('/update/:id', update );

// 
router.put('/updateDriver/:id', changeDriverInfo)

router.get('/updatePrice', function(req,res, next) {

})

router.post('/updatePrice', function(req, res, next) {

})
// Add admin routes after login

export default router;