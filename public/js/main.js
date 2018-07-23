/* Some Global Variables  */

var refreshIntervalId = 0;
//Fixed known paths for NeoScan
var FIXED_NEOSCAN_NEOCOMPILER = "https://neoscan.neocompiler.io";
var FIXED_NEOSCAN_LOCALHOST = "http://localhost:4000";
var FIXED_NEOSCAN_MAINNET = "https://neoscan.io";
var FIXED_NEOSCAN_TESTNET = "https://neoscan-testnet.io/";

//Fixed known paths for Python Rest API
var FIXED_NEOPY_NOTIFICATION_LOCALHOST = "http://localhost:8080";
var FIXED_NEOPY_NOTIFICATION_NEOCOMPILER = "https://rest.neocompiler.io";
var FIXED_NEOPY_NOTIFICATION_MAINNET =  "http://notifications2.neeeo.org/";
var FIXED_NEOPY_NOTIFICATION_TESTNET =  "http://notifications2.neeeo.org/"; // fix for testnet

//Fixed known paths for neo-cli RPC
var FIXED_NEOCLI_RPC_BASE_PATH_NEOCOMPILER =  "https://node1.neocompiler.io/";
var FIXED_NEOCLI_RPC_BASE_PATH_LOCALHOST =  "http://localhost:30333"; // node1

var BASE_PATH_NEOSCAN = FIXED_NEOSCAN_NEOCOMPILER;
var BASE_PATH_PY = FIXED_NEOPY_NOTIFICATION_NEOCOMPILER;
var BASE_PATH_CLI = FIXED_NEOCLI_RPC_BASE_PATH_NEOCOMPILER;

var KNOWN_ADDRESSES = [];
KNOWN_ADDRESSES.push({ publicKey: 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', privateKey: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr', pubKey: '031a6c6fbbdf02ca351745fa86b9ba5a9452d785ac4f7fc2b7548ca2a46c4fcf4a' });
KNOWN_ADDRESSES.push({ publicKey: 'APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL', privateKey: 'L56SWKLsdynnXTHScMdNjsJRgbtqcf9p5TUgSAHq242L2yD8NyrA', pubKey: '036245f426b4522e8a2901be6ccc1f71e37dc376726cc6665d80c5997e240568fb' });
KNOWN_ADDRESSES.push({ publicKey: 'AXxCjds5Fxy7VSrriDMbCrSRTxpRdvmLtx', privateKey: 'KwNkjjrC5BLwG7bQuzuVbFb5J4LN38o1A8GDX4eUEL1JRNcVNs9p', pubKey: '0303897394935bb5418b1c1c4cf35513e276c6bd313ddd1330f113ec3dc34fbd0d' });
KNOWN_ADDRESSES.push({ publicKey: 'AQaJZTKshTQzcCKmsaoNVrtSP1pEB3Utn9', privateKey: 'KxPHsCAWkxY9bgNjAiPmQD87ckAGR79z41GtwZiLwxdPo7UmqFXV', pubKey: '02e2baf21e36df2007189d05b9e682f4192a101dcdf07eed7d6313625a930874b4' });
var ADDRESSES_TO_CLAIM = new Array(0);

var BASE_ANGULARJS_PATH = "";

var LOCAL_DEVELOPMENT = false;
if(this.window.location.href.indexOf("localhost")  != -1)
	LOCAL_DEVELOPMENT = true;

if(LOCAL_DEVELOPMENT){
	BASE_PATH_NEOSCAN = FIXED_NEOSCAN_LOCALHOST;
        BASE_PATH_PY = FIXED_NEOPY_NOTIFICATION_LOCALHOST;
        BASE_PATH_CLI = FIXED_NEOCLI_RPC_BASE_PATH_LOCALHOST;
}

var ENV_VARS = "";

/* Main  */
var app = angular.module('neoCompilerIoWebApp', [
  'ngRoute'
]);

/* Routes */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

    //home page
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})

    // Pages
    .when("/neoeditor", {templateUrl: "partials/neoeditor.html", controller: "PageCtrl"})
    .when("/ecolab", {templateUrl: "partials/ecolab.html", controller: "PageCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})

    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/* Controls all other Pages */
app.controller('PageCtrl', function ( $scope, /*$location, */$http) {
	// TODO: improve! do we need a post for this?? it seems unlikely...
	$http({ method: 'POST',
            url: '/getvars'
         }).then(function (response){
						ENV_VARS = response.data;
						$("#footerversion")[0].innerHTML='<a href="https://github.com/neoresearch/neocompiler-eco/commit/'+ENV_VARS.commit+'">Get on GitHub</a>';
         }, function (error) {console.log("ENV_VARS error:"+JSON.stringify(error));});

  // Activates Tooltips for Social Links
  //$('.tooltip-social').tooltip({
  //  selector: "a[data-toggle=tooltip]"
  //})
});
