import createError, { HttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
var debug = require('debug')('ecopal:server');

//--Defining the database.
dotenv.config();
mongoose.connect(<string>process.env.MONGO_URL).then(()=>{
  console.log('connected to mongoDb');
}).catch(err => {
  console.error('could not connect to mongoDb\n', err)
})

//--Defining the router
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import driversRouter from './routes/drivers';
import adminRouter from './routes/admin';
import { logout } from './utils/utils';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'));

//-- route to follow when called;
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/drivers', driversRouter);
app.use('/admin', adminRouter);

app.get('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
