var express  = require('express');
var logger = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var path = require('path');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({                                 // parse application/x-www-form-urlencoded
   parameterLimit: 100000,                // bigger parameter sizes
   limit: '5mb',                          // bigger parameter sizes
   extended: false
 }));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//app.listen(8000);
app.set('port', 8000 || process.env.PORT);

app.post('/compilex', function(req, res) {
  // Specifies which URL to listen for
  // req.body -- contains form data
  //console.log("req.body.codesend='"+req.body.codesend+"'");

 // Python
 if(req.body.codesend_python)
 {
   var code64 = new Buffer(req.body.codesend_python, 'ascii').toString('base64');
   var cmddocker = "docker run -e COMPILECODE="+code64+" -t --rm docker-neo-boa";
   var outp = "";
   outp = require('child_process').execSync(cmddocker).toString();
   console.log("calling compile function");
   //console.log("returning json..."+outp);
   //console.log("output is: '"+outp+"'");
   //res.send(JSON.stringify(outp));
   res.send(outp);
 } // Python
 else { // C#

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
  console.log("calling compile function");
  //console.log("returning json..."+outp);
  //console.log("output is: '"+outp+"'");
  //res.send(JSON.stringify(outp));
  res.send(outp);
 }
} // C#

});


app.post('/deployx', function(req, res) {
  var codeavm = new Buffer(req.body.codeavm, 'ascii').toString('base64');
  var contracthash = new Buffer(req.body.contracthash, 'ascii').toString('base64');
  var contractparams = new Buffer(req.body.contractparams, 'ascii').toString('base64');
  var contractreturn = new Buffer(req.body.contractreturn, 'ascii').toString('base64');
  var wallet_deploy = "";
  if((req.body.wallet_deploy == "w1.wallet")||(req.body.wallet_deploy == "w2.wallet")||(req.body.wallet_deploy == "w3.wallet")||(req.body.wallet_deploy == "w4.wallet"))
     wallet_deploy = new Buffer(req.body.wallet_deploy, 'ascii').toString('base64');

  var cbx_storage = "False";
  if(req.body["cbx_storage"])
     cbx_storage = "True";
  cbx_storage=new Buffer(cbx_storage, 'ascii').toString('base64');

  var cbx_dynamicinvoke = "False";
  if(req.body["cbx_dynamicinvoke"])
     cbx_dynamicinvoke = "True";
  cbx_dynamicinvoke=new Buffer(cbx_dynamicinvoke, 'ascii').toString('base64');

  var cmddocker = 'docker exec -t neo-compiler-privnet-with-gas dash -i -c "./execimportcontract.sh '+
       contracthash+' '+codeavm+' '+ contractparams + ' ' +contractreturn + ' ' +cbx_storage + ' ' +cbx_dynamicinvoke + ' ' + wallet_deploy + '" | base64';
  var outp = "";
  //Tail option -- | tail -n +175 | base64';

  //console.log(cmddocker);
  console.log("calling import contract");
  outp = require('child_process').execSync(cmddocker).toString();
  outp = outp.replace(/(\r\n|\n|\r)/gm,"");
  outp = '{"output":"'+outp+'"}';
  res.send(JSON.parse(outp));
});

app.post('/searchx', function(req, res) {
  var contracthash_search = new Buffer(req.body.contracthash_search, 'ascii').toString('base64');
  var cmddocker = 'docker exec -t neo-compiler-privnet-with-gas dash -i -c "./execsearchcontract.sh '+
       contracthash_search + '" | base64';
  var outp = "";

  console.log("calling search");

  outp = require('child_process').execSync(cmddocker).toString();
  outp = outp.replace(/(\r\n|\n|\r)/gm,"");
  outp = '{"output":"'+outp+'"}';
  res.send(JSON.parse(outp));
});

app.post('/invokex', function(req, res) {
  console.log("hash:"+req.body.invokehash+" params:"+req.body.invokeparams);
  console.log("wallet:"+req.body.wallet_invoke);
  var invokehash = new Buffer(req.body.invokehash, 'ascii').toString('base64');
  var invokeparams = new Buffer(req.body.invokeparams, 'ascii').toString('base64');
  var attachneo = new Buffer(req.body.attachneo, 'ascii').toString('base64');
  var wallet_invoke = "";
  if((req.body.wallet_invoke == "w1.wallet")||(req.body.wallet_invoke == "w2.wallet")||(req.body.wallet_invoke == "w3.wallet")||(req.body.wallet_invoke == "w4.wallet"))
     wallet_invoke = new Buffer(req.body.wallet_invoke, 'ascii').toString('base64');

  var cmddocker = 'docker exec -t neo-compiler-privnet-with-gas dash -i -c "./exectestinvokecontract.sh '+
       invokehash+' '+ invokeparams + ' ' + attachneo + ' ' + wallet_invoke + '" | base64';
  var outp = "";

  console.log("calling testinvoke");
  //console.log(cmddocker);
  outp = require('child_process').execSync(cmddocker).toString();
  outp = outp.replace(/(\r\n|\n|\r)/gm,"");
  outp = '{"output":"'+outp+'"}';
  res.send(JSON.parse(outp));
});


//docker exec -t neo-compiler-privnet-with-gas dash -i -c "./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK RmFsc2UK" > saida.log

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
