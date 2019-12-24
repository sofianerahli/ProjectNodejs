
import 'mocha'
import express = require('express')
import { LevelDB } from '../src/leveldb'
import { User, UserHandler } from '../src/users'

// const app = express()
var chai = require('chai');
var assert = require('assert');
const expect= chai.expect
const port: string = process.env.PORT || '8083'

const dbPath: string = 'db_test'
var dbUser: UserHandler = new UserHandler('./db/usertest')
import server from '../src/server'

var assert = require('assert'),
    http = require('http');

describe('Server', function () {
  it('should return 200', function (done) {
    http.get('http://localhost:' + port, function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  after(() => {
      server.close()
  })
})
  
//Leveldb Users
describe('Test Leveldb Users', function () {
    it('Good connection to the leveldb: users', function(){
        before(function () {
            LevelDB.clear(dbPath)
            dbUser = new UserHandler(dbPath)
        })

        after(function () {
            dbUser.db.close()
        })
    })
})

describe('User', function() {

    //get a password
    it('should return the good password: test the function getPassword()', function(){
        var a= new User('testusername','testemail','testpassword'); 
        var isValid= a.getPassword()
        assert.equal(isValid,'testpassword');
    });
    
    //Validate a password
    it('should return true if valid password: test the function validatePassword()', function(){
        var a= new User('testusername','testemail','testpassword'); 
        var isValid= a.validatePassword('testpassword')
        assert.equal(isValid,true);
    });

    //Save an user
    it('should save an user without error', function(done){
        var user1= new User('gregorjouet','gregor@adaltas.com','devops'); 
        dbUser.save(user1,done);
    });

    //Get an user
    it('should get an user with his username without error', function(done){
        dbUser.get('gregorjouet',done);
    });

    //Delete an user
    it('should delete an user with his username without error', function(done){ 
        dbUser.delete('gregorjouet',done);
        
    });
})

/*
describe('User', function() {
    describe('#get()', function() {
      it('should save an user without error', function() {
        var a= new User('testusername','testemail','testpassword');
        var ok= a.get()
        assert.ok(dbUser.get('user:kudinov',function(err) {
            if (err) throw(err);
          }),"Ok")
    });
  });
})*/

