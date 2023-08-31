import { Router } from "express";
import Users from "../controllers/users.dbclass.js";
import Products from "../controllers/ProductManager.js";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../models/users.model.js";
import initializePassport from "../config/passport.config.js";
import passport from "passport";

const users = new Users();
const manager = new Products();

const mainRoutes = (io, store, baseUrl, productsPerPage) => {
  const router = Router();

  router.get("/", async (req, res) => {
    if (req.session !== null && req.session.userValidated) {
      if (req.query.page === undefined) req.query.page = 0;

      const result = await manager.getProductsPaginated(
        req.query.page * productsPerPage,
        productsPerPage,
      );

      const pagesArray = [];
      for (let i = 0; i < result.totalPages; i++)
        pagesArray.push({ index: i, indexPgBar: i + 1 });

      const pagination = {
        baseUrl: baseUrl,
        limit: result.limit,
        offset: result.offset,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        page: result.page - 1,
        nextPageUrl: `${baseUrl}?page=${result.nextPage - 1}`,
        prevPageUrl: `${baseUrl}?page=${result.prevPage - 1}`,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        pagesArray: pagesArray,
      };

      res.render("products", {
        products: result.docs,
        pagination: pagination,
        user: req.sessionStore,
      });
    } else {
      console.log("Error al recuperar datos de sesión");
      res.render("login", { sessionInfo: req.session }); 
    }
  });

  router.get('/login', async (req, res) => {
    res.render('login');
  });

  router.get("/register", async (req, res) => {
    res.render("registration", {});
  });

  router.get("/logout", async (req, res) => {
    req.session.userValidated = req.sessionStore.userValidated = false;

    req.session.destroy((err) => {
      req.sessionStore.destroy(req.sessionID, (err) => {
        if (err) console.log(`Error al destruir sesión (${err})`);
        console.log("Sesión destruída");
        res.redirect(baseUrl);
      });
    });
  });

  router.post("/login", async (req, res) => {
    req.sessionStore.userValidated = false;
    const { login_email, login_password } = req.body;
    const user = await userModel.findOne({ userName: login_email });

    if (!user) {
      req.sessionStore.errorMessage = "No se encuentra el usuario";
    } else if (!isValidPassword(user, login_password)) {
      req.sessionStore.errorMessage = "Clave incorrecta";
      // res.redirect('http://localhost:3000');
    } else {
      req.session.userValidated = true; 
      req.session.errorMessage = "";
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
    }

    res.redirect(baseUrl);
  });

  router.get("/regfail", async (req, res) => {
    res.render("registration_err", {});
  });

  router.post("/register", passport.authenticate("register", { failureRedirect: "/regfail" }),
    async (req, res) => {
      const { firstName, lastName, userName, password } = req.body;
      if (!firstName || !lastName || !userName || !password)
        res.status(400).send("Faltan campos obligatorios en el body");
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: createHash(password),
        role: 'usuario',
      };
      const process = userModel.create(newUser);
      res.status(200).send(process);
    },
  );

  return router;
};

export default mainRoutes;
