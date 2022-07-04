import express, { Router, Response, Request } from 'express';
import { createUser } from '../controllers/users';
const router = Router();

/* GET users listing. */
//--register user
router.post('/register', createUser);

//----
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
