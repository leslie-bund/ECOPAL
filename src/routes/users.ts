import express, { Router, Response, Request } from 'express';
import { createUser } from '../controllers/users';
const router = Router();

/* GET users listing. */
//--register user

//----
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', createUser);

router.get('/getorders', function(req, res, next) {

})

router.post('/post', function(req, res, next) {

})

router.put('/update', function(req, res, next) {

})

router.post('/login', function(req, res, next) {

})

router.get('/pay', function(req, res, next) {

})

router.post('/pay', function(req,res, next) {

})

router.put('/orders/confirm', function(req, res, next) {

})

router.put('/orders/:id', function(req, res, next) {

})


export default router;
