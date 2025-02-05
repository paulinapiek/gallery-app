# Gallery App

## Navigation

- [Description](#description)
- [Features](#features)
- [Condition](#condition)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Usage](#usage)
- [Technologies](#technologies)

## Description

We will build a **Social Media App** to post pictures. Learn Firebase Authentication, Firestore CRUD, Firestore Rules, Firebase Image Upload, Firebase Deployment, and Hosting.

## Features

- **User Authentication:** Secure login and registration functionalities.
- **Photo Posting:** Users can upload and share pictures.
- **CRUD Operations:** Create, Read, Update, and Delete functionalities for posts using Firestore.
- **User Profiles:** Create, view, and edit user profiles. -**Security Rules:** Implement Firestore Rules to ensure data security and integrity.
- **Image Upload:** Efficient image upload handling with Firebase Storage.
- **Deployment & Hosting: -** Deploy and host the application on Firebase Hosting for seamless access.
- **Styled Components:** For a design
- **Real-time Data Updates:** Live data synchronization for up-to-date information display.

## Condition

Before you begin, ensure you have met the following requirements:

- **Node.js:** Version **>= 20.x**
- **npm:** Version **>= 9.x**

You can check your installed versions by running:

```bash
node -v
npm -v

If you don't have Node.js and npm installed - download them from the official Node.js website.

Installation
Follow these steps to set up the project locally:
       Clone the Repository:
git clone https://github.com/paulinapiek/gallery-app.git


Navigate to the Project Directory:

cd gallery-app

Create .env file with needed data.
VITE_APIKEY=your_api_key
VITE_AUTHDOMAIN=your_auth_domain
VITE_PROJECTID=your_project_id
VITE_STORAGEBUCKET=your_storage_bucket
VITE_MESSAGESENDERID=your_messaging_sender_id
VITE_APPID=your_app_id

Example:
VITE_APIKEY=AIzaSyD-KEY12345
VITE_AUTHDOMAIN=gallery-app.firebaseapp.com
VITE_PROJECTID=gallery-app
VITE_STORAGEBUCKET=gallery-app.appspot.com
VITE_MESSAGESENDERID=1234567890
VITE_APPID=1:1234567890:web:abcdef123456


Ensure .env is Ignored by Git:

To prevent your sensitive configuration from being pushed to GitHub, ensure that .env is listed in your .gitignore file. If it's not already there, add the following line to .gitignore:

# Environment variables
.env

Ensure you have the necessary Firebase packages installed:

npm install firebase


API References:
https://firebase.google.com/docs/reference

Install Dependencies:
Using npm:
npm install
This command installs all the necessary packages listed in the package.json file.

Running the App

To start the application in development mode, follow these steps:
    1. Ensure You're in the Project Directory:

cd gallery-app
Start the Development Server:

npm run dev

 Access the Application:
Open your browser and navigate to http://localhost:3000/ to view the running application.
Note: If port 3000 is already in use, you can specify a different port by setting the PORT environment variable:

PORT=4000 npm run dev
For Windows:
set PORT=4000 && npm run dev

Usage
Signup and create new user with email and password.
Login .
Add new photo to database. Delete some if not needed anymore.

Technologies
The project is built using the following technologies:
React, Typescript, Firebase Authentication, Firestore Database
and using StyledComponents styles