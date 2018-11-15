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

//app.listen(9000);

var server = http.createServer(app);

server.listen(10000 || process.env.PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('Compiler RPC server is up')
})


var optionsCompile = {
  timeout: 15000, // 5 seconds is already a lot... but C# is requiring 10!
  killSignal: 'SIGKILL'
}


var compilers = [];

app.get('/getCompilers', (req, res) => {
  var cmddocker = "(docker images docker-mono-neo-compiler | tail -n +2; docker images docker-java-neo-compiler | tail -n +2; docker images docker-neo-boa| tail -n +2; docker images docker-neo-go| tail -n +2) | awk '{ print $1,$2 }'";
//(docker images docker-mono-neo-compiler | tail -n +2) | awk '{ print $2 }'
//(docker images | tail -n 1)
//docker images | tail -n +2

  //var cmddocker = 'cat ./docker-compose-eco-network/logs-neopython-logger/prompt.log';
  var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr)=> {
    if (e instanceof Error) {
      res.send("Error:"+e);
      console.error(e);
    }
    else {
      //x = stdout1.replace(/[^\x00-\x7F]/g, "");
      //res.setHeader('Content-Type', 'text/plain; charset="utf-8"');

  var arr = [];
  var stdout1 = stdout1.match(/[^\s]+/g);
  // we loop from 1 to 1 less than the length because
  // the first two elements are empty due to the way the split worked
  for (var i = 0, l = stdout1.length - 1; i < l; i=i+2) {
    var obj = {};
    obj["compiler"] = stdout1[i];
    obj["version"] = stdout1[i+1];
    arr.push(obj);
  }
	compilers = arr;
	res.send(JSON.stringify(arr));
      //res.send(stdout1);
    }
  });
});



app.get('/', (req, res) => {
  console.log("Welcome to our NeoCompiler Eco Compilers RPC API");
  res.status(200).send("Welcome to our NeoCompiler Eco Compilers RPC API");
});

app.post('/compilex', function(req, res) {
  // Specifies which URL to listen for
  // req.body -- contains form data

  //console.log("python: "+req.body.codesend_python);
  //console.log("cs: "+req.body.codesend_cs);
  //console.log("go: "+req.body.codesend_golang);
  //console.log("java: "+req.body.codesend_java);
  //console.log(req.body.csharp_compilers_versions);

  var imagename = req.body.compilers_versions;
  var code64 = "";

  if(req.body.codesend_python) { // Python
    code64 = new Buffer(req.body.codesend_python, 'ascii').toString('base64');
  }
  else if(req.body.codesend_golang) { // Golang
    code64 = new Buffer(req.body.codesend_golang, 'ascii').toString('base64');
  }
  else if(req.body.codesend_java) { // Java
    code64 = new Buffer(req.body.codesend_java, 'ascii').toString('base64');
  }
  else if(req.body.codesend_cs) { // C#
    code64 = new Buffer(req.body.codesend_cs, 'ascii').toString('base64');
  }

  if(imagename != "")
  {
	  //Check if compiler request exists
	  //console.log("Current compilers");
	  //console.log(compilers);
	  var compilerExists = false;
	  for(c = 0; c < compilers.length; c++)
	  {
		var compilerName = compilers[c].compiler + ":" + compilers[c].version;
	  	if(compilerName == imagename)
			compilerExists = true;
	  }

	  if(!compilerExists)
	  {
		  console.log("Someone is doing something crazy. Compiler does not exist.");
		  var msg64 = new Buffer("Unknown Compiler! Please use something from the list!",'ascii').toString('base64');
		  var msgret = "{\"output\":\""+msg64+"\",\"avm\":\"\",\"abi\":\"\"}";
		  res.send(msgret);
	  }
	  else{
		      var cmddocker = "docker run -e COMPILECODE=" + code64 + " -t --rm " + imagename;
		      var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout, stderr)=> {

		      if (e instanceof Error) {
			console.error(e);
			var msg64 = new Buffer("Internal Error:\n"+e,'ascii').toString('base64');
			var msgret = "{\"output\":\""+msg64+"\",\"avm\":\"\",\"abi\":\"\"}";
			res.send(msgret);
			//throw e;
		      }
		      else {
			//console.log('stdout ', stdout);
			//console.log('stderr ', stderr);
			res.send(stdout);
		      }
		    }); // child
          } //Compiler exists if
    } // if imagename!= ""
    else {
	    var msg64 = new Buffer("Unknown Compiler!",'ascii').toString('base64');
	    var msgret = "{\"output\":\""+msg64+"\",\"avm\":\"\",\"abi\":\"\"}";
	    res.send(msgret);
    }
}); // End of compilex

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
