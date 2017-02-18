let express = require('express');
let app = express();
let path = require('path');

let mysql = require('mysql');
let pool  = mysql.createPool({
	connectionLimit: 10,
	host: '',
	user: '',
	password: '',
	database: '',
	dateStrings: true
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/synchronize', function(request, response) {
	const current_date = new Date(),
		year = current_date.getFullYear(),
		month = ('0' + (current_date.getMonth() + 1)).slice(-2),
		day = ('0' + current_date.getDate()).slice(-2),
		date = year + '-' + month + '-' + day;

		console.log(date);

	let sql = 'SELECT date FROM cookings WHERE DATE(date) = ?',
		values = ['2017-02-17'];
	sql = mysql.format(sql, values);

	pool.query(sql, function (error, results, fields) {
    if (error) throw error;
		// If there isn't a result
		if (!results.length) {
      response.send(JSON.stringify({ 'available': true }));
    } else {
		  const return_values = Object.assign({ 'available': false }, results[0]);
		  response.send(JSON.stringify(return_values));
    }
	});
});

app.listen(8090);
