const express       = require('express');
const session       = require('express-session');
const hbs           = require('express-handlebars')
const mongoose      = require('mongoose');
const passport      = require('passport');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');

const indexRouter   = require('./routes/index');
const authRouter    = require('./routes/auth.js');
const accountRouter = require('./routes/account.js');
const userRouter    = require('./routes/users');

const app           = express();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const User = require('./models/user')

mongoose.connect(MONGODB_URL+'/passport_local', {
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

require("./boot/auth");
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
    saveUninitialized:true
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
// app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
