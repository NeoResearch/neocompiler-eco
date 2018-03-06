/* Main  */
var app = angular.module('neoCompilerIoWebApp', [
  'ngRoute'
]);

/* Routes */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Pages
    .when("/", {templateUrl: "partials/neoeditor.html", controller: "PageCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})

    // Utils
    //.when("/utils1", {templateUrl: "partials/utils1.html", controller: "PageCtrl"})
    //.when("/utils2", {templateUrl: "partials/utils2.html", controller: "PageCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/* Controls all other Pages */
app.controller('PageCtrl', function ( $scope, /*$location, */$http) {
  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});
