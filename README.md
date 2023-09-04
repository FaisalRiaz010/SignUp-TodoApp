# SignUp-Todo App

This is a NestJS project that allows users to sign up, login,using 2FA more secure app, create todos, and view their todos and reciving email alerts for pending todos.

## Features

* User registration and verification
* Login with username and password, or 2FA using google authenticator
* Forgot password and password reset
* Set token expiration for forget and reset password
* Todo creation, completion,deletion,updation and viewing pending and completed todos.
* Adding todos in queue
* Automatic email notification for pending todos
* Keyset Pagination

## Getting Started

1. Install the dependencies:

npm install
npm install typeorm --save (for typeorm)
npm i speakeasy (library for the 2FA )
import * as qrcode from 'qrcode'; for generating qr code.




2. Start the development server:

npm run start

The application will be available at http://localhost5000.

Usage
To sign up, visit the (http://localhost:5000/api#/users/UsersController_registerUser) endpoint. You will need to provide a username, email address, and password.
To verify user account verification put tken here after opening email link.(http://localhost:5000/api#/users/UsersController_verifyUser)

To login, visit the (http://localhost:5000/api#/users/UsersController_getUserByCriteria) endpoint. You will need to provide your username and password.

To create a todo, visit the (http://localhost:5000/api#/todos/TodosController_createTodo) endpoint. You will need to provide a userid title and description for the todo.

To complete a todo, visit the (http://localhost:5000/api#/todos/TodosController_markTodoAsCompleted) endpoint, where :id is the ID of the todo.

To delete a todo, visit the (http://localhost:5000/api#/todos/TodosController_RemoveTodo) endpoint, where :id is the ID of the todo.

To view all of your todos, visit the (http://localhost:5000/api#/todos/TodosController_getallTodosByUser)s endpoint.

To view all of your pending todos, visit the (http://localhost:5000/api#/todos/TodosController_getallPendTodosByUser) endpoint.

To view all of your completed todos, visit the (http://localhost:5000/api#/todos/TodosController_completedTodosByUser) endpoint.

To update todo visit (http://localhost:5000/api#/todos/TodosController_updateTodo) endpoint.

To adding todo in queue than to store in db visit (http://localhost:5000/api#/todos/TodosController_insertTodo) endpoint.

Checking cron job and sending alert emails confirmation visit (http://localhost:5000/api#/todos/TodosController_sendScheduledEmailsManually)endpoint.

Applying keyset limit visit the (http://localhost:5000/api#/todos/TodosController_findTodosWithOffset) endpoint.

Deployment
The application can be deployed to any Node.js hosting platform.

License
This project is licensed under the MIT License.

Thanks for visiting my project.

I hope this helps!
