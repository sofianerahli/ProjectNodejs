
var chai = require('chai');
var assert = require('assert');
import 'mocha'

import { Metric, MetricsHandler } from '../src/metrics'
import { LevelDB } from '../src/leveldb'

const dbPath: string = 'db_test'
var dbMet: MetricsHandler = new MetricsHandler('./db/metricstest')



describe('Basic Tests to test mocha', function() {
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
        dbMet = new MetricsHandler(dbPath)
    })

    after(function () {
    dbMet.db.close()
    })
  })
})

describe('Metric', function() {

  //Save a metric
  it('should save a metric without error', function(done){
    var metric1= new Metric(10,'sofiane','2019-12-12',78); 
    dbMet.save(metric1,done);
  });

  //Get all metrics of an user
  it('should get all metrics with a username without error', function(done){
    dbMet.getAll('sofiane',done);
  });

  //Uptade metric of an user
  it('should uptade a metric without error', function(done){
    var metric1= new Metric(10,'sofiane','2016-12-12',68);
    dbMet.save(metric1,done);
  });

})

