var express = require('express');
var http = require('http');
var logger = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var app = express();
var cors = require('cors');

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

app.use(cors())

/*
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
*/

var server = http.createServer(app);
var door = 9000;
server.listen(door || process.env.PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Eco services RPC server is up')
})

app.get('/', (req, res) => {
    console.log("Welcome to our NeoCompiler Eco Services RPC API - NeoResearch");
    var obj = {};
    obj["result"] = true;
    obj["welcome"] = "Welcome to our NeoCompiler Eco Compilers RPC API - NeoResearch.";
    var arrMethods = [];
    arrMethods.push({
        method: "/statusnode/:node",
        info: "CN Routes"
    });
    arrMethods.push({
        method: "/incstorage/:height",
        info: "get incremental storage differences for desired height parameter"
    });
    arrMethods.push({
        method: "socket.io",
        info: "{ timeleft: timeleft, compilations: ecoInfo.compilationsSince, deploys: ecoInfo.deploysSince, invokes: ecoInfo.invokesSince }"
    });
    arrMethods.push({
        method: "/resetdockerservice/:pwd",
        info: "Reset docker service (current not working)"
    });
    arrMethods.push({
        method: "/setconsensusnodesblocktime/:node/:spb/:pwd",
        info: "Reset a node (node) with desired block time (spb). Only works with the correct pwd."
    });
    obj["methods"] = arrMethods;
    res.send(obj);

});

var optionsDefault = {
    timeout: 10000, // 5 seconds is already a lot... but C# is requiring 10!
    killSignal: 'SIGKILL'
}

function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}

// ============================================================
// ================== GET NODE LOGS ===========================
app.get('/statusnode/:node', function (req, res) {
    // Node 0 is the RPC
    if (!isInt(req.params.node) || req.params.node < 0 || req.params.node > 4) {
        console.log("Someone is doing something crazy. This node does not exist.");
        res.send("This is not a valid node parameter");
    }


    // $(ls -1rt | tail -n1) prints the last file of ls, instead of *.log
    res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
    if (req.params.node == 0)
        req.params.node = "rpc";
    var cmddocker = 'cd /opt/nodes-logs/logs-neocli-node' + req.params.node + '/ && cat ./$(ls -1rt | tail -n1) | tail -n 500';
    console.log("cmddocker is " + cmddocker);
    var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            res.send("Error:" + e);
            console.error(e);
        } else {
            x = stdout1.replace(/[^\x00-\x7F]/g, "");
            res.send(x);
        }
    });
});

app.get('/statusnodewithparams/:node/:day/:month/:year/:height/:lines', function (req, res) {
    // Node 0 is the RPC
    if (!isInt(req.params.node) || req.params.node < 0 || req.params.node > 4) {
        console.log("Someone is doing something crazy with node. This node does not exist.");
        res.send("This is not a valid node parameter");
    }
    if (!isInt(req.params.height) || req.params.height < 0 || req.params.height > Number.MAX_VALUE) {
        console.log("Someone is doing something crazy with height. This node does not exist.");
        res.send("This is not a valid height parameter");
    }
    if (!isInt(req.params.lines) || req.params.lines < 0 || req.params.lines > 1000) {
        console.log("Someone is doing something crazy with lines. This node does not exist.");
        res.send("This is not a valid lines parameter");
    }
    if (!isInt(req.params.day) || req.params.day < 0 || req.params.day > 31) {
        console.log("Someone is doing something crazy with day. This node does not exist.");
        res.send("This is not a valid day parameter");
    }
    if (!isInt(req.params.month) || req.params.month < 0 || req.params.month > 12) {
        console.log("Someone is doing something crazy with month. This node does not exist.");
        res.send("This is not a valid month parameter");
    }
    if (!isInt(req.params.year) || req.params.year < 2022 || req.params.year > 2024) {
        console.log("Someone is doing something crazy with year. This node does not exist.");
        res.send("This is not a valid year parameter");
    }

    if (req.params.day < 10)
        req.params.day = "0" + req.params.day;
    if (req.params.node == 0)
        req.params.node = "rpc";

    res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
    var file = "./" + req.params.year + "-" + req.params.month + "-" + req.params.day + ".log";
    var grepCmd = "grep -wns height=" + req.params.height + " " + file + " -A " + req.params.lines;
    var cmddocker = 'cd /opt/nodes-logs/logs-neocli-node' + req.params.node + '/ && ' + grepCmd;
    console.log("cmddocker is " + cmddocker);
    var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            res.send("Error:" + e);
            console.error(e);
        } else {
            x = stdout1.replace(/[^\x00-\x7F]/g, "");
            res.send(x);
        }
    });
});

