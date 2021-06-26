import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import UserModal from '../models/user';

export default function () {
    /**
     * Configure the local  strategy
     */
    passport.use(new Strategy((username: string, password: string, done: any) => {
        UserModal.findOne({ username: username }, (err, user) => {
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
        UserModal.findById(id, (err: any, user: any) => {
            done(err, user);
        });
    });

}