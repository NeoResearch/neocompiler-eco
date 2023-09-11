var onlineStats = "";

function startSocketIoConnections() {
    //Start services
    if (socket)
        if (socket.io.uri != BASE_PATH_ECOSERVICES)
            socket.disconnect();


    socket = io.connect(BASE_PATH_ECOSERVICES, {
        resource: 'nodejs',
    });

    socketServicesEvents();

    //Start compilers
    if (socketCompilers)
        if (socketCompilers.io.uri != BASE_PATH_COMPILERS)
            socketCompilers.disconnect();

    socketCompilers = io.connect(BASE_PATH_COMPILERS, {
        resource: 'nodejs',
    });

    socketCompilerCompilexResult();
}

function socketServicesEvents() {
    socket.on('userconnected', function (data) {
        onlineStats = '<i class="fas fa-plug"></i> ' + data['online'];
        onlineStats += ' -> ' + '<i class="fas fa-phone"></i> ' + data['since'];
    });

    socket.on('timeleft', function (data) {
        numberCompilations = data['compilations'];
        numberDeploys = data['deploys'];
        numberInvokes = data['invokes'];

        /*
        var timeToSeconds = Number((data['timeleft']));
        var hours = Math.floor(timeToSeconds / 60 / 60);
        var minutes = Math.floor(timeToSeconds / 60) % 60;
        var seconds = Math.floor(timeToSeconds) % 60;
        var output = '<i class="fas fa-stopwatch"></i> ' + hours + ':' + minutes + ':' + seconds;
        $("#online")[0].innerHTML = output + ' -> ' + onlineStats;        
        */
        //$("#online")[0].innerHTML = onlineStats;
    });
}