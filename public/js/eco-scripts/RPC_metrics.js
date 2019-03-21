function callCoreMetricsFromCurrentHeight() {
    maxNBlocks = $("#cbx_blocks_toQuery").val();
    $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }', function(resultBlockCount) {
        var nBlocksToGet = Math.min(resultBlockCount.result - 2, maxNBlocks);
        callCoreMetricsGetBlockTimestampsAndFillStats(nBlocksToGet);
    }); // block count
}

function callCoreMetricsGetBlockTimestampsAndFillStats(nBlocksToGet) {
    requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getmetricblocktimestamp\", \"params\": [\"" + nBlocksToGet + "\"] }";
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultBlockTimestamps) {
            //console.log("Timestamp were obtained");
            //console.log(resultBlockTimestamps);
            filterBlockTimestamps(resultBlockTimestamps);
        },
        "json" // The format the response should be in
    ).fail(function() {
        createNotificationOrAlert("getmetricblocktimestamp", "failed to pass request to RPC network!", 3000);
    }); //End of POST for search
}

function filterBlockTimestamps(resultBlockTimestamps) {
    var heights = [];
    var blockTime = [];
    var blockTimeStamps = [];
    for (var bh = 1; bh < resultBlockTimestamps.result.length; bh++) {
        heights.push(resultBlockTimestamps.result[bh].height);
        blockTime.push(resultBlockTimestamps.result[bh].timestamp - resultBlockTimestamps.result[bh - 1].timestamp);
        blockTimeStamps.push(moment.unix(resultBlockTimestamps.result[bh].timestamp));
    }
    generateTimeDiffGraph(heights, blockTime, blockTimeStamps);
}

function generateTimeDiffGraph(labels, data, blockTimeStamps) {
    //console.log(labels);
    //console.log(data);
    //console.log(blockTimeStamps);

    var ts = [];
    for (var a = 0; a < data.length; a++) {
        ts.push({
            t: blockTimeStamps[a],
            y: data[a],
            height: labels[a]
        });
    }

    console.log(ts);
    var ctx = document.getElementById('myChart').getContext("2d");

    /*
    var stackedLine = new Chart(ctx, {
        type: 'line',
        	    data: {
    		labels: labels,
    		datasets: [{
    		    label: 'Block times',
    		    backgroundColor: 'rgb(255, 99, 132)',
    		    borderColor: 'rgb(255, 99, 132)',
    		    data: ts
    		}]
    	    },
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });*/

    //Chart.defaults.global.elements.point.radius = 0;
    //Chart.defaults.global.elements.point.hoverRadius = 0;

    var maxYTickValue = Number($("#cbx_max_yTick_ts_value").val());
    var minYTickValue = Number($("#cbx_min_yTick_ts_value").val());
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            datasets: [{
                label: 'Block times',
                data: ts
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series'
                }],
                yAxes: [{
                    ticks: {
                        min: minYTickValue,
                        stepSize: 1,
                        max: maxYTickValue
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = 'H:' + data.datasets[0].data[tooltipItem.index].height;

                        if (label) {
                            label += ': ';
                        }
                        label += ' : ' + tooltipItem.yLabel + 's';
                        return label;
                    }
                }
            }
        }
    });

}
