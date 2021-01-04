function startSocketIoConnections() {
    var shouldUpdateSocket = false;
    if (socket) {
        if (socket.io.uri != BASE_PATH_ECOSERVICES)
            socket.disconnect();
        else
            return;
    }

    socket = io.connect(BASE_PATH_ECOSERVICES, {
        resource: 'nodejs',
    });

    if (socketCompilers) {
        if (socketCompilers.io.uri != BASE_PATH_COMPILERS)
            socketCompilers.disconnect();
        else
            return;
    }

    socketCompilers = io.connect(BASE_PATH_COMPILERS, {
        resource: 'nodejs',
    });

    socketCompilers.on('compilexResult', function(socketData) {
        dataSocket = JSON.parse(socketData.stdout);
        console.log(dataSocket);
        $("#compilebtn")[0].disabled = false;
        var coderr = atob(dataSocket.output);
        $("#codewarnerr").val(coderr);
        var hexcodeavm = atob(dataSocket.avm);
        $("#codeavm").val(hexcodeavm);
        hexcodeavm = hexcodeavm.replace(/(\r\n|\n|\r)/gm, "");
        $("#opcodes").val("");
        //printOpcode(hexcodeavm, $("#opcodes"));
        //console.log("GRAVANDO BINARIO: "+typeof(datacontent)+":"+datacontent);
        localStorage.setItem('avmFile', hexcodeavm); //, {type: 'application/octet-stream'});
        //datacontent = localStorage.getItem('avmFile', {type: 'application/octet-stream'});
        //console.log("LENDO BINARIO: "+typeof(datacontent)+":"+datacontent);
        //console.log(localStorage.getItem('avmFile').charCodeAt(0));
        //$("#btn_download")[0].style = "";

        //filling hashes
        var contractScriptHash = getScriptHashFromAVM(hexcodeavm);
        var avmSize = Math.ceil(hexcodeavm.length / 2);
        updateCompiledOrLoadedContractInfo(contractScriptHash, avmSize);

        // Loading Manifest Info
        console.log("loading manifest");
        if (dataSocket.manifest != "") {
            var textmanifest = atob(dataSocket.manifest);
            $("#codemanifest").val(textmanifest);
        }

        // Loading all ABI related boxes
        if (dataSocket.abi != "") {
            var codeabi = atob(dataSocket.abi);
            updateAllABIDependencies(JSON.parse(codeabi));
        }
        $('#collapseMore').collapse('show');

        swal("Compiled with success!", {
            icon: "success",
            buttons: false,
            timer: 1100,
        });
    });

    socket.on('userconnected', function(data) {
        onlineStats = '<i class="fas fa-plug"></i> ' + data['online'];
        onlineStats += ' -> ' + '<i class="fas fa-phone"></i> ' + data['since'];
    });

    socket.on('timeleft', function(data) {
        numberCompilations = data['compilations'];
        numberDeploys = data['deploys'];
        numberInvokes = data['invokes'];

        var timeToSeconds = Number((data['timeleft']));
        var hours = Math.floor(timeToSeconds / 60 / 60);
        var minutes = Math.floor(timeToSeconds / 60) % 60;
        var seconds = Math.floor(timeToSeconds) % 60;
        var output = '<i class="fas fa-stopwatch"></i> ' + hours + ':' + minutes + ':' + seconds;

        $("#online")[0].innerHTML = output + ' -> ' + onlineStats;
    });
}