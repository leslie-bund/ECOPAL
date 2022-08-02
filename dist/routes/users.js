"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils/utils");
const users_1 = require("../controllers/users");
const orders_1 = require("../controllers/orders");
var debug = require('debug')('ecopal:server');
const router = (0, express_1.Router)();
/* GET users listing. */
router.post('/register', users_1.createUser);
router.post('/login', users_1.logIn);
// router.use(verifyUser);
router.get('/getorders', utils_1.verifyUser, users_1.orders);
router.put('/update_user', utils_1.verifyUser, users_1.update);
router.post('/pay', utils_1.verifyUser, orders_1.makeNewOrder);
router.put('/orders/confirm/:id', utils_1.verifyUser, orders_1.confirmOrder);
router.put('/orders/:id', utils_1.verifyUser, orders_1.rescheduleOrder);
exports.default = router;
