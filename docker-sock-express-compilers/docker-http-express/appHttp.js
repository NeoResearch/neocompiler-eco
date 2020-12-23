var express  = require('express');
var http = require('http');
var logger = require('morgan');             // log requests to the console (express4)
var app = express();
var cors = require('cors');
app.use(express.static(__dirname + '/'));                 // set the static files location /public/img will be /img for users
app.use(cors())

var server = http.createServer(app);

server.listen(8000 || process.env.PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('Index.html server page is up')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //next(err);
  res.send({ 'error': 'no route found!' });
});

module.exports = app;
