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

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login")
}

const isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect("/")
}

app.get('/', isLoggedIn, (req, res) => {
   res.render("index",{title: "Home"}) 
});


app.get('/login', isLoggedOut, (req, res) => {
    const content = {
        title: "Login",
        error: req.query.error
    }
    res.render('login', content);
});

app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect:"/login?error=true"
}));

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

//setup our admin
app.get('/setup', async(req, res) => {
    const exists = await User.exists({ username: 'admin' });
    if (exists) {
        console.log(exists, "exists");
        res.redirect("/login");
        return;
    }

    bcrypt.genSalt(10, function (err, salt){
        if(err) {
            return next(err);
        }

        bcrypt.hash('pass', salt, function (err, hash){
            if(err) return next(err);
            const newAdmin = new User({
                username: 'admin',
                password: hash,
            });
            newAdmin.save();

            res.redirect("/login");
        });
    });

});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
