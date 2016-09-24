import cors from 'cors';
import express from 'express';
import passport from 'passport';
import request from 'superagent';
import sequelize from 'sequelize';
import bodyParser from 'body-parser';
import session from 'express-session';
import FoursquareStrategy from 'passport-foursquare';

import {
  checkin as Checkin,
  user as User
} from './models';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.'+ env +'.json');
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
app.use(bodyParser.urlencoded({ extended: true }));
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

const statics = {
  formatCheckin: (checkin, user) => {
    checkin.event = checkin.event || {};
    checkin.venue = checkin.venue || {};
    checkin.venue.location = checkin.venue.location || {};
    const category = checkin.venue.categories
      .filter(c => c.primary === true)[0].name;

    return {
      id: checkin.id,
      userId: user,
      category,
      venue: checkin.venue.name,
      score: checkin.score ? checkin.score.total : 0,
      checkinTime: checkin.createdAt,
      city: checkin.venue.location.city,
      state: checkin.venue.location.state,
      country: checkin.venue.location.country,
      address: checkin.venue.location.address,
      crossStreet: checkin.venue.location.crossStreet,
      event: checkin.event.name,
      timeZoneOffset: checkin.timeZoneOffset,
    };

  }
};

const routeHandlers = {
  noOp: () => {},
  home: (req, res) => res.send('Hello world'),
  callback: (req, res) => {
    req.session.userId = req.user.id;

    if (req.query.redirect) {
      res.redirect(req.query.redirect);
    }

    res.json(req.user);
  },
  webhook: (req, res) => {
    const checkin = JSON.parse(req.body.checkin);
    const userId = parseInt(checkin.user.id);

    return User.findById(userId).then(user => {
      const formatted = statics.formatCheckin(checkin, userId);

      return Checkin.create(formatted).then(() => {
        return res.sendStatus(204);
      });
    });
  },
  sync: (req, res) => {
    const userId = req.session.userId;

    User.findById(userId).then(user => {
      request
        .get('https://api.foursquare.com/v2/users/self/checkins')
        .query({ oauth_token: user.foursquare_token, v: 20140806, limit: 250 })
        .end((err, res) => {
          const checkins = res.body.response.checkins.items;
          const formatted = checkins.map(c => statics.formatCheckin(c, userId));

          Checkin.bulkCreate(formatted);
        });
    });

    res.sendStatus(204);
  },
  logout: (req, res) => {
    req.logout();

    res.sendStatus(200);
  }
};

app.get('/', routeHandlers.home);
app.get('/authenticate', passport.authenticate('foursquare'), routeHandlers.noOp);
app.get('/authenticate/callback', passport.authenticate('foursquare'), routeHandlers.callback);
app.get('/sessions/destroy', ensureAuthenticated, routeHandlers.logout);
app.get('/sync', ensureAuthenticated, routeHandlers.sync);
app.post('/webhook', routeHandlers.webhook);

app.listen(app.get('port'), () => {
  console.log('checkins.me listening on ' + app.get('port'));
});
