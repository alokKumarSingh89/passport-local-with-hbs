const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user')

/* List User */
router.get('/new',  async (req, res, next) => {
    res.render("signup");
});

router.post("/", async (req, res, next) => {
    const { username, password } = req.body;
    const exists = await User.exists({ username });
    if (exists) {
        res.redirect("/new?error=error");
        return;
    }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return next(err);
            const newAdmin = new User({
                username,
                password: hash,
            });
            newAdmin.save();
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });
    })
});
module.exports = router;