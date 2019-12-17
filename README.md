# Asynchronous Server Technologies project

[![Build Status](https://travis-ci.org/sofianerahli/ProjectNodejs.svg?branch=master)](https://travis-ci.org/sofianerahli/ProjectNodejs) 

## Introduction

The project is a simple Node.js web API on TypeScript, css and ejs with a dashboard that should allow to :

* API side 
  - CRUD users 
  - Authenticate
  - CRUD your own metrics (make use of an authorization middleware)
* Front side
  - Home page
  - Sign In / Sign Up / Sign Out
  - Insert/update/delete metrics once logged in
  - Retrieve the user’s metrics and display it in a graph
  - Only access the user’s metrics, not the other ones

## Installing

```bash
git clone https://github.com/sofianerahli/ProjectNodejs.git
npm install
```

## Populate

Pre-populate the database with at least two users and their own metrics.

```bash
npm run populate
```

## Test

Tests allow to test connection with leveldb, server and functions of the project.

```bash
npm run build
```

## Run the project

```bash
npm start
```
You can then access the server through port 8083. 
Server is running on http://localhost:8083

## Contributors

- RAHLI Sofiane 
- COMPAORE Yvan

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE.md file for details

