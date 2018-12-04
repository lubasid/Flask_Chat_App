from flask import Flask, render_template
from flask_socketio import SocketIO, send
from flask import Response
import socketio
import os
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager,login_user

import sqlite3

from flask_sqlalchemy import SQLAlchemy
from Database.user_model import User, Role, AdminView, AdminRole
from flask_admin import Admin

from flask_security import current_user

from flask_security import Security, SQLAlchemyUserDatastore, \
     login_required, utils


application = Flask(__name__)

# Config API KEY & Database Info
application.config['GOOGLEMAPS_KEY'] = 'AIzaSyBarPB5_h5E9UycxVRElfbr53uoGlvjotw'
application.config['SECRET_KEY'] = 'some-random-word'
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./Database/flask.db'
application.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
application.config['SECURITY_PASSWORD_SALT'] = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
application.config['SECURITY_REGISTERABLE'] = True
application.config['SECURITY_SEND_REGISTER_EMAIL'] = False

db = SQLAlchemy(application)
socket = SocketIO(application)


# Table which creates relationship between Users & Roles.
roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))



# Init SQL datastore
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
#Init Flask-Security
security = Security(application, user_datastore)

@application.route('/')
@login_required
def index():
   
    return render_template('index.html')


@socket.on('message')
def handleMessage(msg):
	send(msg, broadcast=True)


admin = Admin(application)

# Add Flask-Admin views for Users and Roles
admin.add_view(AdminView(User, db.session))
admin.add_view(AdminRole(Role, db.session))

if __name__ == '__main__':
	socket.run(application, host='0.0.0.0')
