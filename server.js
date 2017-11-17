/** DEPENDENCIES */
const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  credentials = require('./static/credentials'),
  strategies = require('./static/strategies'),
  passport = require('passport'),
  facebookStrategy = require('passport-facebook').Strategy,
  googleStrategy = require('passport-google-oauth20').Strategy,
  twitterStrategy = require('passport-twitter').Strategy,
  steamStrategy = require('passport-steam').Strategy,
  githubStrategy = require('passport-github2').Strategy,
  redditStrategy = require('passport-reddit').Strategy,
  spotifyStrategy = require('passport-spotify').Strategy,
  linkedinStrategy = require('passport-linkedin').Strategy,
  instagramStrategy = require('passport-instagram').Strategy;

  /**
   * Set up Facebook strategy
   */
  passport.use(new facebookStrategy({
    clientID: strategies.facebook.client,
    clientSecret: strategies.facebook.secret,
    profileFields: ['id', 'displayName', 'emails'],
    callbackURL: strategies.facebook.callback
  },
  function(accessToken, refreshToken, profile, done) {
    passportParser(profile, done, 'facebook');
  }));

  /**
   * Set up Google strategy
   */
  passport.use(new googleStrategy({
    clientID: strategies.google.clientID,
    clientSecret: strategies.google.clientSecret,
    callbackURL: strategies.google.callbackURL,
    scope: ['email']
  },
  function(accessToken, refreshToken, profile, done) {
    passportParser(profile, done, 'google');
  }));

  /**
   * Set up Twitter strategy
   */
  passport.use(new twitterStrategy({
    consumerKey: strategies.twitter.consumerKey,
    consumerSecret: strategies.twitter.consumerSecret,
    userProfileURL: strategies.twitter.userProfileURL,
    callbackURL: strategies.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    passportParser(profile, done, 'twitter');
  }));

  /**
   * Set up Steam strategy
   */
  passport.use(new steamStrategy({
    returnURL: strategies.steam.returnURL,
    realm: strategies.steam.realm,
    apiKey: strategies.steam.apiKey
  },
  function(identifier, profile, done) {
    passportParser(profile, done, 'steam');
  }));

  /**
   * Set up Github strategy
   */
  passport.use(new githubStrategy({
    clientID: strategies.github.clientID,
    clientSecret: strategies.github.clientSecret,
    callbackURL: strategies.github.callbackURL,
    scope: ['user:email']
  },
  function(accessToken, refreshToken, profile, done) {
    passportParser(profile, done, 'github');
  }));

  /**
   * Set up Reddit strategy
   */
  passport.use(new redditStrategy({
    clientID: strategies.reddit.clientID,
    clientSecret: strategies.reddit.clientSecret,
    callbackURL: strategies.reddit.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    passportParser(profile, done, 'reddit');
  }));

  /**
   * Set up Spotify strategy
   */
  passport.use(new spotifyStrategy({
    clientID: strategies.spotify.clientID,
    clientSecret: strategies.spotify.clientSecret,
    callbackURL: strategies.spotify.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    passportParser(profile, done, 'spotify');
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  /**
   * Set up Linkedin strategy
   */
  passport.use(new linkedinStrategy({
    consumerKey: strategies.linkedin.clientID,
    consumerSecret: strategies.linkedin.clientSecret,
    callbackURL: strategies.linkedin.callbackURL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address']
  },
  function(token, tokenSecret, profile, done) {
    passportParser(profile, done, 'linkedin');
  }
  ));

  passport.use(new instagramStrategy({
    clientID: strategies.instagram.clientID,
    clientSecret: strategies.instagram.clientSecret,
    callbackURL: strategies.instagram.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      passportParser(profile, done, 'instagram');
    }
  ));

  function passportParser(profile, done, strategy) {
    let emails,
      email_query;

    if (profile.emails) {
      emails = [];
      profile.emails.forEach(function(email) {
        emails.push(`'${email.value}'`);
      });
      emails = emails.join(`,`);
      email_query = ` email IN (${emails}) OR `;
    } else {
      email_query = ' ';
    }

    sql = `SELECT * FROM tokens WHERE${email_query}${strategy} = ? LIMIT 1`,
      values = [profile.id];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (error) {
        done(error);
      } else {
        let token = (results.length) ? results[0].token : Math.random().toString(36).slice(2, 12),
          email = (results.length) ? results[0].email : (profile.emails) ? profile.emails[0].value : '',
          overwrite = (strategy == 'facebook') ? '?' : 'COALESCE(name, ?)' ;

        sql = `INSERT INTO tokens (token, email, name, created, visit, ${strategy}) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?) ` +
          `ON DUPLICATE KEY UPDATE name = ${overwrite}, visit = CURRENT_TIMESTAMP, ${strategy} = COALESCE(${strategy}, ?)`,
          values = [token, email, profile.displayName, profile.id, profile.displayName, profile.id];
        sql = mysql.format(sql, values);

        pool.query(sql, function (error, results, fields) {
          if (error) {
            done(error);
          } else {
            sql = 'SELECT * FROM tokens WHERE token = ?',
              values = [token];
            sql = mysql.format(sql, values);

            pool.query(sql, function (error, results, fields) {
              if (error) {
                done(error);
              } else {
                return done(null, results[0]);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Map static resources
   * Static resources should be stored in the 'static' folder
   */
  app.use('/styles', express.static(path.join(__dirname, 'static/')));
  app.use('/scripts', express.static(path.join(__dirname, 'static/')));
  app.use('/assets', express.static(path.join(__dirname, 'static/')));
  app.use('/app', express.static(path.join(__dirname, 'app/')));

  /**
   * Use body-parser to interpret XHR bodies
   */
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(require('cookie-parser')());
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Middleware check to verify valid credentials
   */
  function verify(request, response, next) {
    if (request.user) {
      next();
    } else {
      response.redirect('/login');
    }
  }

/** DATABASE */
const mysql = require('mysql');
const pool  = mysql.createPool({
  connectionLimit: 10,
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
  dateStrings: true /** Don't return dates as actual dates, but rather as strings */
});


/** HELPER FUNCTIONS */
function get_date(date) {
  current_date = new Date(),
  year = current_date.getFullYear(),
  month = ('0' + (current_date.getMonth() + 1)).slice(-2),
  day = ('0' + current_date.getDate()).slice(-2),
  date = year + '-' + month + '-' + day;

  return date;
}

function stats(request) {
  const soft_boiled_eggs_in_eggup1 = 686,
    hard_boiled_eggs_in_eggup1 = 287,
    soft_boiled_eggs_in_eggup2 = 48,
    hard_boiled_eggs_in_eggup2 = 20,
    stats = {
    'number_of_users': 0,
    'number_of_soft_boiled': soft_boiled_eggs_in_eggup1 + soft_boiled_eggs_in_eggup2,
    'number_of_hard_boiled': hard_boiled_eggs_in_eggup1 + hard_boiled_eggs_in_eggup2,
    'total_eggs_ordered': soft_boiled_eggs_in_eggup1 + soft_boiled_eggs_in_eggup2 + hard_boiled_eggs_in_eggup1 + hard_boiled_eggs_in_eggup2,
    'past_two_weeks': {},
    'my_orders': 0
  }

  pool.query('SELECT COUNT(*) AS number_of_users FROM tokens', function(error, results, fields) {
    stats.number_of_users = results[0].number_of_users;
  });

  pool.query('SELECT SUM(quantity) AS number_of_soft_boiled FROM orders WHERE variant = 1', function(error, results, fields) {
    stats.number_of_soft_boiled += results[0].number_of_soft_boiled;
    stats.total_eggs_ordered = stats.total_eggs_ordered + results[0].number_of_soft_boiled;
  });

  pool.query('SELECT SUM(quantity) AS number_of_hard_boiled FROM orders WHERE variant = 2', function(error, results, fields) {
    stats.number_of_hard_boiled += results[0].number_of_hard_boiled;
    stats.total_eggs_ordered = stats.total_eggs_ordered + results[0].number_of_hard_boiled;
  });

  pool.query('SELECT SUM(quantity) AS quantity, DATE(date) as date FROM orders GROUP BY DATE(date) ORDER BY date DESC LIMIT 30', function(error, results, fields) {
    stats.past_two_weeks = results;
  });

  let sql = 'SELECT SUM(quantity) as quantity FROM eggup3.orders WHERE token = ?',
    values = [request.user.token];
  sql = mysql.format(sql, values);

  pool.query(sql, function(error, results, fields) {
    stats.my_orders = results[0].quantity;
  });

  return stats;
}


/** ROUTING */
app.get('/', verify, (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/login', (request, response) => {
  response.sendFile(path.join(__dirname + '/authenticate.html'));
});

app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/');
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/google',
  passport.authenticate('google', { scope: 'email'}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/steam',
  passport.authenticate('steam', { scope: 'user-read-email'}));

app.get('/auth/steam/callback',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ]}));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/reddit', function(request, response, next){
  passport.authenticate('reddit', {
    state: 'eggup',
    duration: 'permanent',
  })(request, response, next);
});

app.get('/auth/reddit/callback', function(request, response, next){
  passport.authenticate('reddit', {
    successRedirect: '/',
    failureRedirect: '/login'
  })(request, response, next);
});

app.get('/auth/spotify',
  passport.authenticate('spotify', { scope: 'user-read-email'}));

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/linkedin',
  passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });

app.get('/auth/instagram',
  passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(request, response) {
    response.redirect('/');
  });


/**
  Synchronize the application with the database
  Retrives the current application status from the database
  Returns JSON encoded object with availability and possibly a stringified datetime

  Example
  {
    'available': false,
    'date': '2017-02-17 09:12:09'
  }
*/
app.post('/synchronize', (request, response) => {
  const date = get_date(),
    model = {
      'available': false,
      'lockdate': null,
      'startdate': null,
      'softboiled': null,
      'hardboiled': null,
      'past_soft': null,
      'past_hard': null,
      'quantity': 0,
      'variant': 0,
      'feedback': null,
      'tokenstamp': null,
      'heap_1': 0,
      'heap_2': 0,
      'gateway': true,
      'stats': stats(request)
    };

  let sql = 'SELECT lockdate, startdate, softboiled, hardboiled FROM cookings WHERE DATE(lockdate) = ?',
    values = [date];
  sql = mysql.format(sql, values);

  pool.query(sql, function(error, results, fields) {
    if (error) response.send(JSON.stringify(model));

    /**
      If there isn't a result, it means that the cooking hasn't commenced yet
      The app is available for additional orders
    */
    if (!results.length) {
      model.available = true;
    } else {
    /**
      Else the cooking has already commenced
      No futher orders will be accepted
      Returns the datetime when the cooking started to process further actions
    */
      model.lockdate = results[0].lockdate;
      model.startdate = results[0].startdate;
      model.softboiled = results[0].softboiled;
      model.hardboiled = results[0].hardboiled;
    }

    sql = 'SELECT date, quantity, variant, feedback FROM orders WHERE token = ? AND DATE(date) = ?',
      values = [request.user.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function(error, results, fields) {
      if (error) response.send(JSON.stringify(model));

      if (results.length) {
        model.quantity = results[0].quantity;
        model.variant = results[0].variant;
        model.feedback = results[0].feedback;
        model.tokenstamp = results[0].date.substring(0, 10);
      }


      sql = 'SELECT * FROM orders WHERE DATE(date) = ?',
        values = [date];
      sql = mysql.format(sql, values);

      pool.query(sql, function (error, results, fields) {
        for (var index = 0; index < results.length; index++) {
          if (results[index].variant == 1) {
            model.heap_1 = model.heap_1 + results[index].quantity;
          } else {
            model.heap_2 = model.heap_2 + results[index].quantity;
          }
        }

        sql = 'SELECT token, lockdate FROM cookings WHERE DATE(lockdate) = ?',
          values = [date];
        sql = mysql.format(sql, values);

        pool.query(sql, function (error, results, fields) {
          if (results.length) {
            model.gateway = false;
          }

          sql = 'SELECT softboiled, hardboiled FROM cookings ORDER BY startdate DESC LIMIT 1';

          pool.query(sql, function (error, results, fields) {
            if (results.length) {
              model.past_soft = results[0].softboiled;
              model.past_hard = results[0].hardboiled;
            }

            response.send(JSON.stringify(model));
          });
        });
      });
    });
  });
});


/**
  Place a new order

  Example
  {
    'token': false,
  }
*/
app.post('/request', (request, response) => {
  const date = get_date();

  /**
    Default model
  */
  const model = {
    'status': false,
    'data': null,
    'heap_1': 0,
    'heap_2': 0
  }

  /**
    The token exists, see if this token has already ordered today
  */
  let quantity = request.body.quantity,
    variant = request.body.variant;

  let already_ordered = new Promise(function(resolve, reject) {
    sql = 'SELECT * FROM orders WHERE `token` = ? AND DATE(date) = ?',
      values = [request.user.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (error) response.send(JSON.stringify(model));

      if (!results.length) {
        reject();
      } else {
        resolve();
      }
    });

  }).then(function(exists) {
    /**
      Previous order today exists for this token, update already existing order
    */
    sql = 'UPDATE orders SET `quantity` = ?, `variant` = ? WHERE `token` = ? AND DATE(date) = ?',
      values = [quantity, variant, request.user.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (error) response.send(JSON.stringify(model));

      model.status = true;
      model.data ='updated';

      response.send(JSON.stringify(model));
    });
  }).catch(function() {
    /**
      No previous order for this token has been found today, create a new
    */
    sql = 'INSERT INTO orders (token, quantity, variant) VALUES (?, ?, ?)',
      values = [request.user.token, quantity, variant];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (error) response.send(JSON.stringify(model));

      model.status = true;
      model.data ='inserted';

      sql = 'SELECT * FROM orders WHERE DATE(date) = ?',
        values = [date];
      sql = mysql.format(sql, values);

      pool.query(sql, function (error, results, fields) {
        for (var index = 0; index < results.length; index++) {
          if (results[index].variant == 1) {
            model.heap_1 = model.heap_1 + results[index].quantity;
          } else {
            model.heap_2 = model.heap_2 + results[index].quantity;
          }
        }

        response.send(JSON.stringify(model));
      });
    });
  });
});


