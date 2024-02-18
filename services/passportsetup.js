import passport from "passport";
import google from "passport-google-oauth20";
var GoogleStrategy = google.Strategy;
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);
