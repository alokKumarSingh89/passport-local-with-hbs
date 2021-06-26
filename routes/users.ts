import  * as express from 'express';
import  bcrypt from 'bcrypt';
const router = express.Router();

import  UserModal from '../models/user'

/* List User */
router.get('/new',  async (req:express.Request, res: express.Response, next) => {
    res.render("signup");
});

router.post("/", async (req:express.Request, res: express.Response, next) => {
    const { username, password }: User = req.body;
    const exists:boolean = await UserModal.exists({ username });
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
            const user = new UserModal({
                username,
                password: hash,
            });
            user.save();
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });
    })
});
export default router;