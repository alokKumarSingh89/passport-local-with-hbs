import  * as express from 'express';
import  passport from 'passport';

const router = express.Router();

router.get('/login', (req:express.Request, res:express.Response, next) => {
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

export default router;