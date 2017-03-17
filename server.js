/** DEPENDENCIES */
const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express();

  /**
    Map static resources
    Static resources should be stored in the 'public' folder
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
  host: '',
  user: '',
  password: '',
  database: '',
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
    if (error) throw error;

    /**
      Something went wrong
    */
    if (results.affectedRows == 0) {
      response.send(JSON.stringify({ 'status': 'token generation failed' }));
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
      'startdate': null,
      'quantity': 0,
      'variant': 0,
      'tokenstamp': null,
      'heap_1': 0,
      'heap_2': 0,
      'gateway': true
    }

  let sql = 'SELECT startdate FROM cookings WHERE DATE(startdate) = ?',
    values = [date];
  sql = mysql.format(sql, values);

  pool.query(sql, function(error, results, fields) {
    if (error) throw error;

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
      model.startdate = results[0].startdate;
    }

    sql = 'SELECT date, quantity, variant FROM orders WHERE token = ? AND DATE(date) = ?',
      values = [request.body.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function(error, results, fields) {
      if (error) throw error;

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

        sql = 'SELECT lockdate FROM cookings WHERE DATE(startdate) = ?',
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
        if (error) throw error;

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
        if (error) throw error;

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
        if (error) throw error;

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
    'tokenstamp': '2017-03-10 09:10:00'
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
  const date = get_date(),
    token = request.body.token,
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
        sql = 'INSERT INTO cookings (token) VALUES (?)';
        sql = mysql.format(sql, token);
      } else {
        sql = 'DELETE FROM cookings WHERE DATE(lockdate) = ?';
        sql = mysql.format(sql, date);
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
    model.data = 'token not found';

    response.send(JSON.stringify(model));
  });
});


app.listen(1337, function() {
  console.log('Eggup is running');
});