/**
  Delete a order

  Example
  {
    'status': true,
    'tokenstamp': '2017-03-10 09:10:00',
    'heap_1': 4,
    'heap_2': 8
  }
*/
app.post('/delete', (request, response) => {
  const date = get_date();

  /**
    Default model
  */
  const model = {
    'status': false,
    'tokenstamp': null,
    'heap_1': 0,
    'heap_2': 0
  }

  /**
    Remove the order from the database
  */
  let delete_order = new Promise(function(resolve, reject) {
    let sql = 'DELETE FROM `orders` WHERE `token` = ? AND DATE(date) = ?',
      values = [request.user.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (results.affectedRows > 0) {
        model.status = true;

        resolve();
      } else {
        reject();
      }
    });
  }).then(function(exists) {
    /**
      See if there's a previous order made by this user
      If so, set the tokenstamp to that date
      If not, reject the prmoise and send default tokenstamp
    */
    let tokenstamp = new Promise(function(resolve, reject) {
      sql = 'SELECT date FROM `orders` WHERE `token` = ? ORDER BY `date` DESC LIMIT 1',
        values = [request.user.token];
      sql = mysql.format(sql, values);

      pool.query(sql, function (error, results, fields) {
        if (results.length > 0) {
          model.tokenstamp = results[0].date.slice(0, 10);

          resolve();
        } else {
          reject();
        }
      });
    }).then(function(exists) {
      sql = 'SELECT * FROM orders WHERE DATE(date) = ?',
        values = [date];
      sql = mysql.format(sql, values);

      pool.query(sql, function (error, results, fields) {
        for (var index = 0; index < results.length; index++) {
          if (results[index].variant == 1) {
            model.heap_1 = model.heap_1 + results[index].quantity;
          } else {
            model.heap_2 = model.heap_2 + results[index].quantity;
          }
        }

        response.send(JSON.stringify(model));
      });
    }).catch(function() {
      sql = 'SELECT * FROM orders WHERE DATE(date) = ?',
        values = [date];
      sql = mysql.format(sql, values);

      pool.query(sql, function (error, results, fields) {
        for (var index = 0; index < results.length; index++) {
          if (results[index].variant == 1) {
            model.heap_1 = model.heap_1 + results[index].quantity;
          } else {
            model.heap_2 = model.heap_2 + results[index].quantity;
          }
        }

        response.send(JSON.stringify(model));
      });
    });
  }).catch(function() {
    response.send(JSON.stringify(model));
  });
});


