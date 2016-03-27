/*Handles request to user registration, login, logout*/
'use strict';
// $q makes a promise which can be fulfilled or not fulfilled. so a = $q.defer(), it can resolve or reject
//a.resolve() means success, a.reject() means not fulfilled

app.factory('httpService',['$http', '$q', function($http,$q){
  //encodes params into correct format 
  var toparams = function(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
};
//makes a post using url and params as parameter
    var httpPost = function(url,params){
      params = toparams(params);
      var promise = $http.post(url, params,{
        headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
      function(response){
        return response.data;
      });
      return promise;
    };
//http get method wrapper
    var httpGet = function(url){
      var promise = $http.get(url).then(
      function(response){
        return response.data;
      });
      return promise;
    };


    return{
      httpPost : function(url,params){
        return httpPost(url,params);
      },
      httpGet : function(url,params){
        return httpGet(url,params);
      }

    };
}]);

/* Takes care of authentication functionality and also stores user object for sharing among different controllers*/
app.factory('AuthService',
            ['httpService', '$location','constants','$q','$window', '$rootScope', '$auth', function(httpService,$location,constants,$q,$window, $rootScope, $auth){
   var register = function(username, password, email) {
    // Registration logic goes here

    //constants is a angular.constant service which will contain all the constants for our app
    //being used 
    var deferred = $q.defer();
    var url = constants['API_SERVER'] + 'authentication/register/';
    var userString = {
                     'username': username,'password': password,'email': email};

    httpService.httpPost(url, userString).then(
      function(response) {
  		        deferred.resolve(response);
          },
          function(response) {
              deferred.reject(response);
          });
          return deferred.promise;
          };

/* Login logic goes here {This is normal login, not social login }*/
var login = function(username, password) {
    var url = constants['API_SERVER'] + 'authentication/login/';
    var deferred = $q.defer();
    httpService.httpPost(url, {
                     'email': username,
                     'password': password,
                 }).then(
  function(response) {
    var token = response.auth_token;
    if (token) {
  		$window.localStorage.token = token;
  		deferred.resolve(response);

  }
  else{
    // error callback
    constants['User'] = '';
    userOb.set_user();
    $auth.removeToken();
    deferred.reject('Invalid data received from server');

  }
},
function(response) {
    constants['User'] = response;
    userOb.set_user();
    $auth.removeToken();
    deferred.reject(response);

});
return deferred.promise;};

var isLoggedIn =  function(){
  var url = constants['API_SERVER']+'auth/detail/loginstatus/';
  var deferred = $q.defer();
  httpService.httpGet(url).then(
  function(response) {
    $window.localStorage.setItem('pk', response.pk);
    var resp = {};
    resp.status=response.status;
    deferred.resolve(resp);

  },
function(response) {
    deferred.reject(response);
    $auth.removeToken();

});

  return deferred.promise;

};

var getCurrUser = function(id){
      var url = constants['API_SERVER'] + 'auth/detail/' + id+ '/';
      var deferred = $q.defer();
  httpService.httpGet(url).then(
  function(response) {
    deferred.resolve(response);
  },
function(response) {
    deferred.reject(response);
});

  return deferred.promise;

};

/* function to logout for normally signed in user */
var logout = function(){
  var url = constants['API_SERVER']+'authentication/logout/';
  var deferred = $q.defer();
  httpService.httpPost(url).then(
      function(response) {
              constants['User'] = response.data;
              $auth.removeToken();
              $window.localStorage.clear();
              deferred.resolve(response);
          },
          function(response) {
              deferred.reject(response);
          });
          
	
  return deferred.promise;

};

/*User resource for sharing between different controllers */
var userOb = {};
userOb.current = {};
userOb.set_user = function(response){
  if (response){
    userOb.current = response.data;
} else {
    userOb.current = {
        'username': null,
        'first_name': null,
        'last_name': null,
        'email': null,
        'social_thumb': '{% static "anonymous.png" %}'
    };
}
};

/*Function for social login */
var loginSocial = function(provider){
  var prom = $q.defer();
  $auth.authenticate(provider).then(function(response){
  $auth.setToken(response.data.token);
  $window.localStorage.setItem('user',JSON.stringify(response.data));
  constants['User'] = response.data;
    prom.resolve(response.data);
}).catch(function(data) {
      logout();
      constants['User'] = '';
      prom.reject('Something went wrong, try again later');
      userOb.set_user();
      });

return prom.promise;
};

//stores the info of current user to share amongst different controllers.
var getCurrentUserDetails = function(){
  console.log($window.localStorage.getItem('pk'));
  var url = constants['API_SERVER'] + 'auth/detail/getcurruser/' + $window.localStorage.getItem('pk') + '/';
  var deferred = $q.defer();
  httpService.httpGet(url).then(function(response){
    $window.localStorage.setItem('user',JSON.stringify(response));

    deferred.resolve(response);

  },function(response){
    $window.localStorage.setItem('user',JSON.stringify(response));

    deferred.reject(response);

  });
  return deferred.promise;

};

//Function for forgot password and this sends email to user with activation link
var resetPassword = function(email) {
  //url to be hit
    var url = constants['API_SERVER'] + 'authentication/password/reset/';
    //promise to be fulfilled
    var deferred = $q.defer();
    httpService.httpPost(url, {
                     'email':email,
                 }).then(
  function(response) {
    //promise is fulfilled
    deferred.resolve(response.data);

},
function(response) {
  //error, promise not fulfilled :(
    deferred.reject(response.data);

});
//return promise, promise gets things done
return deferred.promise;};

//return all these features as function
  return {
    register: function(username, password, email) {
      return register(username, password, email);
    },
    login: function(username, password){
      return login(username, password);

    },
    logout : function(){
    	return logout();
    	

    },

    socialAuth : loginSocial,

    getAuthdUser : function(){return getCurrentUserDetails();},

    forgotPassword : resetPassword,

    isLoggedIn : isLoggedIn,

    storeCurrUser : function(id){
      return getCurrUser(id);
    }
  };

}]);

