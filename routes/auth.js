const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('login');
});
router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:"/login"
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect("/");
})

module.exports = router;