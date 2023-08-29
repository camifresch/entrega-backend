import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import userModel from "../models/users.model.js";
import { createHash } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = async () => {
  const githubData = {
    clientID: 'Iv1.574f670264322cb9',
        clientSecret: '3d88a97a3e5f96c4c059b0c78b313232783a99ce',
        callbackUrl: 'http://localhost:3000/api/sessions/githubcallback'
        
    /* clientID: "Iv1.2160438db8b06c53",
    clientSecret: "88dfabd35a94c47466d448cae5d1d0274711355b",
    callbackUrl: "http://localhost:3000/api/sessions/githubcallback", */
  };

  const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      const user = await userModel.findOne({ userName: profile._json.email });

      if (!user) {
        req.sessionStore.userValidated = true;
        return done(null, profile);

      } else {
        req.sessionStore.userValidated = false;

        return done(null, false);
  
      }
    } catch (err) {
      return done(err.message);
    }
  };

  passport.use("github", new GithubStrategy(githubData, verifyAuthGithub));

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "userName",
        passwordField: "password",
        session: false,
      },
      async (userName, password, done) => {
        try {
          const exists = await userService.getUserBy({ userName: userName });
          if (exists)
            return done(null, false, {
              message: "El usuario ya se encuentra registrado",
            });

          const newUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: createHash(password),
          };

          let result = await userService.addUser(newUser);
          return done(null, result);
        } catch (err) {
          return done(err.message);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err.message);
    }
  });
};

export default initializePassport;