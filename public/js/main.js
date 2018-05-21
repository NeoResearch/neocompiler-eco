/* Some Global Variables  */
var FIXED_NEOSCAN_NEOCOMPILER = "https://neoscan.neocompiler.io";
var FIXED_NEOSCAN_LOCALHOST = "http://localhost:4000";
var FIXED_NEOSCAN_MAINNET = "https://neoscan.io";
var FIXED_NEOSCAN_TESTNET = "http://localhost:4000";


var BASE_PATH_NEOSCAN = FIXED_NEOSCAN_NEOCOMPILER;
var BASE_PATH_PY = "https://rest.neocompiler.io";
var BASE_PATH_CLI = "https://node1.neocompiler.io";


var BASE_ANGULARJS_PATH = "";

var LOCAL_DEVELOPMENT = false;
if(this.window.location.href.indexOf("localhost")  != -1)
	LOCAL_DEVELOPMENT = true;

if(LOCAL_DEVELOPMENT){
	BASE_PATH_NEOSCAN = FIXED_NEOSCAN_LOCALHOST;
        BASE_PATH_PY = "http://localhost:38088";
        BASE_PATH_CLI = "http://localhost:30335";
}

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
  // Activates Tooltips for Social Links
  //$('.tooltip-social').tooltip({
  //  selector: "a[data-toggle=tooltip]"
  //})
});
