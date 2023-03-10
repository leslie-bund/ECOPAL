"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyDriver = exports.verifyUser = exports.getUserAuthToken = exports.emailHasMxRecord = exports.logout = exports.validateLoginInput = exports.hashPassword = exports.validateAdminRegInput = exports.validateDriverRegInput = exports.validateRescheduleDate = exports.validateUserPayInput = exports.validateUserRegInput = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import dns from 'dns/promises';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = require("../models/admin");
const drivers_1 = require("../models/drivers");
const users_1 = require("../models/users");
var debug = require('debug')('ecopal:server');
function validateUserRegInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //define a schema
        const schema = joi_1.default.object({
            id: joi_1.default.string(),
            firstname: joi_1.default.string().required(),
            lastname: joi_1.default.string().required(),
            emailAddress: joi_1.default.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] },
            }),
            phone: joi_1.default.string().length(11).required(),
            address: joi_1.default.string().min(5).required(),
            zipcode: joi_1.default.string().length(6).required(),
            password: joi_1.default.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
                .required(),
            confirmPassword: joi_1.default.ref('password'),
        });
        return schema.validate(user);
    });
}
exports.validateUserRegInput = validateUserRegInput;
function validateUserPayInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const year = new Date().getFullYear() % 100;
        const schema = joi_1.default.object({
            fullName: joi_1.default.string().required(),
            binAddress: joi_1.default.string().required(),
            city: joi_1.default.string(),
            zipCode: joi_1.default.string(),
            state: joi_1.default.string(),
            cardNum: joi_1.default.string().max(16).min(14).required(),
            expMonth: joi_1.default.number().min(1).max(12),
            expYear: joi_1.default.number().min(year).max(year + 5),
            cvc: joi_1.default.number().min(0).max(999),
            price: joi_1.default.number()
        });
        return schema.validate(user);
    });
}
exports.validateUserPayInput = validateUserPayInput;
function validateRescheduleDate(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.date().min(Date());
        return schema.validate(date);
    });
}
exports.validateRescheduleDate = validateRescheduleDate;
function validateDriverRegInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //define a schema
        const schema = joi_1.default.object({
            id: joi_1.default.string(),
            firstname: joi_1.default.string().required(),
            lastname: joi_1.default.string().required(),
            emailAddress: joi_1.default.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] },
            }),
            phone: joi_1.default.string().length(11).required(),
            address: joi_1.default.string().min(5).required(),
            zipcode: joi_1.default.string().length(6).required(),
            licenseNumber: joi_1.default.string().alphanum().min(10),
            password: joi_1.default.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
                .required(),
            confirmPassword: joi_1.default.ref('password'),
        });
        return schema.validate(user);
    });
}
exports.validateDriverRegInput = validateDriverRegInput;
function validateAdminRegInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        //define a schema
        const schema = joi_1.default.object({
            id: joi_1.default.string(),
            companyName: joi_1.default.string(),
            emailAddress: joi_1.default.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] },
            }),
            password: joi_1.default.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
                .required(),
            confirmPassword: joi_1.default.ref('password'),
        });
        return schema.validate(user);
    });
}
exports.validateAdminRegInput = validateAdminRegInput;
//hashing passwords
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        return hashed;
    });
}
exports.hashPassword = hashPassword;
//--Validate login users;
function validateLoginInput(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object({
            emailAddress: joi_1.default.string().email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net'] },
            }),
            password: joi_1.default.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,1024}$'))
                .required(),
        });
        return schema.validate(user);
    });
}
exports.validateLoginInput = validateLoginInput;
//logout
exports.logout = (function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie('authorization');
        req.cookies = '';
        res.status(200).redirect('/');
    });
});
function emailHasMxRecord(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const domain = email.split('@')[1];
            // const record = await dns.resolveMx(domain);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.emailHasMxRecord = emailHasMxRecord;
const secretKey = process.env.JWT_SECRET_KEY;
function getUserAuthToken(user) {
    const { password } = user, authUser = __rest(user, ["password"]);
    if (secretKey) {
        return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, authUser), { time: Date.now() }), secretKey, { expiresIn: 3000 });
    }
}
exports.getUserAuthToken = getUserAuthToken;
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.authorization;
        try {
            if (secretKey) {
                const payload = jsonwebtoken_1.default.verify(token, secretKey);
                const confirmUser = yield users_1.UserData.findOne(JSON.parse(JSON.stringify(payload))).exec();
                if (confirmUser) {
                    res.locals.user = confirmUser;
                    if (req.cookies.msg) {
                        res.locals.message = req.cookies.msg;
                        res.clearCookie('msg');
                    }
                    next();
                }
                else {
                    return res.status(400).render('index', { page: 'login', message: 'Please login with valid details' });
                }
            }
        }
        catch (error) {
            // debug(error);
            res.locals.message = 'Please Login again';
            return res.redirect(401, '/');
        }
    });
}
exports.verifyUser = verifyUser;
function verifyDriver(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.authorization;
        try {
            if (secretKey) {
                const payload = jsonwebtoken_1.default.verify(token, secretKey);
                const confirmUser = yield drivers_1.DriverData.findOne(JSON.parse(JSON.stringify(payload))).exec();
                if (confirmUser) {
                    res.locals.user = confirmUser;
                    if (req.cookies.msg) {
                        res.locals.message = req.cookies.msg;
                        res.clearCookie('msg');
                    }
                    next();
                }
                else {
                    return res.status(400).render('index', { page: 'login', message: 'Please login with valid details' });
                }
            }
        }
        catch (error) {
            // debug(error);
            res.locals.message = 'Please Login again';
            return res.redirect(401, '/');
        }
    });
}
exports.verifyDriver = verifyDriver;
function verifyAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.authorization;
        try {
            if (secretKey) {
                const payload = jsonwebtoken_1.default.verify(token, secretKey);
                const confirmUser = yield admin_1.AdminData.findOne(JSON.parse(JSON.stringify(payload))).exec();
                if (confirmUser) {
                    res.locals.user = confirmUser;
                    if (req.cookies.msg) {
                        res.locals.message = req.cookies.msg;
                        res.clearCookie('msg');
                    }
                    next();
                }
                else {
                    return res.status(400).render('index', { page: 'login', message: 'Please login with valid details' });
                }
            }
        }
        catch (error) {
            // debug(error);
            res.locals.message = 'Please Login again';
            return res.redirect(401, '/');
        }
    });
}
exports.verifyAdmin = verifyAdmin;
