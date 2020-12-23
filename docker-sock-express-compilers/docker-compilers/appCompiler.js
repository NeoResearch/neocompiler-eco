var express = require('express');
var http = require('http');
var logger = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var app = express();

app.use(logger('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    parameterLimit: 100000, // bigger parameter sizes
    limit: '5mb', // bigger parameter sizes
    extended: true
}));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

var server = http.createServer(app);
var compilers = [];
var getCompilersBashCall = "(docker images docker-mono-neo-compiler | tail -n +2; docker images docker-neo-boa| tail -n +2) | awk '{ print $1,$2 }'";
    
server.listen(10000 || process.env.PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    updateCompilers();
    console.log('Compiler RPC server is up')
})


var optionsGetCompilers = {
    timeout: 5000, // 5 seconds is already a lot... but C# is requiring 20!
    killSignal: 'SIGKILL'
}

var optionsCompilex = {
    timeout: 40000, // 40 seconds is already a lot... but C# is requiring 20!
    maxBuffer: 1024 * 500,
    killSignal: 'SIGKILL'
}

app.get('/', (req, res) => {
    if(req.query["random-no-cache"])
    {
        res.send("Thanks for pinging with random-no-cache. Hope I am fast enought.");
	return;
    }

    console.log("Welcome to our NeoCompiler Eco Compilers RPC API - NeoResearch");
    var obj = {};
    obj["result"] = true;
    obj["welcome"] = "Welcome to our NeoCompiler Eco Compilers RPC API - NeoResearch.";
    var arrMethods = [];
    arrMethods.push({
        method: "/compilex"
    });
    arrMethods.push({
        method: "/getCompilers"
    });
    obj["methods"] = arrMethods;

    res.send(obj);
});

function updateCompilers()
{    
    //(docker images docker-mono-neo-compiler | tail -n +2) | awk '{ print $2 }'
    //(docker images | tail -n 1)
    //docker images | tail -n +2
    var child = require('child_process').exec(getCompilersBashCall, optionsGetCompilers, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            return;
        } else if (stdout1 == null){
            	return;
	    } else { 	
		    //x = stdout1.replace(/[^\x00-\x7F]/g, "");
		    //res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
		    var arr = [];
		    var stdout1 = stdout1.match(/[^\s]+/g);
		    // we loop from 1 to 1 less than the length because
		    // the first two elements are empty due to the way the split worked
		    for (var i = 0, l = stdout1.length - 1; i < l; i = i + 2) {
		        var obj = {};
		        obj["compiler"] = stdout1[i];
		        obj["version"] = stdout1[i + 1];
			// Remove later TODO
			console.log("Inside updateCompilers - Printing " + obj["version"].substring(1,4))
			if(obj["version"].substring(0,4) == "v3.0")
			        arr.push(obj);
            }
            compilers = arr;
            return;
            //res.send(stdout1);
        } // if e instanceof Error
    }); // child    
}


app.get('/getCompilers', (req, res) => {
        if(compilers.length == 0)
        {
        	console.log("Calling updateCompilers...");
		updateCompilers();
	}
	res.send(JSON.stringify(compilers));
});

app.post('/compilex', function(req, res) {
    var imagename = req.body.compilers_versions;
    var compilerLanguage=  req.body.codesend_selected_compiler;
    var code64 = Buffer.from(req.body.codesend, 'base64').toString('base64');
    console.log("imagename: " + imagename)
    console.log("language: " + compilerLanguage)
    console.log("code64: " + code64)
    
    if (imagename != "") {
        //Check if compiler request exists
        console.log("Current compilers");
        console.log(compilers);
        var compilerExists = false;
        
        for (c = 0; c < compilers.length; c++) {
            var compilerName = compilers[c].compiler + ":" + compilers[c].version;
            if (compilerName == imagename)
                compilerExists = true;
        }


        if (!compilerExists) {
            console.log("Someone is doing something crazy. Compiler does not exist including name and version.");
            var msg64 = Buffer.from("Unknown Compiler! Please use something from the list!", 'ascii').toString('base64');
            var msgret = "{\"output\":\"" + msg64 + "\",\"avm\":\"\",\"abi\":\"\"}";
            res.send(msgret);
        } else {
            var cmddocker = "docker run -e COMPILECODE=" + code64 + " -t --rm " + imagename;
            console.log("Compiler Exists! Calling it to compile...");
	    console.log(cmddocker);
            var start = new Date();
            var child = require('child_process').exec(cmddocker, optionsCompilex, (e, stdout, stderr) => {
                var end = new Date() - start;
                if (e instanceof Error) {
                    console.error("Error:" + e);
                    console.log('stdout ', stdout);
                    console.log('stderr ', stderr);
                    console.log('inside error');
                    var message = "Internal Error:\n" + e;
                    if (end > optionsCompilex.timeout)
                        message = "Timeout on " + end + "ms (limit: " + optionsCompilex.timeout + "ms)\nCan you try again, or switch to an alternative compiling server? Please see the options at 'Configurations' tab.";
                    var msg64 = Buffer.from(message, 'ascii').toString('base64');
                    var msgret = "{\"output\":\"" + msg64 + "\",\"avm\":\"\",\"abi\":\"\"}";
                    res.send(msgret);
                    //throw e;
                } else {
                    console.error("Sucess");
                    res.send(stdout);
                }
            }); // child
        } //Compiler exists if
    } // if imagename!= ""
    else {
         console.log("Someone is doing something crazy. Compiler does not exist imagename.");
        var msg64 = Buffer.from("Unknown Compiler!", 'ascii').toString('base64');
        var msgret = "{\"output\":\"" + msg64 + "\",\"avm\":\"\",\"abi\":\"\"}";
        res.send(msgret);
    }
}); // End of compilex

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    // render the error page
    var obj = {};
    obj["result"] = false;
    obj["reason"] = "Something went wrong in this route invocation! Try again with our set of knonw functions provided by invoking our root route!! Good luck.";
    res.send(obj);
});

module.exports = app;
