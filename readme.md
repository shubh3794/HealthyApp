AIM:https://docs.google.com/document/d/1gryssixuh6SCrKccW8rFh1Tq30ducOpuPdCZrfhmY9c/edit#

###Setup! First thing : 
 on ubuntu or mac terminal run gedit /etc/hosts/
 and add the following

	127.0.0.1	healthifyproject.com

Outcome the hosts file now looks like this :

	127.0.0.1	healthifyproject.com
	127.0.0.1	localhost
	127.0.1.1	jx-dell-3

This was necessary to add fb login and also for AngularJS routes


Tech used:
Django, Django rest framework, MySql,AngularJS, css3, materializecss, bower

###Features
	facebook oauth
	token based auth
	profile views with profile pictures
	results visible only to question creators
	choices can only be created question owners
	sharing url provided to the user for sharing to ask for votes/opinions

	

###Django setup:
	mkvirtualenvwrapper venv
	source virtualenvwrapper.sh
	workon venv
	cd into votingapp/voteApp

	pip install -r requirements.txt
 



# backend configuration

After pulling the repository, make sure you have the DB created in mysql with same name that is specified in the settings.py file. Grant all privileges to the specified user by the following command :

Read settings.py file, go to DATABASES dictionary and read the name of the database, user name and password


First thing is first:

	gedit ~/.bashrc
	export PROJECT_DB_NAME='healthifyProject'
	export PROJECT_DB_ROOT_USER='username'
	export PROJECT_DB_ROOT_USER_PWD='password'
	export email_user='email@gmail'
	export email_password='2 step validation password token'
	Make sure MY SQL is installed

type in the terminal :

	mysql -u root -p >
	Enter your password and press enter >
	create database 'DBNAME IN SETTINGS.py'>
	GRANT ALL PRIVILEGES ON mydb.* TO 'username'@'%' WITH GRANT OPTION;
	quit() >

Run python manage.py makemigrations > python manage.py migrate

Make sure you have your super user created and if not then

	python manage.py createsuperuser >
	Enter email,username,password 

You have your superuser

NOTE: Do not commit any db changes or migrations, to avoid this, migrations directory has been included in gitignore

Whenever you install any dependency by pip
run the following command:

	pip freeze>requirements.txt


##Front end configuration

after pulling the repository, make sure you have bower and npm installed globally, if not then 
here are the commands :

Installation Instructions for Linux Distributions : 
/* Remove all older packages of node */

	dpkg --get-selections | grep node
	sudo apt-get remove --purge node
	sudo apt-get remove --purge nodejs

/* Now install */

	sudo apt-get install nodejs 
	sudo apt-get install npm
	sudo ln -s /usr/bin/nodejs /usr/bin/node


/* Getting started with frontend project */
 cd to your static
 
	 cd static
 

 now in your project's base directory(the path where you see static files) run the following command
 
	 bower install

 this will install all the dependencies in the static folder as the path is set in .bowerrc in the base directory

/* To run the project */

Make sure you have all the requirements in the requirements.txt satisfied
then while your terminal is in base dir and virtualenv activated

run the following command


python manage.py runserver

/* Small note */


	python manage.py makemigrations
	python manage.py migrate

	

	
###API_VIEWS:
/*Question*/

	URL : http://healthifyproject.com:8000/polls/sys/question/{{pk}}
		method GET:
			lists or retrieves(if pk is there) all the questions asked
	                    request {}
	                    response is JSON containin array of objects like this {
				"id": 2 (id of question)
				"choices": [2]
				0:  {
				"	id": 1 
					"votes": null/number(if the question is created by user then number else null)
					"choice_text": "game of thrones"
					"question": 2
					}-
				1:  {
					"id": 2
					"votes": 0
					"choice_text": "Breaking bad"
					"question": 2
				}-
				-
				"question_text": "Which movie should I watch today?"
				"pub_date": "2016-03-25T14:02:39.266374Z"
				"createdby": 13
				}

	method POST:
		permissions: User should be authenticated
		request {
		 'question_text':''
		}
		response{
		JSON of question like above
		}
/*Choice*/

	URL : http://healthifyproject.com:8000/polls/sys/choice/
	method GET:
		Not allowed

	method POST:
		permissions: User should be authenticated and owner of question whose choices are being created
		request {
		 'qid':'',
		 'choice_text':''
		}
		response{
		JSON of question like above
		}