/**
  Lock down app from receiveing more

  Example
  {
    'token': false,
  }
*/
app.post('/lock', (request, response) => {
  const state = request.body.state;

  const model = {
    'status': false,
    'data': null
  }

  let lock_the_app = new Promise(function(resolve, reject) {
    if (state === 'true') {
      sql = 'INSERT INTO cookings (token) VALUES (?)';
      sql = mysql.format(sql, [request.user.token]);
    } else {
      const date = get_date();

      sql = 'DELETE FROM cookings WHERE token = ? AND DATE(lockdate) = ?';
      sql = mysql.format(sql, [request.user.token, date]);
    }

    pool.query(sql, function (error, results, fields) {
      if (error) {
        reject();
      } else {
        model.status = true;

        resolve();
      }
    });
  }).then(function(exists) {
    response.send(JSON.stringify(model));
  }).catch(function() {
    response.send(JSON.stringify(model));
  });
});


/**
  Lock down app from receiveing more

  Example
  {
    'token': false,
  }
*/
app.post('/start', (request, response) => {
  const softboiled = request.body.softboiled,
    hardboiled = request.body.hardboiled;

  const model = {
    'status': false
  }

  /**
    The token exists, lock the app
  */
  let initiate = new Promise(function(resolve, reject) {
    const startdate = new Date(),
      date = get_date();

    sql = 'UPDATE cookings SET startdate = ?, softboiled = ?, hardboiled = ? WHERE token = ? AND DATE(lockdate) = ?';
    sql = mysql.format(sql, [startdate, softboiled, hardboiled, request.user.token, date]);

    pool.query(sql, function (error, results, fields) {
      if (error) reject();

      if (results.affectedRows > 0) {
        model.status = true;

        resolve();
      } else {
        reject();
      }
    });
  }).then(function(exists) {
    response.send(JSON.stringify(model));
  }).catch(function() {
    response.send(JSON.stringify(model));
  });
});



