/* Some Global Variables  */

var refreshIntervalId = 0;

var KNOWN_ADDRESSES = [];
KNOWN_ADDRESSES.push({ publicKey: 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', privateKey: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr', pubKey: '031a6c6fbbdf02ca351745fa86b9ba5a9452d785ac4f7fc2b7548ca2a46c4fcf4a', print: true });
KNOWN_ADDRESSES.push({ publicKey: 'APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL', privateKey: 'L56SWKLsdynnXTHScMdNjsJRgbtqcf9p5TUgSAHq242L2yD8NyrA', pubKey: '036245f426b4522e8a2901be6ccc1f71e37dc376726cc6665d80c5997e240568fb', print: true });
KNOWN_ADDRESSES.push({ publicKey: 'AXxCjds5Fxy7VSrriDMbCrSRTxpRdvmLtx', privateKey: 'KwNkjjrC5BLwG7bQuzuVbFb5J4LN38o1A8GDX4eUEL1JRNcVNs9p', pubKey: '0303897394935bb5418b1c1c4cf35513e276c6bd313ddd1330f113ec3dc34fbd0d', print: true });
KNOWN_ADDRESSES.push({ publicKey: 'AQaJZTKshTQzcCKmsaoNVrtSP1pEB3Utn9', privateKey: 'KxPHsCAWkxY9bgNjAiPmQD87ckAGR79z41GtwZiLwxdPo7UmqFXV', pubKey: '02e2baf21e36df2007189d05b9e682f4192a101dcdf07eed7d6313625a930874b4', print: true });
KNOWN_ADDRESSES.push({ publicKey: 'AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU', privateKey: '', pubKey: '', print: true, verificationScript: '532102103a7f7dd016558597f7960d27c516a4394fd968b9e65155eb4b013e4040406e2102a7bc55fe8684e0119768d104ba30795bdcc86619e864add26156723ed185cd622102b3622bf4017bdfe317c58aed5f4c753f206b7db896046fa7d774bbc4bf7f8dc22103d90c07df63e690ce77912e10ab51acc944b66860237b608c4f8f8309e71ee69954ae',
owners: [{publicKey: "AKkkumHbBipZ46UMZJoFynJMXzSRnBvKcs"},{publicKey: "AWLYWXB8C9Lt1nHdDZJnC5cpYJjgRDLk17"},{publicKey: "AR3uEnLUdfm1tPMJmiJQurAXGL7h3EXQ2F"},{publicKey: "AJmjUqf1jDenxYpuNS4i2NxD9FQYieDpBF"}] });

// ==============================================================================================
// Genesis Multi-sig - Owners of 'AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU'
// Signing order: [NODE2, NODE1, NODE3, NODE4]
//Node1
KNOWN_ADDRESSES.push({ publicKey: 'AKkkumHbBipZ46UMZJoFynJMXzSRnBvKcs', privateKey: 'KxyjQ8eUa4FHt3Gvioyt1Wz29cTUrE4eTqX3yFSk1YFCsPL8uNsY', print: false});
//Node2
KNOWN_ADDRESSES.push({ publicKey: 'AWLYWXB8C9Lt1nHdDZJnC5cpYJjgRDLk17', privateKey: 'KzfPUYDC9n2yf4fK5ro4C8KMcdeXtFuEnStycbZgX3GomiUsvX6W', print: false});
//Node3
KNOWN_ADDRESSES.push({ publicKey: 'AR3uEnLUdfm1tPMJmiJQurAXGL7h3EXQ2F', privateKey: 'L2oEXKRAAMiPEZukwR5ho2S6SMeQLhcK9mF71ZnF7GvT8dU4Kkgz', print: false}); 
//Node4
KNOWN_ADDRESSES.push({ publicKey: 'AJmjUqf1jDenxYpuNS4i2NxD9FQYieDpBF', privateKey: 'KzgWE3u3EDp13XPXXuTKZxeJ3Gi8Bsm8f9ijY3ZsCKKRvZUo1Cdn', print: false}); 
// ==============================================================================================

