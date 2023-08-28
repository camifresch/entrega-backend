import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import userModel from "../models/users.model.js";
import { createHash } from "../utils.js";

const LocalStrategy = local.Strategy;

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const initializePassport = async () => {
  const githubData = {
    clientID: 'Iv1.574f670264322cb9',
    clientSecret: '3d88a97a3e5f96c4c059b0c78b313232783a99ce',
    callbackUrl: 'http://localhost:3000/api/sessions/githubcallback'
  };

  passport.use(new GitHubStrategy({
    clientID: githubData.clientID,
    clientSecret: githubData.clientSecret,
    callbackURL: githubData.callbackUrl
  }, (accessToken, refreshToken, profile, done) => {
    
    try {
      console.log(profile);
      const user = userModel.findOne({ userName: profile._json.email });

      if (!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    } catch (err) {
      return done(err.message);
    }
    return done(null, profile);
  }));


  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = initializePassport;