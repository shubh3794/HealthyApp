'use strict';
/* global app: true */
var app = angular.module('projApp', [
      'satellizer',
      'ngRoute'
    ]);
/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
app.config(['$routeProvider','$locationProvider', '$httpProvider', '$authProvider', '$controllerProvider', function($routeProvider,$locationProvider,$httpProvider,$authProvider,$controllerProvider) {

$controllerProvider.allowGlobals();
$httpProvider.interceptors.push('authInterceptor');

$routeProvider.when('/', {
  controller: 'indexController',
  templateUrl: '/static/templates/polls/base.html'
})
.when('/dashboard/:id', {
  controller: 'dashboardController',
  templateUrl: '/static/templates/polls/Profile.html'
})
.when('/profile/', {
  controller: 'profileController',
  templateUrl: '/static/templates/polls/Profile.html'
})
.when('/activationRedirect/:uid/:activation_key', {
  controller: 'confirmController',
  templateUrl: '/static/templates/polls/confirmTemp.html'    
})
.when('/passwordreset/:uid/:activation_key', {
  controller: 'resetController',
  templateUrl: '/static/templates/polls/resetPassword.html'    
})
.when('/detail/:id', {
    controller: 'questionController',
    templateUrl: '/static/templates/polls/details.html'
})
.when('/results/:id', {
    controller: 'resultController',
    templateUrl: '/static/templates/polls/results.html'
}).otherwise('/');

$authProvider.facebook({
    url: 'http://healthifyproject.com:8000/auth/social/login/social/token_user/facebook/',
    clientId: '485845648274530'
});

$authProvider.authToken = 'Token';
$authProvider.tokenPrefix = '';

$locationProvider.html5Mode(true);
$locationProvider.hashPrefix('!');
}]);

app.run(['$http',function($http){
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}]);

var constantData = {
  'constants': {
    'API_SERVER':'http://healthifyproject.com:8000/',
    'User':'',
  }
};

app.constant('constants',constantData['constants']);
