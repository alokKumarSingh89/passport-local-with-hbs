import express from 'express';
import session from 'express-session';
import hbs from 'express-handlebars'
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import authRouter from './routes/auth.js';
import accountRouter from './routes/account.js';
import userRouter from './routes/users';

import "./types/User"

const app = express();
const PORT: string = process.env.PORT || '3000';
const MONGODB_URL: string | undefined = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL + '/passport_local', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

import "./boot/auth";
/**
 * middleware
 */
app.engine('hbs', hbs(({ extname: '.hbs' })));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'))
app.use(logger('dev'));
app.use(session({
    secret: 'dontknowwhatis',
    resave: false,
    saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());

// Passport config
app.use(passport.initialize());
app.use(passport.session());

/**Configure Routes */
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/account", accountRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
