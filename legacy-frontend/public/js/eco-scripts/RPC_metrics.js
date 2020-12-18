function callCoreMetricsFromForm() {
    nBlockToQueryForm = Number($("#cbx_blocks_toQuery").val());
    heightToStartForm = Number($("#cbx_height_toQuery").val());

    if(heightToStartForm == -1)
    {
	    $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }', function(resultBlockCount) {
                // header height is always + 1 - We do not want genesis and then ask for - 3
		var feasibleNumberBlocksToGet = Math.min(resultBlockCount.result - 3, nBlockToQueryForm);	
		callCoreMetricsGetBlockTimestampsAndFillStats(feasibleNumberBlocksToGet,heightToStartForm);
	    }); // block count
    }else
   	callCoreMetricsGetBlockTimestampsAndFillStats(nBlockToQueryForm,heightToStartForm);
}

function callCoreMetricsGetBlockTimestampsAndFillStats(nBlocksToGet,heightToStart=-1) {
    var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getmetricblocktimestamp\", \"params\": [\"" + nBlocksToGet + "\"] }";
    if (heightToStart>0)
    	requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getmetricblocktimestamp\", \"params\": [" + nBlocksToGet + "," + heightToStart + "] }";
    //console.log(requestJson);
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultBlockTimestamps) {
            console.log("Timestamp were obtained");
            console.log(resultBlockTimestamps);
	    if(resultBlockTimestamps.result[0].timestamp)
            {
	        filterBlockTimestamps(resultBlockTimestamps);
	        calculateNumericalStatistics();
	    }
	    else
		createNotificationOrAlert("ERROR on getmetricblocktimestamp", resultBlockTimestamps.result, 5000);
        },
        "json" // The format the response should be in
    ).fail(function() {
        createNotificationOrAlert("getmetricblocktimestamp", "failed to pass request to RPC network!", 3000);
    }); //End of POST for search
}

function calculateNumericalStatistics() {
    var blockTime = [];
    for (var b = 0; b < lastTS.length; b++)
        blockTime.push(lastTS[b].y);
    var totalTime = blockTime.reduce(addToArray, 0);
    var avgTime = totalTime / blockTime.length;
    // theoretical block time
    var tt = Number($("#cbx_theoretical_blocktime")[0].value); 
    var percentage = ( (avgTime /  tt ) - 1 ) * 100;

    // theoretical number of blocks
    var tNBlocks = totalTime / tt;
    var percentageOfAccomplishedBlocks = ( lastTS.length /  tNBlocks) * 100;

    $("#txt_area_timestampsStats").val("Average blocktime: " + avgTime.toFixed(2) + "s\n");
    $("#txt_area_timestampsStats").val($("#txt_area_timestampsStats").val() + "Blocktime avg. delay (%): " + percentage.toFixed(2) + "%\n");
    $("#txt_area_timestampsStats").val($("#txt_area_timestampsStats").val() + "Decrease in number generated blocks (%): " + percentageOfAccomplishedBlocks.toFixed(2) + "%\n");
	
    console.log("avgTime:" + avgTime);
}

function addToArray(accumulator, a) {
    return accumulator + a;
}

function filterBlockTimestamps(resultBlockTimestamps) {
    var heights = [];
    var blockTime = [];
    var blockTimeStamps = [];
    for (var bh = 1; bh < resultBlockTimestamps.result.length; bh++) {
        heights.push(resultBlockTimestamps.result[bh].height);
        blockTime.push(resultBlockTimestamps.result[bh].timestamp - resultBlockTimestamps.result[bh - 1].timestamp);
        blockTimeStamps.push(moment.unix(resultBlockTimestamps.result[bh].timestamp/1000));
    }
    generateTimeDiffGraph(false, heights, blockTime, blockTimeStamps);
}

var chartBlockTimeStamp;
var shouldDestroy_chartBlockTimeStamp = false;
var lastTS = null;

function reloadTSGraph() {
	if(lastTS!=null)
		generateTimeDiffGraph(true);
}

function generateTimeDiffGraph(useTSInCache, heights = null, blockTime = null, blockTimeStamps = null) {
    //console.log(labels);
    //console.log(data);
    //console.log(blockTimeStamps);

    var ts = [];
    if(useTSInCache)
    {
	    ts = lastTS;
    }
    else
    {
	    for (var a = 0; a < blockTime.length; a++) {
		ts.push({
		    t: blockTimeStamps[a],
		    y: blockTime[a]/1000,
		    height: heights[a]
		});
	    }
	    lastTS = ts;
    }
    //console.log(ts);

    var ctx = document.getElementById('canvas_blocktime_chart').getContext("2d");
    // Destroy previous chart
    if(shouldDestroy_chartBlockTimeStamp)
    	chartBlockTimeStamp.destroy();

    var maxYTickValue = Number($("#cbx_max_yTick_ts_value").val());
    var minYTickValue = Number($("#cbx_min_yTick_ts_value").val());   

    var stepSize = 1;
    if (maxYTickValue < 2)
	stepSize = 0.1;

    chartBlockTimeStamp = new Chart(ctx, {
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
                        stepSize: stepSize,
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
    shouldDestroy_chartBlockTimeStamp=true;

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

}
