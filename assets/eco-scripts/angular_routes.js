/* Main  */
var app = angular.module('ecoV3WebApp', [
    'ngRoute'
]);

/* Routes */
angular.
module('ecoV3WebApp').
config(['$routeProvider',
    function config($routeProvider) {
        $routeProvider.
            //home page
        when("/", {
            redirectTo: "/"
        }).
        when("/:tab", {
                templateUrl: "/index.html",
                reloadOnUrl: false,
                reloadOnSearch: false,
                controller: routeLoaderPills
            }).
            // else 404
        otherwise("/assets/404.html");
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