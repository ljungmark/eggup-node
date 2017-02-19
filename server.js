const express = require('express'),
  app = express(),
  path = require('path');

  /**
    Map static resources
    Static resources should be stored in the 'public' folder
  */
  app.use('/styles', express.static(path.join(__dirname, 'static/')));
  app.use('/scripts', express.static(path.join(__dirname, 'static/')));

const mysql = require('mysql');
const pool  = mysql.createPool({
	connectionLimit: 10,
	host: '',
	user: '',
	password: '',
	database: '',
	dateStrings: true /** Don't return dates as actual dates, but rather as strings */
});

function get_date(date) {
  current_date = new Date(),
  year = current_date.getFullYear(),
  month = ('0' + (current_date.getMonth() + 1)).slice(-2),
  day = ('0' + current_date.getDate()).slice(-2),
  date = year + '-' + month + '-' + day;
}

/** ROUTING */
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

/**
  Synchronize the application with the database
  Retrives the current application status from the database
  Returns JSON encoded object with availability and possibly a stringified datetime.

  Example
  {
    'available': false,
    'date': '2017-02-17 09:12:09'
  }
*/
app.post('/synchronize', function(request, response) {
	const date = get_date();

	let sql = 'SELECT date FROM cookings WHERE DATE(date) = ?',
		values = [date];
	sql = mysql.format(sql, values);

	pool.query(sql, function (error, results, fields) {
    if (error) throw error;

    /**
      If there isn't a result, it means that the cooking hasn't commenced yet
      The app is availaboe for additional orders
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

app.listen(8080);
