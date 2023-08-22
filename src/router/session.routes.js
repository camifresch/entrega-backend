import { Router } from "express";
import passport from "passport";
import initializePassport from "../config/passport.config.js";

initializePassport();

const sessionRoutes = () => {
    const router = Router();

    router.get('/github', passport.authenticate('github'));

    router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {   
    res.redirect('/');  
    });

    return router;
}

export default sessionRoutes;