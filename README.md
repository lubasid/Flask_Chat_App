# Flask_Chat_App

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


Requirements:
	Python 3


Basic setup: (without using virtual enviroment)

	pip install -r requirements.txt
	python application.py



Setup with virtual virtualenv:

	pip install virtualenv					(install virtualenv package)
	virtualenv -p C:/Python36/python virt 	(set location of python3)
	source virt/Scripts/activate			(activate virtual env)

	pip install -r requirements.txt 		(install file)
	python application.py 					(start app)