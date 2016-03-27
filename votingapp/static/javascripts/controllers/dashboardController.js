'use strict';
app.controller('dashboardController', ['$scope','$window','$location', 'AuthService','$routeParams','PollService',
               function ($scope, $window, $location, AuthService, $routeParams,PollService) {


    if(!$window.localStorage.token){
    	$location.path('/');
    }

   	$scope.getUser = function(){
   		var id = $routeParams.id.replace('user','');
   		AuthService.storeCurrUser(id).then(function(response){

   			$scope.Profile = response;
        $scope.votedQues = [];
        for(var i=0;i<$scope.Profile.voter.length;i++){
          PollService.getQues($scope.Profile.voter[i].ques).then(function(response){
            $scope.votedQues.push(response);
            console.log($scope.votedQues);
          }, function(response){
            console.log(response);
          });

        }
   		}, function(response){
   			$scope.Profile = '';
   		});

   		

   	};
   	$scope.getUser();
   	$scope.AuthenticatedUser = JSON.parse($window.localStorage.getItem('user'));
   	
   	

}]);

app.controller('profileController', ['$scope','$window','$location', 'AuthService','$routeParams','PollService',
               function ($scope, $window, $location, AuthService, $routeParams,PollService) {


    if(!$window.localStorage.token){
      $location.path('/');
    }

    $scope.getUser = function(){
      AuthService.getAuthdUser().then(function(response){

        $scope.Profile = response;
         $scope.votedQues = [];
        for(var i=0;i<$scope.Profile.voter.length;i++){
          PollService.getQues($scope.Profile.voter[i].ques).then(function(response){
            $scope.votedQues.push(response);
            console.log($scope.votedQues);
          }, function(response){
            console.log(response);
          });

        }
      }, function(response){
        $scope.Profile = '';
      });

      

    };
    $scope.getUser();
    $scope.AuthenticatedUser = JSON.parse($window.localStorage.getItem('user'));
    
    

}]);