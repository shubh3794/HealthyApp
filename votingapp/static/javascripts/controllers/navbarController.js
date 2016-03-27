'use strict';
app.controller('navbarController', ['$scope','$window','$location', 'AuthService','PollService','$compile',
               function ($scope, $window, $location, AuthService, PollService, $compile) {
  /*if (!$window.localStorage.token) {
    $location.path('/');
    return;
  }*/

  $scope.choice = [];
  $scope.counter=2;
  $scope.addToList = function(){

  var elem = angular.element("<li><input type = 'text' name = 'choice' id = 'choice' ng-model='choice["+$scope.counter+"]' required/></li>");
  var compile = $compile(elem)($scope);
  $('#choice_list').append(elem);
  $scope.counter ++;
};
   $scope.login = function(username, password){
    AuthService.login(username, password).then(function(response){
      $scope.isLoggedIn = true;
      $("#modal1").closeModal();
      $scope.checkAuthStatus();
      $location.path('/profile');

    }, function(response){
      $scope.isLoggedIn = false;
      $scope.loginError = 'incorrect credentials';
      console.log(response);
      $location.path('/');
    });


};
    $scope.logout = function(){
    AuthService.logout().then(function(response){
      $scope.isLoggedIn = false;
      $window.localStorage.clear();
      $location.path('/');
      console.log(response);
    }, function(response){
      $scope.isLoggedIn = true;
      
      console.log(response);
    });
    };

    $scope.register = function(username, password, email){
      AuthService.register(username, password, email).then(function(response){
      $scope.signUpMessage = 'Account created, Please check your email to confirm the account';
      console.log(response);
    }, function(response){
      $scope.signupError = 'incorrect credentials';
      console.log(response);
    });

    };

     $scope.Auth = function(provider){
  //provider can be facebook, google-oauth2
  AuthService.socialAuth(provider).then(function(response){
    //close the modal if login is success
    $('#modal1').closeModal();
    //proceed to dashboard
    $scope.isLoggedIn = true;
    $scope.checkAuthStatus();
    $location.path('/profile/');
}, function(error){
  //there is an error
  $scope.loginError = error;
  $location.path('/');
  });  

};

//function to reset password, calls auth service to call forgot password feature. Email is a param
$scope.resetPassword = function(forgotemail){

  var email = forgotemail;
  AuthService.forgotPassword(email).then(function(response){
    //message on success
    $scope.Message='Please check your email to reset password';
  },
  function(response){
    //message on error
    $scope.Message = 'Something went wrong, try again later';
  });

};
     

//Function to switch the views within modal;
    $scope.switchToModal = function (number) {     // function to change the content in modal window
   
    //show second modal view
    
       if (number===2 && $scope.modal2 !== true) {
           $scope.modal2 = true;
           $scope.modal1 = false;
           $scope.modal3 = false;
           $scope.modal4 = false;    

        }
     
    //show third modal view  
        else if (number===3 && $scope.modal3 !== true) {
           $scope.modal3 = true;
           $scope.modal1 = false;
           $scope.modal2 = false;
           $scope.modal4 = false;    

        }
        
     //show fourth modal view  
        else if (number===4 && $scope.modal4 !== true) {
           $scope.modal3 = false;
           $scope.modal1 = false;
           $scope.modal2 = false;
           $scope.modal4 = true;    

        }
    //show default that is first modal view    
        else {
           $scope.modal1 = true;
           $scope.modal2 = false;
           $scope.modal3 = false;
           $scope.modal4 = false;    
        }

    };
//Function to open the modal on clicking login button in the nav
    $scope.openModal = function(num){
      

      if(num===1){
      $scope.switchToModal(5);
      
  }
      else if(num===4){

      $scope.switchToModal(4);
      
      }
    $('#modal1').openModal();
    };


    //function to check if user is logged in
    $scope.checkAuthStatus = function(){
      AuthService.isLoggedIn().then(function(response){
      $scope.isLoggedIn = response.status;

    }, function(response){
      $scope.isLoggedIn = false;
    });
};

  $scope.checkAuthStatus();


  $scope.createQues = function(questionModel){
    PollService.createQues(questionModel).then(function(response){
      console.log($scope.choice);
      $scope.message = 'Question created. Share the following URL to ask your friends to vote, http://healthifyproject.com:8000/detail/'+response.id+'/';


      for(var i=0;i<$scope.choice.length;i++){
        console.log(response.id, $scope.choice[i])
        PollService.createChoice(response.id, $scope.choice[i]).then(function(resp){

        },function(resp){
          console.log(resp);

        });
      }
      alert(message);
    },function(response){
      console.log('cant create ques right now');
      alert(response);
    });

  };

        
}]);

app.controller('confirmController', ['$scope', '$window', '$location','httpService','$routeParams',
 function ($scope, $window, $location, httpService, $routeParams){ 
  $scope.content = 'Just a moment we are confirming your account';
  var init = function(){
    var uid = $routeParams.uid;
    var activation_key = $routeParams.activation_key;
    var url = 'http://healthifyproject.com:8000/authentication/activate/';
    var data = {
      'uid':uid,
      'token':activation_key
    };
    httpService.httpPost(url, data).then(function(response){
      $window.localStorage.status = 'Account confirm, ask to login';
      $scope.content = 'Account confirmed, please login here';
      $('#contRed').append('<a href="http://healthifyproject.com:8000/"><br>Login</a>');
  },function(error){
    $scope.content="something went wrong, try again later";
    $scope.content = error;
  });
  };
  init(); 
 }]);