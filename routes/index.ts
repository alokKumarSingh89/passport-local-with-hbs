import * as express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req : express.Request, res : express.Response, next) {
  res.render('index', { user: req.user });
});

export default router;