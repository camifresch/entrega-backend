import { Router } from "express";
import passport from "passport";
import initializePassport from "../config/passport.config.js";

initializePassport();

const sessionRoutes = () => {
    const router = Router();

    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
      // Vacío
    });

    router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
      req.session.user = req.user;
      res.redirect('/api/product/products');
    });

    return router;
}

export default sessionRoutes;