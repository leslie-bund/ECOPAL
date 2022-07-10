import { Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { page: 'home', message: res.locals.message});
});

export default router;
