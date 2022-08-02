"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils/utils");
const drivers_1 = require("../controllers/drivers");
const router = (0, express_1.Router)();
router.post('/register', drivers_1.createDriver);
router.post('/login', drivers_1.logIn);
//verify driver
router.use(utils_1.verifyDriver);
router.get('/allorders', drivers_1.getDriverOrders);
//update driver info
router.put('/update_driver', drivers_1.update);
router.put('/updateOrder/:id', drivers_1.driverConfirmOrder);
exports.default = router;
