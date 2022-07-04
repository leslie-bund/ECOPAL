import express, { Router, Response, Request } from 'express';
import { createUser } from '../controllers/users';
const router = Router();

/* GET users listing. */
//--register user
router.get('/register', function(req, res, next) {
  res.render('userregisterpage');
});
//--
router.post('/register', createUser);



export default router;
