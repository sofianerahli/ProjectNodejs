
var chai = require('chai');
var assert = require('assert');
import 'mocha'

import 'mocha'
import { Metric, MetricsHandler } from '../src/metrics'
import { LevelDB } from '../src/leveldb'


const expect= chai.expect

const dbPath: string = 'db_test'
var dbUser: MetricsHandler = new MetricsHandler('./db/metricstest')
// var server = require('../src/server');



describe('Basic Tests to test mocha and chai', function() {
  it('Test 1', function() {
    assert.ok(true,"Ok")
  })
  it('Test 2', function() {
    assert.ok(1===1,"Ok")
  })
});


describe('Test Leveldb Metrics', function () {
    it('Good connection to the leveldb : metrics', function(){
        before(function () {
            LevelDB.clear(dbPath)
            dbUser = new MetricsHandler(dbPath)
        })

        after(function () {
        dbUser.db.close()
        })
    })
})
/*
it('should return true if valid user id', function(){
  var a= new User('testusername','testemail','testpassword'); 
  var isValid= a.getPassword()
  assert.equal(isValid,'testpassword');
});

describe('Serveur', function() {
    it('should return response signup GET', function() {
        return chai.request().get('/signup')
            .then(res => {
              chai.expect(res.text).to.eql("problem")
                
            });
    });
})
*/


/*
describe('User', function() {
    describe('#get()', function() {
      it('should save an user without error', function() {
        var a= new User('testusername','testemail','testpassword');
        console.log(a)
        assert.ok(dbUser.get('user:kudinov',function(err) {
            if (err) throw(err);
          }),"Ok")
    });
  });
})*/

/*
describe('#get', function () {
    it('should get empty array on non existing group', function () {
      dbMet.getOne("0", function (err: Error | null, result?: User[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })
*/