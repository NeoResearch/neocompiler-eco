/* Main  */
var app = angular.module('neoCompilerIoWebApp', [
  'ngRoute'
]);

var NEOSCAN_PATH = "https://neoscan.neocompiler.io";
var NODES_CSHARP_PATH = "http://nodes.csharp.neocompiler.io";

var LOCAL_DEVELOPMENT = false;
if(this.window.location.href.indexOf("localhost")  != -1)
	LOCAL_DEVELOPMENT = true;

if(LOCAL_DEVELOPMENT){
	NEOSCAN_PATH = "http://localhost:4000";
	NODES_CSHARP_PATH = "http://localhost:30333";
}

/* Routes */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

    //home page
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})

    // Pages
    .when("/neoeditor", {templateUrl: "partials/neoeditor.html", controller: "PageCtrl"})
    .when("/utils", {templateUrl: "partials/utils.html", controller: "PageCtrl"})
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
