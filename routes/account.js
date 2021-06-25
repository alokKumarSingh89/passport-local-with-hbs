var express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var router = express.Router();

const User = require('../models/user')

/* List User */
router.get('/', ensureLoggedIn(), async (req, res, next) => {
    const users = await User.find({});
    res.render("profile", { users });
});

module.exports = router;