const express       = require('express');
const session       = require('express-session');
const hbs           = require('express-handlebars')
const mongoose      = require('mongoose');
const passport      = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');

const app           = express();
const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

const User = require('./models/user')

mongoose.connect(MONGODB_URL+'/passport_local', {
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

/**
 * middleware
 */
app.engine('hbs', hbs(({ extname: '.hbs' })));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'))
app.use(session({
    secret: 'dontknowwhatis',
    resave: false,
    saveUninitialized:true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Passport config
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new localStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect Username' });
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) return done(err);
            if (res === false) return done(null, false, { message: 'Incorrect Pasword' });
            return done(null, user);
        });
    });
}));

app.get('/', (req, res) => {
   res.render("index",{title: "Home"}) 
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
