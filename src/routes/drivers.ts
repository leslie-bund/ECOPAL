import express, { Router, Response, Request } from 'express'
import { createDriver, logIn } from '../controllers/drivers'
const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.send("driver's route")
})

router.post('/register', createDriver)
router.get('/register', function (req, res, next) {
  res.render('driverregform')
})

//--login
router.get('/login', function (req, res, next) {
  res.render('login')
})
router.post('/login',logIn);

export default router
