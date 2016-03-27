'use strict';
app.controller('questionController', ['$scope','$window','$location', 'AuthService','PollService','$routeParams',
               function ($scope, $window, $location, AuthService, PollService, $routeParams) {
$scope.choice = {};
var getQues = function(){
	var id = $routeParams.id;
	PollService.getQues(id).then(function(response){
		$scope.question = response;
	},function(response){
		$location.path('/');
		console.log(response);

	});

};

getQues();
$scope.try = function(x){
	$scope.choice.select = x;
};


$scope.tryo = function(qid){
	PollService.vote($scope.choice.select, qid).then(function(response){
		$scope.message = response.status;
	}, function(response){
		$scope.message = "sorry could not vote now, try again later";

	});
};




}]);

app.controller('resultController', ['$scope','$window','$location', 'AuthService','PollService','$routeParams',
               function ($scope, $window, $location, AuthService, PollService, $routeParams) {
$scope.voters = [];
var getQues = function(){
	var id = $routeParams.id;
	PollService.getQues(id).then(function(response){
		$scope.question = response;
		// for(var i=0;i<$scope.question.choices.length;i++)
		// {
		// 	for(var j =0;j<$scope.question.choices[i].vote.length;j++)
		// 	{
		// 		AuthService.storeCurrUser($scope.question.choices[i].vote[j].user).then(function(response){
		// 			obj = {};
		// 			$scope.voters.push({  :response});
		// 			console.log($scope.voters);
		// 		},function(response){
		// 			console.log(response);
		// 		});

		// 	}
		// }
			},function(response){
		$location.path('/');
		console.log(response);

	});

};

getQues();





}]);