app.get('/statusnodefiltered/:cmd', function (req, res) {
    var cmdToAsk = req.params.cmd;
    if (cmdToAsk === "OnStart" || cmdToAsk === "OnStop" || cmdToAsk === "null" || cmdToAsk === "Error") {
        console.log("cmd is : " + cmdToAsk)
        res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
        var grepCmd = "grep -wns " + cmdToAsk + " ./logs-neocli-node*/* -A " + 10 + " -B " + 10;
        var cmddocker = 'cd /opt/nodes-logs && ' + grepCmd;
        console.log("cmddocker is " + cmddocker);
        var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
            if (e instanceof Error) {
                res.send("Error:" + e);
                console.error(e);
            } else {
                x = stdout1.replace(/[^\x00-\x7F]/g, "");
                res.send(x);
            }
        });
    } else {
        console.log("Someone is doing something crazy with height. This node does not exist.");
        res.send("This is not a valid filtering parameter");
    }
});

app.get('/statusservice/:serviceType/:role', function (req, res) {
    // Node 0 is the RPC
    if (!isInt(req.params.serviceType) || req.params.serviceType < 0 || req.params.serviceType > 2) {
        console.log("Someone is doing something crazy. This service node does not exist.");
        res.send("This is not a valid node parameter");
    }

    if (!isInt(req.params.role)) {
        console.log("Someone is doing something crazy. This service node does not exist.");
        res.send("This is not a valid node parameter");
    }

    var serviceName = "";
    if (req.params.role == 4 && req.params.serviceType == 0)
        serviceName = "verificationservice";

    if (req.params.role == 4 && req.params.serviceType == 1)
        serviceName = "verificationcontext";

    if (req.params.role == 8 && req.params.serviceType == 0)
        serviceName = "oracleservice";

    if (req.params.role == 8 && req.params.serviceType == 1)
        serviceName = "oraclehttps";

    // $(ls -1rt | tail -n1) prints the last file of ls, instead of *.log
    res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
    var cmddocker = 'cd /opt/nodes-logs/logs-neocli-noderpc-' + serviceName + '/ && cat ./$(ls -1rt | tail -n1) | tail -n 500';
    console.log("cmddocker is " + cmddocker);
    var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            res.send("Error:" + e);
            console.error(e);
        } else {
            x = stdout1.replace(/[^\x00-\x7F]/g, "");
            res.send(x);
        }
    });
});


// ============================================================

// ============================================================
// ================== GET INCREMENTAL STORAGE =================
app.get('/incstorage/:height', function (req, res) {
    if (!isInt(req.params.height) || req.params.height < 0) {
        console.log("Someone is doing something crazy. Height lower than 0 or not int.");
        res.send("This is not a valid height parameter");
    }
    var getIncStorage = "'/opt/getIncStorage.sh " + req.params.height + "'";
    var cmddocker = 'docker exec -t eco-neo-csharp-noderpc1-running dash -i -c ' + getIncStorage;
    console.log(cmddocker);
    var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            res.send("Error:" + e);
            console.error(e);
        } else {
            //x = stdout1.replace(/[^\x00-\x7F]/g, "");
            res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
            res.send(stdout1);
        }
    });
});
// ============================================================

