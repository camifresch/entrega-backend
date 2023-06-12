import {Router} from "express";
import Users from "../controllers/users.dbclass.js";

const UsersRouter = (io) => {
    const router = Router();
    const manager = new Users();

    router.get('/users', async (req, res) => {
        try {
            const users = await manager.getUsers();
            res.status(200).send({ status: 'OK', data: users });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    
return router;
}

export default UsersRouter