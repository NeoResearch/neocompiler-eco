var express  = require('express');
var http = require('http');
var logger = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var app = express();


//app.use(express.static(__dirname + '/'));                 // set the static files location /public/img will be /img for users
app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({                                 // parse application/x-www-form-urlencoded
   parameterLimit: 100000,                // bigger parameter sizes
   limit: '5mb',                          // bigger parameter sizes
   extended: false
 }));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(function (req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Credentials', true);
next();
});

//app.listen(8500);

var server = http.createServer(app);

server.listen(8500 || process.env.PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('Python network services is up')
})

var optionsPythonDeployAndInvoke = {
  timeout: 300000, // 5 min is a lot already!
  killSignal: 'SIGKILL'
}

app.get('/', (req, res) => {
  console.log("Welcome to our NeoCompiler Eco Python microservice for Deploy and Invoke");
  res.status(200).send("Welcome to our NeoCompiler Eco Python microservice for Deploy and Invoke");
});


app.post('/deployx', function(req, res) {
  console.log("Calling app.post route /deployx. Import contract!\n");

  var codeavm = new Buffer(req.body.codeavm, 'ascii').toString('base64');
  var contracthash = new Buffer(req.body.contracthash, 'ascii').toString('base64');
  var contractparams = new Buffer(req.body.contractparams, 'ascii').toString('base64');
  var contractreturn = new Buffer(req.body.contractreturn, 'ascii').toString('base64');

  pythonScreenName = ""; // screen name inside container
  pythonContName = "";   // container name
  if(req.body.wallet_deploy == "w1.wallet") {
    pythonScreenName = new Buffer("pythonW1", 'ascii').toString('base64');
    pythonContName = "w1";
  }
  if(req.body.wallet_deploy == "w2.wallet") {
    pythonScreenName = new Buffer("pythonW2", 'ascii').toString('base64');
    pythonContName = "w2";
  }
  if(req.body.wallet_invoke == "w3.wallet") {
    pythonScreenName = new Buffer("pythonW3", 'ascii').toString('base64');
    pythonContName = "w3";
  }
  if(req.body.wallet_invoke == "w4.wallet") {
    pythonScreenName = new Buffer("pythonW4", 'ascii').toString('base64');
    pythonContName = "w4";
  }

  var cbx_storage = "False";
  if(req.body["cbx_storage"])
    cbx_storage = "True";
  cbx_storage=new Buffer(cbx_storage, 'ascii').toString('base64');

  var cbx_dynamicinvoke = "False";
  if(req.body["cbx_dynamicinvoke"])
    cbx_dynamicinvoke = "True";
  cbx_dynamicinvoke=new Buffer(cbx_dynamicinvoke, 'ascii').toString('base64');

  var cmddocker = 'docker exec -t eco-neo-python-'+pythonContName+'-running dash -i -c "/opt/pythonScreenDeploy.sh '+
       pythonScreenName + ' ' + contracthash + ' ' + codeavm + ' ' + contractparams + ' ' + contractreturn + ' ' + cbx_storage + ' ' + cbx_dynamicinvoke + '"';

  console.log("SC Deploy: import contract");
  console.log(cmddocker);


  //res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  var child = require('child_process').exec(cmddocker, optionsPythonDeployAndInvoke, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      console.log(x);

      x = x.replace(/(\r\n|\n|\r)/gm,"");

      console.log("TimeToFinish");
      res.send(x);
    }
  });

});

app.post('/invokex', function(req, res) {
  console.log("hash:"+req.body.invokehash+" params:"+req.body.invokeparams);
  console.log("wallet:"+req.body.wallet_invoke);

  var invokehash = new Buffer(req.body.invokehash, 'ascii').toString('base64');
  var invokeparams = new Buffer(req.body.invokeparams, 'ascii').toString('base64');
  var attachneo = new Buffer(req.body.attachneo, 'ascii').toString('base64');
  var attachgas = new Buffer(req.body.attachgas, 'ascii').toString('base64');

  var cbx_invokeonly = "0";
  if(req.body["cbx_invokeonly"])
    cbx_invokeonly = "1";
  cbx_invokeonly=new Buffer(cbx_invokeonly, 'ascii').toString('base64');

  console.log("invokeonly is :" + cbx_invokeonly)

  pythonScreenName = ""; // screen name inside container
  pythonContName = "";   // container name
  if(req.body.wallet_invoke == "w1.wallet") {
    pythonScreenName = new Buffer("pythonW1", 'ascii').toString('base64');
    pythonContName = "w1";
  }
  if(req.body.wallet_invoke == "w2.wallet") {
    pythonScreenName = new Buffer("pythonW2", 'ascii').toString('base64');
    pythonContName = "w2";
  }
  if(req.body.wallet_invoke == "w3.wallet") {
    pythonScreenName = new Buffer("pythonW3", 'ascii').toString('base64');
    pythonContName = "w3";
  }
  if(req.body.wallet_invoke == "w4.wallet") {
    pythonScreenName = new Buffer("pythonW4", 'ascii').toString('base64');
    pythonContName = "w4";
  }


  var cmddocker = 'docker exec -t eco-neo-python-'+pythonContName+'-running dash -i -c "/opt/pythonScreenInvoke.sh '+
       pythonScreenName+' '+ invokehash+' '+ invokeparams + ' ' + attachneo + ' ' + attachgas + ' ' + cbx_invokeonly + '"';//'" | base64';
  var outp = "";

  console.log(cmddocker);
  console.log("calling testinvoke");

  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  var child = require('child_process').exec(cmddocker, optionsPythonDeployAndInvoke, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      x = stdout1.replace(/[^\x00-\x7F]/g, "");
      console.log(x);

      x = x.replace(/(\r\n|\n|\r)/gm,"");
  //outp = require('child_process').execSync(cmddocker).toString();
  //outp = outp.replace(/(\r\n|\n|\r)/gm,"");
  //outp = '{"output":"'+outp+'"}';
  //res.send(JSON.parse(outp));

      console.log("TimeToFinish Invoke");
      res.send(x);
    }
  });

});

app.get('/notifications', function(req, res) {
  var cmddocker = 'docker exec -t eco-neo-python-logger-running dash -i -c "/opt/getNotificationLogs.sh"';
  //var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-logger/prompt.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
});

app.get('/restlog', function(req, res) {
  //var cmddocker = 'docker exec -t eco-neo-python-logger-running dash -i -c "/opt/getNotificationLogs.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-rest-rpc/saida.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
});

app.get('/rpclog', function(req, res) {
  //var cmddocker = 'docker exec -t eco-neo-python-logger-running dash -i -c "/opt/getNotificationLogs.sh"';
  var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-rest-rpc/saida_rpc.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.send(stdout1);
    }
  });
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