var ADDRESSES_TO_CLAIM = new Array(0);

// ==============================================================================================
// ======================= INITIALIZING BASE PATHS ==============================================
//COMPILERS EXPRESS RPC PATH
var BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers",ecoNodes);
//CSHARP RPC BASE PATH (On the main and testnet some python RPC are running - Check TODO)
var BASE_PATH_CLI = getFirstAvailableService("RPC",ecoNodes);
// ECO SERVICES RPC PATH - [SOCKETIO - CSHARPNODESLOGS - PYTHON-NOTIFICATIONS]
var BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices",ecoNodes);
// NEOSCAN PATH PATH 
var BASE_PATH_NEOSCAN = getFirstAvailableService("neoscan",ecoNodes);
// PYTHON REST NOTIFICATIONS
var BASE_PATH_PY_REST = getFirstAvailableService("RESTNotifications",ecoNodes);

var LOCAL_DEVELOPMENT = false;
if(this.window.location.href.indexOf("localhost")  != -1)
	LOCAL_DEVELOPMENT = true;

if(LOCAL_DEVELOPMENT){
	BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers",localHostNodes);
        BASE_PATH_CLI = getFirstAvailableService("RPC",localHostNodes);
	BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices",localHostNodes);
	BASE_PATH_NEOSCAN = getFirstAvailableService("neoscan",localHostNodes);
	BASE_PATH_PY_REST = getFirstAvailableService("RESTNotifications",localHostNodes);
}
// ==============================================================================================

//Initializating socket var
var socket = io.connect(BASE_PATH_ECOSERVICES, {resource: 'nodejs'});

var ENV_VARS = "";

/* Main  */
var app = angular.module('neoCompilerIoWebApp', [
  'ngRoute'
]);

/* Routes */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

    //home page
    .when("/", {templateUrl: "public/partials/home.html", controller: "PageCtrl"})

    // Pages
    .when("/neoeditor", {templateUrl: "public/partials/neoeditor.html", controller: "PageCtrl"})
    .when("/ecolab", {templateUrl: "public/partials/ecolab.html", controller: "PageCtrl"})
    .when("/about", {templateUrl: "public/partials/about.html", controller: "PageCtrl"})

    // else 404
    .otherwise("/404", {templateUrl: "public/partials/404.html", controller: "PageCtrl"});
}]);

/* Controls all other Pages */
app.controller('PageCtrl', function ( $scope, /*$location, */$http) {
	// TODO: improve! do we need a post for this?? it seems unlikely...
	$http({ method: 'POST',
            url: BASE_PATH_ECOSERVICES+'/getvars'
         }).then(function (response){
						ENV_VARS = response.data;
						$("#footerversion")[0].innerHTML='<a href="https://github.com/neoresearch/neocompiler-eco/commit/'+ENV_VARS.commit+'">Get on GitHub</a>';
         }, function (error) {console.log("ENV_VARS error:"+JSON.stringify(error));});


  // Activates Tooltips for Social Links
  //$('.tooltip-social').tooltip({
  //  selector: "a[data-toggle=tooltip]"
  //})
});

function getServiceURLByTypeAndNetwork(serviceType,networkService){
          var serviceUrlToAdd = '';

          if( (serviceType == "RPC") && ( (networkService.type == serviceType) || (networkService.type+"-Python" == serviceType+"-Python") ) )
          {
            if(networkService.protocol)
              serviceUrlToAdd = networkService.protocol + "://"+networkService.url;
            if(networkService.port)
              serviceUrlToAdd += ":"+networkService.port;

	    return serviceUrlToAdd;
          }

          if( networkService.type == serviceType)
          {
              serviceUrlToAdd = networkService.url;
          }

          return serviceUrlToAdd;
}

function getFirstAvailableService(serviceType,networkServicesObj){
          for(var kn = 0; kn < networkServicesObj.length; kn++)
          {
            var serviceUrlToAdd = getServiceURLByTypeAndNetwork(serviceType,networkServicesObj[kn]);

            if(serviceUrlToAdd !== '')
              return serviceUrlToAdd;
          }
}
        

