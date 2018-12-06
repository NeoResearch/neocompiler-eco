/* Some Global Variables  */

var numberCompilations = 0;
var numberDeploys = 0;
var numberInvokes = 0;
var refreshIntervalId = 0;
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
	$http({ method: 'GET',
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

