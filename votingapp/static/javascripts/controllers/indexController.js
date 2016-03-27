'use strict';
app.controller('indexController', ['$scope','$window','$location', 'PollService',
               function ($scope, $window, $location, PollService) {
  /*if (!$window.localStorage.token) {
    $location.path('/');
    return;
  }*/
  $scope.Polls = undefined;
  var fun = function(){
    PollService.getIndexView().then(function(response){
      $scope.Polls = response;
    },function(response){
      $scope.err = 'something went wrong try again';

    });
  };
  fun();

  if($window.localStorage.user && $window.localStorage.user.voter !== undefined){
        $scope.user = $window.localStorage.user;
        console.log($scope.user);
        $scope.checkIfVoted = function(id){
        for(var i=0; i<$scope.user.voter.length; i++){
        if(id===$scope.user.voter[i].ques){
          return true;

        }
      }
      return false;
    };
  }      
}]);


app.controller('resetController', ['$scope', '$window', '$location','httpService','$routeParams',
               function ($scope, $window, $location, httpService, $routeParams){ 
                 $scope.resetPasswordConfirm = function(pwd, confirm){
                  var uid = $routeParams.uid;
                  var activation_key = $routeParams.activation_key;
                  var url = 'authentication/password/reset/confirm/';
                  httpService.httpPost(url, {
                    'uid':uid,
                    'token':activation_key,
                    'new_password':pwd,
                    're_new_password':confirm
                  }).then( function(response){
                    $scope.Message = 'password set! login to continue';
                },function(error){
                  $scope.ResetError = 'Try again later with correct email which exist in our system';
                });
                };
               }]);
