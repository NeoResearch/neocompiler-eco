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

/* Controls all other Pages */
app.controller(
    'AppFooter', 
    function($scope, /*$location, */ $http) {
    $http({
        method: 'GET',
        url: BASE_PATH_ECOSERVICES + '/getvars'
    }).then(function(response) {
        $("#footerversion")[0].innerHTML = '<a href="https://github.com/neoresearch/neocompiler-eco/commit/' + response.data.commit + '">Get Source on <i class="fab fa-lg fa-github"></i></a>';
    }, function(error) {
        console.log("Controller AppFooter GET error:" + JSON.stringify(error));
    });
    // Activates Tooltips for Social Links
    //$('.tooltip-social').tooltip({
    //  selector: "a[data-toggle=tooltip]"
    //})
});
