/* Some Global Variables  */

var refreshIntervalId = 0;
var ALLOW_NOTIFICATIONS_ALERTS = true;

var KNOWN_ADDRESSES = [];
//Template
//KNOWN_ADDRESSES.push({ type: 'commonAddress, multisig or specialSC', addressBase58: '', pKeyWif: '', privKey: '', pubKey: '', print: false, verificationScript: ''});
//AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr', privKey: '', pubKey: '', print: true, verificationScript: '' });
//APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'L56SWKLsdynnXTHScMdNjsJRgbtqcf9p5TUgSAHq242L2yD8NyrA', privKey: '', pubKey: '', print: true, verificationScript: '' });
//AXxCjds5Fxy7VSrriDMbCrSRTxpRdvmLtx
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'KwNkjjrC5BLwG7bQuzuVbFb5J4LN38o1A8GDX4eUEL1JRNcVNs9p', privKey: '', pubKey: '', print: true, verificationScript: '' });
//AQaJZTKshTQzcCKmsaoNVrtSP1pEB3Utn9
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'KxPHsCAWkxY9bgNjAiPmQD87ckAGR79z41GtwZiLwxdPo7UmqFXV', privKey: '', pubKey: '', print: true, verificationScript: ''});
//AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU
//owners: [{publicKey: "AKkkumHbBipZ46UMZJoFynJMXzSRnBvKcs"},{publicKey: "AWLYWXB8C9Lt1nHdDZJnC5cpYJjgRDLk17"},{publicKey: "AR3uEnLUdfm1tPMJmiJQurAXGL7h3EXQ2F"},{publicKey: "AJmjUqf1jDenxYpuNS4i2NxD9FQYieDpBF"}
KNOWN_ADDRESSES.push({ type: 'multisig', addressBase58: '', pKeyWif: '', privKey: '', pubKey: '', print: true, verificationScript: '532102103a7f7dd016558597f7960d27c516a4394fd968b9e65155eb4b013e4040406e2102a7bc55fe8684e0119768d104ba30795bdcc86619e864add26156723ed185cd622102b3622bf4017bdfe317c58aed5f4c753f206b7db896046fa7d774bbc4bf7f8dc22103d90c07df63e690ce77912e10ab51acc944b66860237b608c4f8f8309e71ee69954ae',
owners: '' });

// ==============================================================================================
// Genesis Multi-sig - Owners of 'AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU'
// Signing order: [NODE2, NODE1, NODE3, NODE4]
//Node1
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'KxyjQ8eUa4FHt3Gvioyt1Wz29cTUrE4eTqX3yFSk1YFCsPL8uNsY', privKey: '', pubKey: '', print: false, verificationScript: ''});
//Node2
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'KzfPUYDC9n2yf4fK5ro4C8KMcdeXtFuEnStycbZgX3GomiUsvX6W', privKey: '', pubKey: '', print: false, verificationScript: ''});
//Node3
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'L2oEXKRAAMiPEZukwR5ho2S6SMeQLhcK9mF71ZnF7GvT8dU4Kkgz', privKey: '', pubKey: '', print: false, verificationScript: ''}); 
//Node4
KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: '', pKeyWif: 'KzgWE3u3EDp13XPXXuTKZxeJ3Gi8Bsm8f9ijY3ZsCKKRvZUo1Cdn', privKey: '', pubKey: '', print: false, verificationScript: ''}); 
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
        

