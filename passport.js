// passport.js
const passport = require('passport');
const passportJWT = require('passport-jwt');
require('dotenv').config();

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

// Configure its options
let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET, // Using environment variable for secret
};

// Initialize the strategy
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);

  if (jwt_payload) {
    // Ensure req.user has the necessary properties
    next(null, {
      _id: jwt_payload._id,
      userName: jwt_payload.userName,
      // Removed fullName and role as they are not present in the payload
    });
  } else {
    next(null, false);
  }
});

// Use the strategy with Passport
passport.use(strategy);

module.exports = passport;
