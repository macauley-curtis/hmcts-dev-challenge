# HMCTS Task management

## Pre-requiments

To run this project you must install [Postgres](https://www.postgresql.org/download/) for database management
and [Node.js](https://nodejs.org/en/download).

## Notes on build process

This project uses react for most of the frontend and was built in VSCode.
The ESlint, PostfreSQL and Prettier extensions were used for quality of life
during production.

The testing uses vitest as a framework.

Github workflows are set up for testing and linting on PR creation to branches
`main` or `dev`.
Copilot review has been used on major pull requests. 

# Getting started

## Clone this repo

Use the HTTPS to [clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this repository.

## Set up a database (db)

Use [Postgres](https://www.postgresql.org/docs/current/sql-createdatabase.html)
to set up the databases. This requires the table `tasks`. Please user the
SQL scripts found in `/backend/migrations` for
creation of the specific tables and the type constraints. Read `\backend\migrations\README.md` for the instructions.

## Install packages

Use `npm install` to install all required packages.

## Run tests

To ensure nothing has gone obvisouly wrong, please run `npm test` which will
run the front and backend tests.

## Run application

Use `npm run dev` to setup the backend server and run the node app.
Visit [http://localhost:5173](http://localhost:5173) in browser.

# Application use

This application uses the Form to create tasks in the main bar with fields:

- task name
- task description
- task type
- task status
- due date

Once done via either filling out the text box or using the drop-down of
approved values, the `create task` button posts the taks to the backend db and
the frontend fetch's this and displays it in the task list.

Once in the task list the tasks' fields can be updated.
There is minor data validation on entries for the drop down options and the
due date.

Finally a task may be delated by use of the `del` button.
