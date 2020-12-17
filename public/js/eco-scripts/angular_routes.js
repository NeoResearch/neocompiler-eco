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
            redirectTo: "/ecolab/compilers"
        }).
        // Pages
        when("/neoeditor", {
            templateUrl: "./public/partials/neoeditor.html"
        }).
        when("/ecolab", {
            redirectTo: "/ecolab/compilers"
        }).
        when("/ecolab/:tab", {
            templateUrl: "./public/partials/ecolab.html",
            reloadOnUrl: false,
            reloadOnSearch: false,
            controller: routeLoaderPills
        }).
        when("/about", {
            templateUrl: "./public/partials/about.html",
            reloadOnUrl: false,
            reloadOnSearch: false
        }).
        // else 404
        otherwise("./public/partials/404.html");
    }
]);

function routeLoaderPills($scope, $location) {
    currentURL = $location.url().slice(8);
    //console.log("Loading Pills on startup: " + currentURL);
    $('.nav-pills a[data-target="#' + currentURL + '"]').tab('show');
}

app.controller(
    "AppController",
    function AppController($scope, $location, $route) {
        //var vm = this;
        // When the location changes, capture the state of the full URL.
        $scope.$on(
            "$locationChangeSuccess",
            function locationChanged() {
                //vm.currentUrl = $location.url().slice(8);			
                //console.log("loading I." + currentURL);
                $('.nav-pills a[data-target="#' + $location.url().slice(8) + '"]').tab('show');
            }
        );
    }
);
