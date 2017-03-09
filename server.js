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
  setTimeout(function() {
  let token = '';

  for (let i = 2; i > 0; --i) token += Math.random().toString(36).slice(2);

  let sql = 'INSERT INTO tokens (`token`) VALUES (?)',
    values = [token.slice(-32)];
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
      response.send(JSON.stringify({ 'token': token.slice(-32) }));
    }
  });
  }, 3000);
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
  const date = get_date();

  let sql = 'SELECT startdate FROM cookings WHERE DATE(startdate) = ?',
    values = [date];
  sql = mysql.format(sql, values);

  pool.query(sql, function (error, results, fields) {
    if (error) throw error;

    /**
      If there isn't a result, it means that the cooking hasn't commenced yet
      The app is available for additional orders
    */
    if (!results.length) {
      response.send(JSON.stringify({ 'available': true }));
    } else {
    /**
      Else the cooking has already commenced
      No futher orders will be accepted
      Returns the datetime when the cooking started to process further actions
    */
      const return_values = Object.assign({ 'available': false }, results[0]);
      response.send(JSON.stringify(return_values));
    }
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

        response.send(JSON.stringify({ 'status': true, 'reason': 'updated' }));
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

        response.send(JSON.stringify({ 'status': true, 'reason': 'inserted' }));
      });
    });
  }).catch(function() {
    response.send(JSON.stringify({ 'status': false, 'reason': 'no token found' }));
  });
});


/**
  Place a new order

  Example
  {
    'token': false,
  }
*/
app.post('/delete', (request, response) => {
  const date = get_date();

  /**
    Check if token exists in database
  */
  let is_token_valid = new Promise(function(resolve, reject) {
    let sql = 'DELETE FROM orders WHERE token = ? AND DATE(date) = ?',
      values = [request.body.token, date];
    sql = mysql.format(sql, values);

    pool.query(sql, function (error, results, fields) {
      if (results.affectedRows > 0) {
        resolve();
      } else {
        reject();
      }
    });
  }).then(function(exists) {
    response.send(JSON.stringify({ 'status': true, 'text': 'order deleted' }));
  }).catch(function() {
    response.send(JSON.stringify({ 'status': false, 'text': 'no order deleted' }));
  });
});


app.listen(8080, function() {
  console.log('Eggup is running');
});
