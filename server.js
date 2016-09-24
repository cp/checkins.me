import cors from 'cors';
import express from 'express';
import passport from 'passport';
import request from 'superagent';
import sequelize from 'sequelize';
import session from 'express-session';
import FoursquareStrategy from 'passport-foursquare';

import {
  checkin as Checkin,
  user as User
} from './models';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
const clientId = config.clientId || process.env.CLIENT_ID;
const clientSecret = config.clientSecret || process.env.CLIENT_SECRET;
const callbackURL = config.callbackURL || process.env.CALLBACK_URL;
const sessionSecret = config.session || process.env.SESSION;
const app = express();

const authStrategy = new FoursquareStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
  }, (token, _, profile, done) => {
    User.createFromProfileAndToken(profile, token).spread(user => {
      return done(null, user.toJson());
    });
  }
);

passport.use(authStrategy);

app.set('port', process.env.PORT || 4200);
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  saveUninitialized: true,
  secret: sessionSecret,
  resave: false
}));
app.use(cors());

passport.serializeUser((user, done) => {
  done(null, { userId: user.id });
});

passport.deserializeUser((user, done) => {
  done(null, { userId: user.id });
});

const ensureAuthenticated = (req, res, next) => {
  return next();
  //if (req.isAuthenticated()) { return next(); }

  //res.sendStatus(401);
}

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/authenticate', passport.authenticate('foursquare'), (req, res) => {});

app.get('/authenticate/callback', passport.authenticate('foursquare'), (req, res) => {
  req.session.userId = req.user.id;

  if (req.query.redirect) {
    res.redirect(req.query.redirect);
  }

  res.json(req.user);
});

app.get('/sync', ensureAuthenticated, (req, res) => {
  const userId = req.session.userId;

  User.findById(userId).then(user => {
    request
      .get('https://api.foursquare.com/v2/users/self/checkins')
      .query({ oauth_token: user.foursquare_token, v: 20140806, limit: 250 })
      .end((err, res) => {
        const checkins = res.body.response.checkins.items;

        Checkin.createFromResponseAndUser(checkins, userId).then(created => {
          console.log('created', created);
        });
      });
  });

  res.sendStatus(204);
});

app.get('/sessions/destroy', ensureAuthenticated, (req, res) => {
  req.logout();

  res.sendStatus(200);
});

app.listen(app.get('port'), () => {
  console.log('checkins.me listening on ' + app.get('port'));
});
