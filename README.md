# Interactive_music-playing_zone
## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Bug Solving Records](#bug-solving-records)

## Introduction
This project is a task management application where you can create, view your todos and update their status as time goes by. 
- The "create task" button is disabled before all the fields are filled.
- Diverse colors are applied at task counters and task borders to manifest different status and priorities of tasks
- At the bottom of each listed task, there are a switch and a button to update task status to in progress and completed respectively
  
- And the change of creating and updating will be simultaneously synchronized in the task counters and list, which is achieved by React Context hook, allowing values to be passed into different layers of nested components, with no need to pass them layer by layer, working like a global variable.
- Express Validator was utilized to ensure the submitted request data conforms to expected formats and content, thereby improving the application's security and reliability.
### Technical Structure
Django + Django Rest Framework + ReactJS
### Player Interface Display
<img width="1002" alt="截屏2024-07-13 00 28 14" src="https://github.com/user-attachments/assets/65cd7009-0510-4a42-8d91-7661a3680215">





## Getting Started
### Clone
```bash
git clone https://github.com/SiMinus/todo-ts.git
```

### Setting up for todo-api(back end)
```bash
cd todo-api
npm install
```
Make sure you have a MYSQL server set and running on your machine, in which you will create a database called todo

Configure .env file
```bash
PORT=<port number to be listened>
MYSQL_USER=root
MYSQL_PASSWORD=<your password>
MYSQL_DB=todo

```
Since the Entity was already created, the table will be automatically created due to the features of TypeORM after running:
```bash
npm run dev
```
### Setting up for todo-front(front end)
```bash
cd todo-front
npm install
```
Compiled successfully!

You can now view todo-app in the browser.
### All set! Now you can go and create your first todo!
## Bug Solving Records
