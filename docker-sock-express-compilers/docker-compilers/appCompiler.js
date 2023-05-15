var express = require('express');
var http = require('http');
var logger = require('morgan'); // log requests to the console (express4)
var cors = require('cors');
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

app.use(cors())

/*
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.setHeader('Content-Type', 'application/json')
    next();
});*/

var server = http.createServer(app);
server.setTimeout(500000); //500s
server.headersTimeout = 500000;
server.keepAliveTimeout = 500000;

var compilers = [];
var getCompilersBashCall = "(docker images docker-mono-neo-compiler | tail -n +2; docker images docker-neo3-boa-compiler | tail -n +2) | awk '{ print $1,$2 }'";

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
    timeout: 360000, // 40 seconds is already a lot... but C# is requiring 20!
    maxBuffer: 1024 * 50000,
    killSignal: 'SIGKILL'
}

app.get('/', (req, res) => {
    console.log("Calling /");

    if (req.query["random-no-cache"]) {
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

function updateCompilers() {
    //(docker images docker-mono-neo-compiler | tail -n +2) | awk '{ print $2 }'
    //(docker images docker-mono-neo-compiler | tail -n +2; docker images docker-neo3-boa-compiler | tail -n +2) | awk '{ print $1,$2 }'
    //(docker images | tail -n 1)
    //docker images | tail -n +2

    var child = require('child_process').exec(getCompilersBashCall, optionsGetCompilers, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            return;
        } else if ((stdout1 == null) || (stdout1 == '')) {
            console.log("ERROR: could not inspect docker images... please check docker.sock")
            // if docker sock is not available... no image will be found.
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
                console.log("Inside updateCompilers - Printing " + obj["version"].substring(1, 4))

                // ADD only docker-mono-neo-compiler v3 compilers
                if (obj["compiler"] === "docker-mono-neo-compiler")
                    if (obj["version"].substring(0, 2) == "v3")
                        arr.push(obj);

                // Adding all docker-neo3-boa-compiler to list
                if (obj["compiler"] === "docker-neo3-boa-compiler")
                        arr.push(obj);
            }
            compilers = arr;
            return;
            //res.send(stdout1);
        } // if e instanceof Error
    }); // child    
}


app.get('/getCompilers', (req, res) => {
    if (compilers.length == 0) {
        console.log("Calling updateCompilers...");
        updateCompilers();
    }
    res.send(JSON.stringify(compilers));
});

function checkIfCompilerExists(nameToCheck) {
    //Check if compiler request exists
    console.log("Current compilers");
    console.log(compilers);

    for (c = 0; c < compilers.length; c++) {
        var compilerName = compilers[c].compiler + ":" + compilers[c].version;
        if (compilerName == nameToCheck)
            return true;
    }
    return false;
}

var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

app.post('/compilex', function (req, res) {
    var imagename = req.body.compilers_versions;
    var compilerLanguage = req.body.codesend_selected_compiler;
    // 'req.body.codesend' is now a vector
    var code_zip_list = req.body.codesend;
    //var code64 = Buffer.from(req.body.codesend, 'base64').toString('base64');
    var code64_list = [];
    for (var i in code_zip_list) {
        code64_list[i] = Buffer.from(code_zip_list[i], 'base64').toString('base64');
    }
    //var code64 = Buffer.from(code_zip_list, 'base64').toString('base64');
    console.log("imagename: '" + imagename + "'");
    console.log("language: '" + compilerLanguage + "'");
    //console.log("code64: " + code64);
    var compileenv = "-e COMPILECODE_COUNT=" + code64_list.length + " ";
    compileenv += " -e COMPILECODE=" + code64_list[0];
    for (i in code_zip_list) {
        console.log("code64[" + i + "]=" + code64_list[i]);
        compileenv += " -e COMPILECODE_" + i + "=" + code64_list[i];
    }
    //console.log(req)
    console.log("compileenv: '" + compileenv + "'");

    if (imagename != "" && checkIfCompilerExists(imagename)) {
        //var cmddocker = "docker run -e COMPILECODE=" + code64 + " -t --rm " + imagename;
        var cmddocker = "docker run " + compileenv + " -t --rm " + imagename;
        console.log("Compiler Exists! Calling it to compile...");
        console.log(cmddocker);
        var start = new Date();
        console.log("Calling child_process " + start + "...\n");
        //console.log(io.clients)
        //console.log(io)
        /*

                const { spawn } = require('child_process');
                const events = require('events');
                const myEmitter = new events.EventEmitter();

                const dockerRun = spawn(cmddocker, {
                    shell: true
                });

                dockerRun.stdout.on('data', (data) => {
                    var dataToSend = data.toString();
                    console.log(dataToSend);

                    if (res.headersSent) {
                        console.error("Already sent inside dockerRun.stdout.on");
                    }
                    res.write(dataToSend); // write data to response stream
                });

                dockerRun.on('close', (code) => {
                    if (code !== 0) {
                        console.log(`grep process exited with code ${code}`);
                    }
                    if (res.headersSent) {
                        console.error("Already sent before close res.end too");
                    }

                });

                dockerRun.on('exit', (code) => {
                    if (code !== 0) {
                        console.log(`EXIT ${code}`);
                    }
                    if (res.headersSent) {
                        console.error("Already sent before close EXIT too");
                    }
                    myEmitter.emit('firstSpawn-finished');
                });
                myEmitter.on('firstSpawn-finished', () => {
                    res.send(); // finish the request, `end` not `send`
                    console.log("Write but no ended.")
                });*/

        var child = require('child_process').exec(cmddocker, optionsCompilex, (e, stdout, stderr) => {
            console.log("Inside Child process");
            var end = new Date() - start;
            console.log("EndTime " + end);
            if (e) {
                // Usually enter here in timeouts from options Compilex Exec config
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
                //Res.send can be anything but error still comes
                console.log("\nSucess");
                console.log(e);
                console.log(stderr);
                console.log(stdout);
                //res.send(stdout);
                console.log("\nReturned from Compilex\n");


                io.to(req.body.socketID).emit('compilexResult', {
                    stdout: stdout
                });
            }
        }); // child exec // TODO it is finishsing earlier and do not return correctly
    } else { // if imagename!= ""
        console.log("Someone is doing something crazy. Compiler does not exist imagename and version.");
        var msg64 = Buffer.from("Unknown Compiler!", 'ascii').toString('base64');
        var msgret = "{\"output\":\"" + msg64 + "\",\"avm\":\"\",\"abi\":\"\",\"manifest\":\"\"}";
        res.send(msgret);
        return;
    }; // else of imagename

    var msg64WS = Buffer.from("PLEASE WAIT UNTIL WEBSOCKET RESULT", 'ascii').toString('base64');
    var msgES = "{\"output\":\"" + msg64WS + "\",\"avm\":\"\",\"abi\":\"\",\"manifest\":\"\"}";
    res.send(msgES);
}); // End of compilex



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("catch 404 and forward to error handler");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    // render the error page
    console.log("render the error page");
    var obj = {};
    obj["result"] = false;
    obj["reason"] = "Something went wrong in this route invocation! Try again with our set of knonw functions provided by invoking our root route!! Good luck.";
    res.send(obj);
});

module.exports = app;
