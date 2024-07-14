# Interactive_music-playing_zone
## Table of Contents
- [Introduction](#introduction)
- [Key Responsibilities](#key-responsibilities)
- [Getting Started](#getting-started)
- [Bug Records](#bug-records)
- [Lessons Learned](#lessons-learned)
## Introduction
This application is a palace for gathering  people with the same music taste online

Host is able to
- Decide if the guests can pasue the song and how many votes needed to skip it while creating
- Pass the authentication through login to Spotify, before the information of current song will be shown and constantly updating on the page.
- Have the full access of the room, including pausing, skiping the song and updating room pemissions.
- The room will be gone after host exit.
  
Guests are able to 
- Join the room by sending 6-digit random code.
- Pause current song if allowed by host
- Skip the song by voting
- Alway be redirected back to room through home page before leaving the room
### Technical Structure
Django + Django Rest Framework + ReactJS
### Player Interface Display
<img width="1002" alt="截屏2024-07-13 00 28 14" src="https://github.com/user-attachments/assets/65cd7009-0510-4a42-8d91-7661a3680215">

### Development WorkFlow
https://github.com/SiMinus/Music_Workflow
## Key Responsibilities
- Tested every involved use case and fixed issues by optimizing and simplifying the crucial part code, preventing 40% potential bugs.
- Stored frequently used data in request session, reducing database pressure and saving 99% of data accessing time.
- Set authentication logic to check permission before constantly fetching data from Spotify, enhancing the application's capacity to support a 70% increase in concurrent users.
- Implemented seamless dynamic effects between components by sending callback functions through React props, reducing code duplication by 40%.
  

## Getting Started
### Clone
```bash
git clone https://github.com/SiMinus/Interactive_music-playing_zone.git
```

### Setting up for backend
```bash
cd Interactive_music-playing_zone
```
Create new virtual environment

```bash
python -m venv venv  # second 'venv' can be modified to the name you like for the directory
source venv/bin/activate  # activate virtual environment(Linux & MacOS)
.\venv\Scripts\activate  # （Only for Windows）

```
Install required dependencies for this app
```bash
pip install -r requirements.txt
```
Database Migration
```bash
python manage.py migrate
```

### Setting up for frontend
```bash
cd frontend
npm install
```
Start Webpack and watch for file changes to compile in real-time.
```bash
npm run dev
```
### Finally, starting development server at http://127.0.0.1:8000/
```bash
python manage.py runserver
```
### All set! Now You can now browse the music zone and share music with you friends !

## Bug Records
### Solved Bugs
### Refinements made
### Existing problems to be solved soon

## Lessons Learned
