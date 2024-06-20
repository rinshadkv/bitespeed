# Bitespeed Backend Application
This repository contains the backend application for Bitespeed, an identity reconciliation service using Node.js, Express.js, Sequelize, and TypeScript. 
The application manages customer contacts and identifies them based on email and phone number information.

## Features
#### Identity Reconciliation: 
Automatically identifies and consolidates customer contacts based on common email or phone number.
### Primary and Secondary Contacts:
Manages primary and secondary contact relationships in the database.
### RESTful API: 
Provides an API endpoint (/api/identify) to receive HTTP POST requests for contact identification.
## Technologies Used
* Node.js
* Express.js
* Sequelize
* TypeScript
* PostgreSQL 

## Installation
### Prerequisites
* Node.js (v14.x or higher)
* npm (or yarn)
* PostgreSQL database

### Clone the repository:

```
git clone https://github.com/rinshadkv/bitespeed.git
cd bitespeed-backend
```
### Install dependencies:

```
npm install
```
### Configuration
* Set up your PostgreSQL database.
* Update src/config/database.ts with your database credentials and configuration.
* Ensure your database is running.

### Running the Application
#### Development Mode
To run the application in development mode with automatic restarts (using ts-node-dev):

```
npm run dev 
```
The server will start at http://localhost:3000.

#### Production Mode
To build and run the application in production mode:

Build the TypeScript files:

```
npm run build
```
#### Start the application:

```
npm start
```
### Usage
* Use Postman or curl to send POST requests to http://localhost:3000/api/identify with JSON body containing email or phoneNumber to identify contacts.

### API Endpoints
POST /api/identify: Identifies and consolidates customer contacts based on provided email or phone number.


