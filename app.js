var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var compile = require('./routes/compile');

var app = express();

app.set('port', 8000 || process.env.PORT);
//app.use(express.bodyParser()); // Automatically parses form data

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/compile', compile);

//app.use(express.bodyParser());
// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.post('/compilex', function(req, res) {
  // Specifies which URL to listen for
  // req.body -- contains form data
  //console.log("req.body.codesend='"+req.body.codesend+"'");

 if(!process.env.DOCKERNEOCOMPILER) {
  console.log("Error! No DOCKERNEOCOMPILER variable is set!\n");
  var msg64 = new Buffer("Unable to communicate with backend compiler. Please try again later.",'ascii').toString('base64');
  var msgret = "{\"output\":\""+msg64+"\",\"avm\":\"\",\"abi\":\"\"}";
  //console.log("output is: '"+msgret+"'");
  res.send(msgret);
 }
 else {
  var code64 = new Buffer(req.body.codesend, 'ascii').toString('base64');
  var cmddocker = "docker run -e COMPILECODE="+code64+" -t --rm $DOCKERNEOCOMPILER";
  var outp = "";
  outp = require('child_process').execSync(cmddocker).toString();
  //console.log("returning json..."+outp);
  //console.log("output is: '"+outp+"'");
  //res.send(JSON.stringify(outp));
  res.send(outp);
 }
});

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
  res.render('error');
});

module.exports = app;
