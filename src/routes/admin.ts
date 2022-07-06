import express, { Router, Response, Request } from 'express';
import { verifyAdmin } from '../utils/utils'; 
import { createAdmin, logIn } from '../controllers/admin';
const router = Router();


router.post('/register', createAdmin);
router.post('/login',logIn);

router.use(verifyAdmin)

router.get('/alldrivers', function(req, res, next) {

})

router.put('/updateDriver/:id', function(req, res, next) {

})

router.get('/updatePrice', function(req,res, next) {

})

router.post('/updatePrice', function(req, res, next) {

})
// Add admin routes after login

export default router;