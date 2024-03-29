import {Router} from "express";
import userModel from "../models/users.model.js"

const UsersRouter = (io) => {
    const router = Router();

    router.get('/users', async (req, res) => {
        try {
            const process = await userModel.find();
            res.status(200).send({ status: 'OK', data: process });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err.message });
        }
    });

    router.get('/setcookie', async (req, res) => {
        try {
            res.cookie('cookie1', 'Contenido1', { maxAge: 60000, signed: true });
            res.status(200).send({ status: 'OK', data: 'Cookie1 generada' });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err.message });
        }
    });

    router.get('/getcookies', async (req, res) => {
        try {
            res.status(200).send({ status: 'OK', data: req.signedCookies });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err.message });
        }
    });

    router.get('/deletecookies', async (req, res) => {
        try {
            res.clearCookie('cookie1');
            res.status(200).send({ status: 'OK', data: 'Cookie1 borrada' });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err.message });
        }
    });

    router.get('/login', async (req, res) => {
        try {
            let data;
            if (req.session.counter) {
                req.session.counter++;
                data = `Este sitio ha sido visitado ${req.session.counter} veces`;
            } else {
                req.session.counter = 1;
                req.session.userState = 'validated';
                data = 'Bienvenido, gracias por su primer visita!';
            }
            res.status(200).send({ status: 'OK', data: data });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err.message });
        }
    });
    
    router.get('/logout', async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    res.status(200).send({ status: 'OK', data: 'ERROR al cerrar sesión' });
                } else {
                    res.status(200).send({ status: 'OK', data: 'Usuario deslogueado' });
                }
            });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err.message });
        }
    });
    
return router;
}

export default UsersRouter