// ============================================================
// ================== Set Node Block Time =====================
app.get('/setconsensusnodesblocktime/:node/:spb/:pwd', function (req, res) {
    //console.log("Local enviroment password is " + process.env.PWD_CN_BLOCKTIME);

    console.log("setconsensusnodesblocktime..." + req.params.pwd + "/" + process.env.PWD_CN_BLOCKTIME);

    if (!(req.params.pwd === process.env.PWD_CN_BLOCKTIME)) {
        console.log("Someone is trying an unauthorized access. ");
        var obj = {};
        obj["error"] = false;
        obj["info"] = "You have no acess to this call with password: " + req.params.pwd + ". Try a local privatenet.";
        res.send(obj);
        return;
    }

    var maxMilliSecondsPerBlock = 15000;

    if (!isInt(req.params.node) || req.params.node <= 0 || req.params.node > 4) {
        console.log("Someone is doing something crazy. Compiler does not exist.");
        res.send("This is not a valid node parameter");
    }

    if (!isInt(req.params.spb) || req.params.spb <= 0 || req.params.spb > maxMilliSecondsPerBlock) {
        console.log("Someone is doing something crazy. This seconds per block sounds bad with param:" + req.params.spb + ". Maximum is: " + maxSecondsPerBlock);
        res.send("This is not a valid block time parameter");
    }

    var getIncStorage = "'/opt/updateConsensusCharacteristics.sh " + req.params.spb + "'";
    var cmddocker = 'docker exec -t eco-neo-csharp-node' + req.params.node + '-running dash -i -c ' + getIncStorage;
    console.log(cmddocker);
    var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            console.error(e);
            res.send("Error:" + e);
        } else {
            var obj = {};
            obj["result"] = true;
            obj["info"] = "Command was passed to CN! Hopefully CN " + req.params.node + " will be set with block time equal to " + req.params.spb;
            obj["node"] = req.params.node;
            obj["spb"] = req.params.spb;
            res.send(obj);
        }
    });
});
// ============================================================

// ============================================================
// ================== Socket io ===============================
const EcoData = require('./socket-js/eco-metadata-class.js');
let ecoInfo = new EcoData();

var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});


var timeleft = (7 * 24 * 60 * 60);

setInterval(function () {
    timeleft -= 1;
    io.emit('timeleft', {
        timeleft: timeleft,
        compilations: ecoInfo.compilationsSince,
        deploys: ecoInfo.deploysSince,
        invokes: ecoInfo.invokesSince
    });
}, 1000);

io.on('connection', function (socket) {
    ecoInfo.addConnection();
    io.emit('userconnected', {
        online: ecoInfo.connections,
        since: ecoInfo.connectionsSince
    });
    socket.on('disconnect', function () {
        ecoInfo.removeConnection();
        io.emit('userconnected', {
            online: ecoInfo.connections,
            since: ecoInfo.connectionsSince
        });
    });
});
// ============================================================

var optionsGetLogger = {
    timeout: 10000, // 5 seconds is already a lot... but C# is requiring 10!
    killSignal: 'SIGKILL'
}

app.post('/compileCounter', function (req, res) {
    ecoInfo.addCompilation();
    //console.log("Current number of compilation requests is " + ecoInfo.compilationsSince);
    res.send("true");
});

app.post('/deployCounter', function (req, res) {
    ecoInfo.addDeploy();
    //console.log("Current number of deploy requests is " + ecoInfo.deploysSince);
    res.send("true");
});

app.post('/invokeCounter', function (req, res) {
    ecoInfo.addInvoke();
    //console.log("Current number of invoke requests is " + ecoInfo.invokesSince);
    res.send("true");
});

app.get('/resetdockerservice/:pwd', function (req, res) {

    if (!(req.params.pwd === process.env.PWD_RESET_SERVICE)) {
        console.log("Someone is trying an unauthorized access. ");
        var obj = {};
        obj["error"] = false;
        obj["info"] = "You have no acess to this call with password: " + req.params.pwd + ". Be careful. You are going to reset all docker services!";
        res.send(obj);
        return;
    }

    var cmddocker = '(cd ~; nohup ./reestartDockerAndInitializeAll.sh > saida_nohup.out 2> saida_nohup.err < /dev/null 2>&1 &)';
    console.log(cmddocker);
    var child = require('child_process').exec(cmddocker, optionsGetLogger, (e, stdout1, stderr) => {
        if (e instanceof Error) {
            console.error(e);
            res.send("Error:" + e);
        } else {
            var obj = {};
            obj["result"] = true;
            obj["info"] = "Command was passed to our server! Hopefully it will soon reestart all docker services";
            res.send(obj);
        }
    });
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