/**
  Is the user the controller?

  Example
  {
    'result': false,
  }
*/
app.post('/controller', (request, response) => {
  const date = get_date();

  const model = {
    'result': false,
    'data': null
  }

  let check = new Promise(function(resolve, reject) {
    sql = 'SELECT token FROM cookings WHERE token = ? AND DATE(lockdate) = ?';
    sql = mysql.format(sql, [request.user.token, date]);

    pool.query(sql, function (error, results, fields) {
      if (error) reject();

      if (results.length) {
        if (request.user.token == results[0].token) model.result = true;

        resolve();
      } else {
        reject();
      }
    });
  }).then(function(exists) {
    response.send(JSON.stringify(model));
  }).catch(function() {
    response.send(JSON.stringify(model));
  });
});



/**
  Recieve feedback

  Example
  {
    'result': false,
  }
*/
app.post('/feedback', (request, response) => {
  const date = get_date();

  const model = {
    'result': false
  }

  let value = request.body.value;

  let check = new Promise(function(resolve, reject) {
    sql = 'UPDATE orders SET feedback = ? WHERE token = ? AND DATE(date) = ?';
    sql = mysql.format(sql, [value, request.user.token, date]);

    pool.query(sql, function (error, results, fields) {
      if (error) reject();

      if (results.affectedRows) {
        model.result = true;

        resolve();
      } else {
        reject();
      }
    });
  }).then(function(exists) {
    response.send(JSON.stringify(model));
  }).catch(function() {
    response.send(JSON.stringify(model));
  });
});



