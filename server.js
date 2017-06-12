/** DEPENDENCIES */
const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  credentials = require('./static/credentials'),
  passport = require('passport'),
  Strategy = require('passport-facebook').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new Strategy({
    clientID: '699933403531388',
    clientSecret: credentials.secret,
    callbackURL: ''
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.id);
  }));

  /**
    Map static resources
    Static resources should be stored in the 'static' folder
  */
  app.use('/styles', express.static(path.join(__dirname, 'static/')));
  app.use('/scripts', express.static(path.join(__dirname, 'static/')));
  app.use('/assets', express.static(path.join(__dirname, 'static/')));

  /**
    Use body-parser to interpret XHR bodies
  */
  app.use(bodyParser.urlencoded({ extended: true }));


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


/** ROUTING */
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


/**
  Request a new token

  Example
  {
    'token': 'zzn1r0b212mw3lk24l5jt6gvi98gia61v8puakxvht64ezsemi'
  }
*/
app.post('/token', (request, response) => {
  const model = {
    'token': ''
  }

  for (let i = 2; i > 0; --i) model.token += Math.random().toString(36).slice(2);

  let sql = 'INSERT INTO tokens (`token`) VALUES (?)',
    values = [model.token.slice(-32)];
  sql = mysql.format(sql, values);

  pool.query(sql, function (error, results, fields) {
    if (error) response.send(JSON.stringify(model));

    /**
      Something went wrong
    */
    if (results.affectedRows == 0) {
      response.send(JSON.stringify({ 'status': 'Token generation failed' }));
    } else {
    /**
      Token has been successfully generated
    */
      response.send(JSON.stringify({ 'token': model.token.slice(-32) }));
    }
  });
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
      'quantity': 0,
      'variant': 0,
      'tokenstamp': null,
      'heap_1': 0,
      'heap_2': 0,
      'gateway': true
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

    sql = 'SELECT date, quantity, variant FROM orders WHERE token = ? AND DATE(date) = ?',
      values = [request.body.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function(error, results, fields) {
      if (error) response.send(JSON.stringify(model));

      if (results.length) {
        model.quantity = results[0].quantity;
        model.variant = results[0].variant;
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

          response.send(JSON.stringify(model));
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
    Check if token exists in database
  */
  let is_token_valid = new Promise(function(resolve, reject) {
    let sql = 'SELECT token FROM tokens WHERE token = ?',
      values = [request.body.token];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (!results.length) {
        reject();
      } else {
        resolve();
      }
    });
  }).then(function(valid) {
    /**
      The token exists, see if this token has already ordered today
    */
    let quantity = request.body.quantity,
      variant = request.body.variant;

    let already_ordered = new Promise(function(resolve, reject) {
      sql = 'SELECT * FROM orders WHERE `token` = ? AND DATE(date) = ?',
        values = [request.body.token, date];
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
        values = [quantity, variant, request.body.token, date];
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
        values = [request.body.token, quantity, variant];
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
  }).catch(function() {
    model.data = 'no token found';

    response.send(JSON.stringify(model));
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
      values = [request.body.token, date];
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
        values = [request.body.token];
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
  const token = request.body.token,
    state = request.body.state;

  const model = {
    'status': false,
    'data': null
  }

  /**
    Check if token exists in database
  */
  let is_token_valid = new Promise(function(resolve, reject) {
    let sql = 'SELECT token FROM tokens WHERE token = ?';
    sql = mysql.format(sql, token);

    pool.query(sql, function (error, results, fields) {
      if (!results.length) {
        reject();
      } else {
        resolve();
      }
    });
  }).then(function(valid) {
    /**
      The token exists, lock the app
    */
    let lock_the_app = new Promise(function(resolve, reject) {
      if (state === 'true') {
        const date = new Date();

        sql = 'INSERT INTO cookings (token, lockdate) VALUES (?, ?)';
        sql = mysql.format(sql, [token, date]);
      } else {
        const date = get_date();

        sql = 'DELETE FROM cookings WHERE token = ? AND DATE(lockdate) = ?';
        sql = mysql.format(sql, [token, date]);
      }

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
  }).catch(function() {
    model.data = 'Token not found';

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
  const token = request.body.token,
    softboiled = request.body.softboiled,
    hardboiled = request.body.hardboiled;

  const model = {
    'status': false
  }

  /**
    Check if token exists in database
  */
  let is_token_valid = new Promise(function(resolve, reject) {
    let sql = 'SELECT token FROM tokens WHERE token = ?';
    sql = mysql.format(sql, token);

    pool.query(sql, function (error, results, fields) {
      if (!results.length) {
        reject();
      } else {
        resolve();
      }
    });
  }).then(function(valid) {
    /**
      The token exists, lock the app
    */
    let initiate = new Promise(function(resolve, reject) {
      const startdate = new Date(),
        date = get_date();

      sql = 'UPDATE cookings SET startdate = ?, softboiled = ?, hardboiled = ? WHERE token = ? AND DATE(lockdate) = ?';
      sql = mysql.format(sql, [startdate, softboiled, hardboiled, token, date]);

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
  }).catch(function() {
    model.data = 'Token not found';

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
  const date = get_date(),
    token = request.body.token;

  const model = {
    'result': false,
    'data': null
  }

  /**
    Check if token exists in database
  */
  let is_token_valid = new Promise(function(resolve, reject) {
    let sql = 'SELECT token FROM tokens WHERE token = ?';
    sql = mysql.format(sql, token);

    pool.query(sql, function (error, results, fields) {
      if (!results.length) {
        reject();
      } else {
        resolve();
      }
    });
  }).then(function(valid) {
    /**
      The token exists, check if user has locked the app
    */
    let check = new Promise(function(resolve, reject) {
      sql = 'SELECT token FROM cookings WHERE token = ? AND DATE(lockdate) = ?';
      sql = mysql.format(sql, [token, date]);

      pool.query(sql, function (error, results, fields) {
        if (error) reject();

        if (results.length > 0) {
          if (token == results[0].token) model.result = true;

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
  }).catch(function() {
    model.data = 'Token not found';

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
