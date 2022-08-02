"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils/utils");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
router.post('/register', admin_1.createAdmin);
router.post('/login', admin_1.logIn);
router.use(utils_1.verifyAdmin);
router.get('/alldrivers', admin_1.getDrivers);
router.put('/update/:id', admin_1.update);
// 
router.put('/updateDriver/:id', admin_1.changeDriverInfo);
router.get('/updatePrice', function (req, res, next) {
});
router.post('/updatePrice', function (req, res, next) {
});
// Add admin routes after login
exports.default = router;
