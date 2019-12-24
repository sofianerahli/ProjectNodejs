# Asynchronous Server Technologies project

[![Build Status](https://travis-ci.org/sofianerahli/ProjectNodejs.svg?branch=master)](https://travis-ci.org/sofianerahli/ProjectNodejs) 
[![Coverage Status](https://coveralls.io/repos/github/sofianerahli/ProjectNodejs/badge.svg?branch=master)](https://coveralls.io/github/sofianerahli/ProjectNodejs?branch=master)

## Introduction

The project is a Node.js web API on TypeScript, css and ejs with a dashboard that should allow to :

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

Pre-populate the database with three users and their own metrics.

```bash
npm run populate
```

## Test (Devops) 

Tests allow to test connection with leveldb, server and functions of the project with mocha and chai.

```bash
npm run test
```

## Run the project

```bash
npm start
```

## Summary

```bash
git clone https://github.com/sofianerahli/ProjectNodejs.git
npm install
npm run populate
npm run test
npm run build
npm start
```
You can then access the server through port 8083. 
Server is running on http://localhost:8083

## Contributors

- RAHLI Sofiane 
- COMPAORE Yvan

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE.md file for details

## Difficulties

* We had problems with rights. Indeed, when we was making a "pull" of the project, we had an access problem on the project. 
we solved this problem with director's rights.

* We used the leveldb storage for the first time. So, it was necessary to took time to adapt.

* We had problems with Travis CI. Indeed, the markdown remained gray with an error while all the tests passed. 
There was a version problem in the .travis.yml file configuration. We solved this problem.

## Devops 

* Folder test with unit tests.

* Contributors.js file with the list of project's contributors.

* Markdown Travis CI with .travis.yml file and continuous testing.

* License.md file with the GNU General Public License v3.0.

* Markdown Travis CI with .travis.yml file.









