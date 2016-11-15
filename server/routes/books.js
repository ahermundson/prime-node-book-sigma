var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/harry';

router.get('/', function(req, res) {
  console.log("get request");
  // get books from database
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function(err, result){
      done(); ///close the connection.

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log(result);
      res.send(result.rows);
    });

  });
});

router.post('/', function(req, res) {
  var newBook = req.body;
  console.log("post request");
  pg.connect(connectionString, function(err, client,done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('INSERT INTO books (title, author, published, genre, edition, publisher) ' +
    'VALUES ($1, $2, $3, $4, $5, $6)',
    [newBook.title, newBook.author, newBook.published, newBook.genre, newBook.edition, newBook.publisher],
    function(err, result) {
      done();
      if (err) {
        console.log('insert query error: ', err);
        res.sendStatus(500);
      } else {
      console.log('everything should have worked');
      res.sendStatus(201);
      }
    });

  });
});


module.exports = router;
