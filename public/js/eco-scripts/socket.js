function startSocketIoConnections(firstInitialization = false) {
    if (socket) {
        //console.log("Disconnecting...");
        socket.disconnect();
    }

    socket = io.connect(BASE_PATH_ECOSERVICES, {
        resource: 'nodejs'
    });

    socket.on('userconnected', function(data) {
        onlineStats = '<i class="fas fa-plug"></i> ' + data['online'];
        onlineStats += ' -> ' + '<i class="fas fa-phone"></i> ' + data['since'];
    });

    socket.on('timeleft', function(data) {
        var date = new Date(data['timeleft']);
        numberCompilations = data['compilations'];
        numberDeploys = data['deploys'];
        numberInvokes = data['invokes'];
        var dateGMT0 = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
        var tLeft = dateGMT0.toTimeString();
        var output = '<i class="fas fa-stopwatch"></i> ' + tLeft.substring(0, 8);
        $("#online")[0].innerHTML = output + ' -> ' + onlineStats;
    });
}