/*Vote*/

	URL : http//healthifyproject.com:8000/polls/vote/
		method get:
			Not allowed
		method post: permissions : authenticated usrr
			request {'cid':choice_id,
				 'qid': qid} 
			response { 'status': 'vote has been casted'}


/*authentication*/

##All the following urls under authentication have a prefix http//healthifyproject.com:8000/authentication
###GET

	URL: /me/

##Retrieve user.

	response

	status: HTTP_200_OK (success)

	data:

	{{ User.USERNAME_FIELD }}

	{{ User._meta.pk.name }}

	{{ User.REQUIRED_FIELDS }}

##PUT

	URL: /me/

##Update user.

	request

	data:

	{{ User.REQUIRED_FIELDS }}

	response

	status: HTTP_200_OK (success)

	data:

	{{ User.USERNAME_FIELD }}

	{{ User._meta.pk.name }}

	{{ User.REQUIRED_FIELDS }}

##Register

	Use this endpoint to register new user. Your user model manager should implement create_user method and have USERNAME_FIELD and REQUIRED_FIELDS fields.

###POST

	URL: /register/

	request

	data:

	{{ User.USERNAME_FIELD }}

	{{ User.REQUIRED_FIELDS }}

	password

	response

	status: HTTP_201_CREATED (success)

	data:

	{{ User.USERNAME_FIELD }}

	{{ User._meta.pk.name }}

	{{ User.REQUIRED_FIELDS }}

###Login

	Use this endpoint to obtain user authentication token. This endpoint is available only if you are using token based authentication.

##POST

	URL: /login/

	request

	data:

	{{ User.USERNAME_FIELD }}

	password

	response

	status: HTTP_200_OK (success)

	data:

	auth_token

###Logout

	Use this endpoint to logout user (remove user authentication token). This endpoint is available only if you are using token based authentication.

##POST

	URL: /logout/

	response

	status: HTTP_200_OK (success)
##Activate

	Use this endpoint to activate user account. This endpoint is not a URL which will be directly exposed to your users - you should provide site in your frontend application (configured by ACTIVATION_URL) which will send POST request to activate endpoint.

##POST

	URL: /activate/

	request

	data:

	uid

	token

	response

	status: HTTP_200_OK (success)
##Set username

	Use this endpoint to change user username (USERNAME_FIELD).

##POST

	URL: /{{ User.USERNAME_FIELD }}/

	request

	data:

	new_{{ User.USERNAME_FIELD }}

	re_new_{{ User.USERNAME_FIELD }} (if SET_USERNAME_RETYPE is True)

	current_password

	response

	status: HTTP_200_OK (success)

##Set password

	Use this endpoint to change user password.

##POST

	URL: /password/

	request

	data:

	new_password

	re_new_password (if SET_PASSWORD_RETYPE is True)

	current_password

	response

	status: HTTP_200_OK (success)
##Reset password

	Use this endpoint to send email to user with password reset link. You have to setup PASSWORD_RESET_CONFIRM_URL.

##POST

	URL: /password/reset/

	request

	data:

	email

	response

	status: HTTP_200_OK (success)
##Reset password confirmation

	Use this endpoint to finish reset password process. This endpoint is not a URL which will be directly exposed to your users - you should provide site in your frontend application (configured by PASSWORD_RESET_CONFIRM_URL) which will send POST request to reset password confirmation endpoint.

##POST

	URL: /password/reset/confirm/

	request

	data:

	uid

	token

	new_password

	re_new_password (if PASSWORD_RESET_CONFIRM_RETYPE is True)

	response

	status: HTTP_200_OK (success)


/*Profile*/
##Check auth status 
	URL: http//healthifyproject.com:8000/auth/detail/loginstatus/
	GET is allowed only
##get current user full details
	URL http//healthifyproject.com:8000/auth/detail/getcurruser/{{pk}}
	Only get is allowd
	response {
		"id": 10
		"email": "shubh.aggarwal.37@gmail.com"
		"username": "ShubhamAggarwal"
		"date_joined": "2016-03-24T10:48:00.888966Z"
		"last_login": null
		"social_thumb": "http://graph.facebook.com/1044865508890561/picture?type=normal"
		"created": all ques created by this user
		"voter": all ques already voted by this user


		}
