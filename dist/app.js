"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const method_override_1 = __importDefault(require("method-override"));
var debug = require('debug')('ecopal:server');
//--Defining the database.
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URL).then(() => {
    console.log('connected to mongoDb');
}).catch(err => {
    console.error('could not connect to mongoDb\n', err);
});
//--Defining the router
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const drivers_1 = __importDefault(require("./routes/drivers"));
const admin_1 = __importDefault(require("./routes/admin"));
const utils_1 = require("./utils/utils");
const app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((0, method_override_1.default)('_method'));
//-- route to follow when called;
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use('/drivers', drivers_1.default);
app.use('/admin', admin_1.default);
app.get('/logout', utils_1.logout);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
