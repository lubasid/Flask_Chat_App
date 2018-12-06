# Flask_Chat_App
#### Chat Application using Flask, SocketIO, and SqlAlchemy. Uses python for the server and Javascript for the client side.
#### This application demonstrates a method of message transfer over sockets with a simple function for encryption.

Contents of Directory:

	/Databases/
		flask.db
		user_model.py

	/templates/
		/security/
			login_user.html
			register_user.html
		index.html

	.gitignore
	application.py
	License
	README.md
	requirements.txt


### Requirements:
	Python 3


### Basic setup: (without using a virtual enviroment):

	pip install -r requirements.txt
	python application.py



### Setup with virtual enviroment (virtualenv):

	pip install virtualenv			(install virtualenv package)
	virtualenv -p C:/Python36/python virt 	(set location of python3)
	source virt/Scripts/activate		(activate virtual env)

	pip install -r requirements.txt 	(install file)
	python application.py 			(start app)
