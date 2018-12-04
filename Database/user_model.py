#!/usr/bin/env python

from flask_login import current_user
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import flask_admin.contrib.sqla as sqla
from wtforms.fields import PasswordField

from flask_security import UserMixin, RoleMixin, utils


application = Flask(__name__)

# Config API KEY & Database Info

application.config['SECRET_KEY'] = 'some-random-word'
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
application.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
application.config['SECURITY_PASSWORD_SALT'] = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
application.config['SECURITY_REGISTERABLE'] = True
db = SQLAlchemy(application)

# Table which creates relationship between Users & Roles.
roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))


# Class Role defines the role table in the database.
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80),nullable=False, unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name

    def __hash__(self):
        return hash(self.name)

# Class User defines the user table in the database.
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())


# Customized page view for users with Admin Account.
# Contains additional functionality for the admin-acct.

class AdminView(sqla.ModelView):

    column_exclude_list = ('password',)     # Prevent password from being displayed.
    form_excluded_columns = ('password',)   # Hide password field when creating user
    column_auto_select_related = True       # Show column names

    # Check if user has role of admin_acct
    def is_admin(self):
        return current_user.has_role('admin_acct')

    # Create form for user information.
    def scaffold_form(self):

        # Create standard form from Flask-Admin
        form_class = super(AdminView, self).scaffold_form()

        # Create password field
        form_class.password2 = PasswordField('New Password')
        return form_class

    # Commit changes made to users
    def on_model_change(self, form, model, is_created):

        # If the password field isn't blank...
        if len(model.password2):
            # Encrypt password
            model.password = utils.hash_password(model.password2)


# Customized Role model for SQL-Admin
class AdminRole(sqla.ModelView):
    # Access give only to admin users
    def is_admin(self):
        return current_user.has_role('admin_acct')
