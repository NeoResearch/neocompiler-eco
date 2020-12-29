var cSharpFiles = [
    ["./assets/sc_examples/csharp/HelloWorld/HelloWorld.cs"]
];

var GAS_ASSET = "0xa6a6c15dcdc9b997dac448b6926522d22efeedfb";
var NEO_ASSET = "0x0a46e2e37c9987f570b4af253fb77e7eef0f72b6";

var USER_EXAMPLES = new Map();

var LOCAL_DEVELOPMENT = false;
if (this.window.location.href.indexOf("localhost") != -1)
    LOCAL_DEVELOPMENT = true;

var default_nodes = ecoNodes;
if (LOCAL_DEVELOPMENT) {
    default_nodes = localHostNodes
}

// ECO SERVICES EXPRESS SERVER RPC PATH
var BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices", default_nodes);
var BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers", default_nodes);
var BASE_PATH_CLI = getFirstAvailableService("RPC", default_nodes);

function getServiceURLByTypeAndNetwork(serviceType, networkService) {
    var serviceUrlToAdd = '';

    //if ((serviceType == "RPC") && (networkService.type == serviceType)) {
    if (networkService.type == serviceType) {
        if (networkService.protocol)
            serviceUrlToAdd = networkService.protocol + "://" + networkService.url;
        if (networkService.port)
            serviceUrlToAdd += ":" + networkService.port;

        return serviceUrlToAdd;
    }

    //if (networkService.type == serviceType) {
    //    serviceUrlToAdd = networkService.url;
    //}

    return serviceUrlToAdd;
}


function getFirstAvailableService(serviceType, networkServicesObj) {
    for (var kn = 0; kn < networkServicesObj.length; kn++) {
        var serviceUrlToAdd = getServiceURLByTypeAndNetwork(serviceType, networkServicesObj[kn]);

        if (serviceUrlToAdd !== '')
            return serviceUrlToAdd;
    }
}


var code_cs = "";

/* SOCKET */
var socket;

var refreshHeadersNeoCli = 0;

var NUMBER_FAILS_REQUESTS = 0;