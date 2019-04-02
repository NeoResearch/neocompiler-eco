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
var lastNeoCliHeight = 0;

/* Mostly used to get the current commit of GitHub repo */
var ENV_VARS = "";
/* End Some Global Variables  */
/* ======================================  */

/* Main  */
var app = angular.module('neoCompilerIoWebApp', [
    'ngRoute'
]);

/* Routes */
angular.
module('neoCompilerIoWebApp').
config(['$routeProvider',
    function config($routeProvider) {
        $routeProvider.
        //home page
        when("/", {
            templateUrl: "public/partials/home.html"
        }).
        // Pages
        when("/neoeditor", {
            templateUrl: "/public/partials/neoeditor.html"
        }).
        when("/ecolab", {
            templateUrl: "/public/partials/ecolab.html",
            reloadOnUrl: false,
            reloadOnSearch: false
        }).
        when("/ecolab/:tab", {
            templateUrl: "/public/partials/ecolab.html",
            reloadOnUrl: false,
            reloadOnSearch: false,
            controller: routeLoaderPills
        }).
        when("/about", {
            templateUrl: "/public/partials/about.html"
        }).
        // else 404
        otherwise("/public/partials/404.html");
    }
]);

function routeLoaderPills($scope, $location) {
    currentURL = $location.url().slice(8);
    //console.log("Loading Pills on startup: " + currentURL);
    $('.nav-pills a[data-target="#' + currentURL + '"]').tab('show');
}

var currentURL = "";
app.controller(
    "AppController",
    function AppController($scope, $location, $route) {
        //var vm = this;
        currentURL = "";
        // When the location changes, capture the state of the full URL.
        $scope.$on(
            "$locationChangeSuccess",
            function locationChanged() {
                currentURL = $location.url().slice(8);
                //vm.currentUrl = currentURL;			
                //console.log("loading I." + currentURL);
                $('.nav-pills a[data-target="#' + currentURL + '"]').tab('show');
            }
        );
    }
);

/* Controls all other Pages */
app.controller('PageCtrl', function($scope, /*$location, */ $http) {
    // TODO: improve! do we need a post for this?? it seems unlikely...
    $http({
        method: 'GET',
        url: BASE_PATH_ECOSERVICES + '/getvars'
    }).then(function(response) {
        ENV_VARS = response.data;
        $("#footerversion")[0].innerHTML = '<a href="https://github.com/neoresearch/neocompiler-eco/commit/' + ENV_VARS.commit + '">Get on GitHub</a>';
    }, function(error) {
        console.log("ENV_VARS error:" + JSON.stringify(error));
    });
    // Activates Tooltips for Social Links
    //$('.tooltip-social').tooltip({
    //  selector: "a[data-toggle=tooltip]"
    //})
});
