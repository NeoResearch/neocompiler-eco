var express = require('express');
var http = require('http');
var logger = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var app = express();


//app.use(express.static(__dirname + '/'));                 // set the static files location /public/img will be /img for users
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    parameterLimit: 100000, // bigger parameter sizes
    limit: '5mb', // bigger parameter sizes
    extended: false
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

//app.listen(9000);
server.listen(10000 || process.env.PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Compiler RPC server is up')
})


var optionsCompile = {
    timeout: 40000, // 5 seconds is already a lot... but C# is requiring 20!
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

app.get('/getCompilers', (req, res) => {
    var cmddocker = "(docker images docker-mono-neo-compiler | tail -n +2; docker images docker-java-neo-compiler | tail -n +2; docker images docker-neo-boa| tail -n +2; docker images docker-neo-go| tail -n +2) | awk '{ print $1,$2 }'";
    //(docker images docker-mono-neo-compiler | tail -n +2) | awk '{ print $2 }'
    //(docker images | tail -n 1)
    //docker images | tail -n +2

    var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout1, stderr) => {
        if (e instanceof Error || ) {
            res.send("Error:" + e);
            console.error(e);
        } else if (stdout1 == null){
            	res.send("Error stdout1 is null...");
            	console.error(e);
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
		        arr.push(obj);
            }
            compilers = arr;
            res.send(JSON.stringify(arr));
            //res.send(stdout1);
        } // if e instanceof Error
    }); // child
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

    if (req.body.codesend_selected_compiler === "python") { // Python
        code64 = Buffer.from(req.body.codesend_python, 'ascii').toString('base64');
    }
    if (req.body.codesend_selected_compiler === "golang") { // Golang
        code64 = Buffer.from(req.body.codesend_golang, 'ascii').toString('base64');
    } 
    if (req.body.codesend_selected_compiler === "java") { // Java
        code64 = Buffer.from(req.body.codesend_java, 'ascii').toString('base64');
    } 
    if (req.body.codesend_selected_compiler === "csharp") { // C#
        code64 = Buffer.from(req.body.codesend_cs, 'ascii').toString('base64');
    }

    var compatible = "";
    if (req.body.cbx_compatible)
        compatible = "--compatible";

    if (imagename != "") {
        //Check if compiler request exists
        //console.log("Current compilers");
        //console.log(compilers);
        var compilerExists = false;
        for (c = 0; c < compilers.length; c++) {
            var compilerName = compilers[c].compiler + ":" + compilers[c].version;
            if (compilerName == imagename)
                compilerExists = true;
        }

        if (!compilerExists) {
            console.log("Someone is doing something crazy. Compiler does not exist.");
            var msg64 = Buffer.from("Unknown Compiler! Please use something from the list!", 'ascii').toString('base64');
            var msgret = "{\"output\":\"" + msg64 + "\",\"avm\":\"\",\"abi\":\"\"}";
            res.send(msgret);
        } else {
            var cmddocker = "docker run -e COMPILECODE=" + code64 + " -e COMPATIBLE=" + compatible + " -t --rm " + imagename;
            var start = new Date();
            var child = require('child_process').exec(cmddocker, optionsCompile, (e, stdout, stderr) => {
                var end = new Date() - start;
                if (e instanceof Error) {
                    console.error(e);
                    var message = "Internal Error:\n" + e;
                    if (end > optionsCompile.timeout)
                        message = "Timeout on " + end + "ms (limit: " + optionsCompile.timeout + "ms)\nCan you try again, or switch to an alternative compiling server? Please see the options at 'Configurations' tab.";
                    var msg64 = Buffer.from(message, 'ascii').toString('base64');
                    var msgret = "{\"output\":\"" + msg64 + "\",\"avm\":\"\",\"abi\":\"\"}";
                    res.send(msgret);
                    //throw e;
                } else {
                    //console.log('stdout ', stdout);
                    //console.log('stderr ', stderr);
                    res.send(stdout);
                }
            }); // child
        } //Compiler exists if
    } // if imagename!= ""
    else {
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
