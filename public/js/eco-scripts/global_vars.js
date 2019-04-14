/* ======================================  */
/* Some Global Variables  */
/* Basic counters */
var numberCompilations = 0;
var numberDeploys = 0;
var numberInvokes = 0;

/* Mostly used to get the current commit of GitHub repo */
var refreshIntervalWalletId = 0;
var refreshIntervalEcoMetadataStatsId = 0;
var refreshIntervalNeoCliNodes = 0;
var refreshIntervalCompilers = 0;
var refreshGenesisBlock = 0;
var refreshHeadersNeoCliNeoScan = 0;

/* Set Default API Provider var for NEONJS */
var NEON_API_PROVIDER;

/* Enable NEOSCAN explorer on the frontend */
var ENABLE_NEOSCAN_TRACKING = false;

/* Full activity history of all transactions */
var FULL_ACTIVITY_HISTORY = false;

/* Automatic pic csharp node at best height */
var AUTOMATIC_PIC_CSHARP_NODE_BEST_HEGITH = true;
var LAST_BEST_HEIGHT_NEOCLI = 0;

/* LAST ACTIVE TAB BEFORE ACTIVITY */
var LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";

/* ARRAY VECTOR WITH ALL RELAYED TXs */
var vecRelayedTXs = [];

/* EDITORS AND EXAMPLES */
    var editorPython;
    var editorGolang;
    var editorCSharp;
    var editorJava;
    //===============================================================
    var cSharpFiles = [
        //["https://raw.githubusercontent.com/NeoResearch/examples-csharp/master/HelloWorld/HelloWorld.cs"],
        ["/examples/csharp/HelloWorld/HelloWorld.cs"],
        ["/examples/csharp/ICO_Template/ICO_Template.cs"],
        ["/examples/csharp/MyCheckWitness/MyCheckWitness.cs"],
        ["/examples/csharp/Lock/Lock.cs"],
        [
            "/examples/csharp/StructExample/Point.cs",
            "/examples/csharp/StructExample/StructExample.cs"
        ],
        ["/examples/csharp/MapExample/MapExample.cs"],
        ["/examples/csharp/HelloWorldNotification/HelloWorldNotification.cs"],
    ];


/* Mostly used to get the current commit of GitHub repo */
//var ENV_VARS = "";
/* End Some Global Variables  */
/* ======================================  */

var NUMBER_FAILS_REQUESTS = 0;
var MAX_N_FAILLED_REQUEST_UNTIL_STOP = 20;
var NEO_CLI_REFRESHING_STOPED = false;
function stopAllEcoLabFrontEndTimeoutIntervals(){
    //Check current if refresh interval was set and, then, cancel it
    if(refreshIntervalWalletId!=0)
      clearInterval(refreshIntervalWalletId);

    if(refreshIntervalEcoMetadataStatsId!=0)
      clearInterval(refreshIntervalEcoMetadataStatsId);

    if(refreshIntervalNeoCliNodes!=0)
      clearInterval(refreshIntervalNeoCliNodes);

    if(refreshIntervalCompilers!=0)
      clearInterval(refreshIntervalCompilers);

    if(refreshGenesisBlock!=0)
      clearInterval(refreshGenesisBlock);
}

// ==============================================================================================
// ======================= INITIALIZING BASE PATHS ==============================================
//COMPILERS EXPRESS RPC PATH
var BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers", ecoNodes);

//CSHARP RPC BASE PATH (On the main and testnet some python RPC are running - Check TODO)
var BASE_PATH_CLI = getFirstAvailableService("RPC", ecoNodes);

// ECO SERVICES EXPRESS SERVER RPC PATH
var BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices", ecoNodes);

// NEOSCAN PATH PATH 
var BASE_PATH_NEOSCAN = getFirstAvailableService("neoscan", ecoNodes);

// PYTHON REST NOTIFICATIONS
//var BASE_PATH_PY_REST = getFirstAvailableService("RESTNotifications", ecoNodes);

var LOCAL_DEVELOPMENT = false;
if (this.window.location.href.indexOf("localhost") != -1)
    LOCAL_DEVELOPMENT = true;

if (LOCAL_DEVELOPMENT) {
    BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers", localHostNodes);
    BASE_PATH_CLI = getFirstAvailableService("RPC", localHostNodes);
    BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices", localHostNodes);
    BASE_PATH_NEOSCAN = getFirstAvailableService("neoscan", localHostNodes);
    //BASE_PATH_PY_REST = getFirstAvailableService("RESTNotifications", localHostNodes);
}
// ==============================================================================================

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
