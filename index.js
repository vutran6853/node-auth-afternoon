require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();
const port = 3001;

const students = require('./students')
console.log(students);



// INIT SESSION SETTING
app.use(session(  {
  secret: 'ilovecode',
  resave: false,
  saveUninitialized: false
}));

// INIT PASSPORT 
app.use( passport.initialize() );
app.use( passport.session() );


// PASSPORT SET-UP USE
passport.use(  new Auth0Strategy( {
 domain: process.env.DOMAIN,
 clientID: process.env.CLIENT_ID,
 clientSecret: process.env.CLIENT_SECRET,
 callbackURL: '/login',
 scope: 'openid email profile' 
},
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile)
  }
));

// PASSPORT RETURN ALL USER OBJECT BACK
passport.serializeUser( (user, done) => {
  done(null, user)
});

passport.deserializeUser( (user, done) => {
  done(null, user)
});


// ENDPOINT FOR LOGIN AUTH0
app.get('/login', passport.authenticate('auth0', {
  successRedirect: '/students',
  failureRedirect: '/login',
  connection: 'github'
}));

// ENDPOINT WHEN LOGIN IN SUCCESS REDIRCT
app.get('/students', (req, res, next) => {
  res.status(200).send(students);
});

// CHECK IF USER IS AUTHENTICATED
function authenticated(req, res, next) {
  if(req.user) {
    next()
  } else {
    res.sendStatus(401);
  }
}

app.listen( port, () => { 
  console.log(`Server is UP and listening on port ${port}`); 
});