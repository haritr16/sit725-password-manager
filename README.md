# SIT725 Password Manager

A password management application built with Node.js, Express, and MongoDB, providing secure storage and retrieval of user credentials.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Authors](#authors)

## Overview

The SIT725 Password Manager is a web application that allows users to securely store, manage, and retrieve their passwords. It uses AES-256 encryption to ensure that passwords are stored securely in the database.

## Features

- User registration and login
- Secure password storage with AES-256 encryption
- CRUD operations for password records
- Input validation and error handling
- Unit and integration tests

## Prerequisites

- Node.js (v12.x or later)
- npm (v6.x or later)
- MongoDB (local or MongoDB Atlas)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/haritr16/sit725-password-manager.git
   cd sit725-password-manager
2. **Install Dependencies**:
  
   ```bash
   npm install

## Configuration

1. Database Configuration
    Update the config/db.js file with your MongoDB connection string:
    ```javascript
    export default {
    url: 'your-mongodb-connection-string'
    };

2.Environment Variables:
    Ensure you have the following environment variables set (you can use a .env file):
    
    PORT = 3000 

## Running The Application

1. Start the server:
    ````bash
    npm start
The application will be running at http://localhost:3000.

## Testing
1. Run Unit and Integration Tests:
   ````bash
   npm test

## AUTHORS
- Raj Gariwala
- Vivek Olladapu
- Hariharan Ramesh
- Purvasha Padhy
- Yash Maheta
