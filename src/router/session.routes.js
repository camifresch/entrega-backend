import { Router } from "express";
import passport from "passport";
import initializePassport from "../config/passport.config.js";

initializePassport();

const sessionRoutes = () => {
    const router = Router();

    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', {
  successRedirect: '/products',
  failureRedirect: '/login'
}));

    return router;
}

export default sessionRoutes;