/**
 * Update highscore
 */
app.post('/snook', (request, response) => {
  const model = {
    'toplist': {}
  }

  let score = request.body.score;

  let check = new Promise(function(resolve, reject) {
    sql = 'UPDATE tokens SET snook = ?, snooktime = NOW() WHERE token = ? AND snook < ?';
    sql = mysql.format(sql, [score, request.user.token, score]);

    pool.query(sql, function (error, results, fields) {
      if (error) reject();

      sql = 'SELECT name, snook FROM tokens ORDER BY snook DESC LIMIT 3';

      pool.query(sql, function (error, results, fields) {
        if (error) reject();

        model.toplist = results;

        resolve();
      });
    });
  }).then(function(exists) {
    response.send(JSON.stringify(model));
  }).catch(function() {
    response.send(JSON.stringify(model));
  });
});



/**
 * Set up broadcasting emitters
 */
io.sockets.on('connection', function (socket) {
  socket.on('gateway', function (data) {
    socket.broadcast.emit('gateway', data);
  });

  socket.on('start', function (data) {
    socket.broadcast.emit('start', data);
  });

  socket.on('heap', function(data) {
    const date = get_date();
    let heap_1 = 0,
      heap_2 = 0;

    let check_heap = new Promise(function(resolve, reject) {
      sql = 'SELECT * FROM orders WHERE DATE(date) = ?',
        values = [date];
      sql = mysql.format(sql, values);

      pool.query(sql, function (error, results, fields) {
        for (var index = 0; index < results.length; index++) {
          if (results[index].variant == 1) {
            heap_1 = heap_1 + results[index].quantity;
          } else {
            heap_2 = heap_2 + results[index].quantity;
          }
        }

        resolve();
      });
    }).then(function() {
      socket.broadcast.emit('heap', {
        heap_1: heap_1,
        heap_2: heap_2
      });
    });
  });
});

http.listen(1337, function() {
  console.log('Eggup is running');
});
