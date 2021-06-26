import * as express from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
var router = express.Router();

import UserModel from '../models/user';

/* List User */
router.get('/', ensureLoggedIn(), async (req: express.Request, res: express.Response, next) => {
    const users: User[] = await UserModel.find({});
    res.render("profile", { users });
});

export default router;