var cSharpFiles = [
    ["/assets/sc_examples/csharp/HelloWorld/HelloWorld.cs"]
];

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



function getServiceURLByTypeAndNetwork(serviceType, networkService) {
    var serviceUrlToAdd = '';

    if ((serviceType == "RPC") && ((networkService.type == serviceType) || (networkService.type + "-Python" == serviceType + "-Python"))) {
        if (networkService.protocol)
            serviceUrlToAdd = networkService.protocol + "://" + networkService.url;
        if (networkService.port)
            serviceUrlToAdd += ":" + networkService.port;

        return serviceUrlToAdd;
    }

    if (networkService.type == serviceType) {
        serviceUrlToAdd = networkService.url;
    }

    return serviceUrlToAdd;
}


function getFirstAvailableService(serviceType, networkServicesObj) {
    for (var kn = 0; kn < networkServicesObj.length; kn++) {
        var serviceUrlToAdd = getServiceURLByTypeAndNetwork(serviceType, networkServicesObj[kn]);

        if (serviceUrlToAdd !== '')
            return serviceUrlToAdd;
    }
}