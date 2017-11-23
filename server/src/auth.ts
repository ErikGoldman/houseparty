import * as express from "express";
import * as passport from "passport";
import * as GoogleOAuth2 from "passport-google-oauth20";

import { User } from "./entity/user";
import { Log } from "./logger";

export const authenticationRouter = express.Router();

passport.use(new GoogleOAuth2.Strategy({
    accessType: "offline",
    callbackURL: "/auth/google/callback",
    clientID: process.env.GOOGLE_CLIENT_ID || "708248790163-83eu58rq81ggueigkv5g0dratrrju9q1.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_SECRET || "skvwqGtuVVhZWRWRA6onMR8N",
    scope: ["email", "profile"],
  },
  (
    accessToken: string, refreshToken: string | void, profile: any,
    done: (err?: Error, user?: any) => any,
  ) => {
    return User.getByGoogleId(undefined, profile.id, true)
    .then((user) => {
      if (!user) {
        user = new User();
        user.displayName = profile.displayName;
        user.email = profile.emails[0].value;
        user.givenName = profile.name.givenName;
        user.familyName = profile.name.familyName;
        user.googleId = profile.id;
        user.photoUrl = profile.photos.length > 0 ? profile.photos[0].value : null;
        user.hasSignedUp = true;
        return user.save();
      }
      return user;
    })
    .then((user) => {
      done(undefined, user);
    })
    .catch((err: Error) => {
      done(err);
    });
  }),
);
passport.serializeUser((user: User, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((userId: number, cb) => {
  User.getById(undefined, userId, true)
  .then((user) => {
    if (!user) {
      Log.error("User not found", { userId });
      cb(new Error("User not found"));
      return;
    }
    cb(null, user);
  });
});

authenticationRouter.get(
  "/login/google",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "/auth/loginError",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

authenticationRouter.get('/google/callback',
  passport.authenticate( 'google', {
    successRedirect: "/",
    failureRedirect: "/auth/loginError",
  },
));

authenticationRouter.get("/loginError", (req, res, next) => {
  res.status(500);
  res.send("There was a problem logging in!");
});
