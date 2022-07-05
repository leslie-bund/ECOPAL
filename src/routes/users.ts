import express, { Router, Response, Request } from 'express';
import { createUser, logIn } from '../controllers/users';
const router = Router();

/* GET users listing. */
//--register user
router.get('/register', function(req, res, next) {
  res.render('userregisterpage');
});
router.post('/register', createUser);

//--login
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', logIn);


export default router;
