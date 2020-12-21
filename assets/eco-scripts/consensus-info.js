function getNodeInfo() {
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/1', function(data) {
        $("#node1data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node1data").scrollTop($("#node1data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/2', function(data) {
        $("#node2data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node2data").scrollTop($("#node2data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/3', function(data) {
        $("#node3data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node3data").scrollTop($("#node3data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/4', function(data) {
        $("#node4data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node4data").scrollTop($("#node4data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/0', function(data) {
        $("#noderpcdata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#noderpcdata").scrollTop($("#noderpcdata")[0].scrollHeight);
    });
}

function getNodeInfo() {
    var jsonForGetValidators = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getnextblockvalidators",
        "params": []
    };

    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        JSON.stringify(jsonForGetValidators), // Serializes form data in standard format
        function(data) {
            console.log(data);
        },
        "json" // The format the response should be in
    ).fail(function() {
        alert("Error when trying to get nextvalidators");
    }); //End of POST for search
}