const passport = require('passport');
const Strategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = function () {
    /**
     * Configure the local  strategy
     */
    passport.use(new Strategy((username, password, done) => {
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

    // To Store authentication in pass , need to supply serializeUser and deserializeUser
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
    
}