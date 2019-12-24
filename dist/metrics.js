"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var Metric = /** @class */ (function () {
    function Metric(id, username, date, weight) {
        this.id = id;
        this.username = username;
        this.date = date;
        this.weight = weight;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.closeDB = function () {
        this.db.close();
    };
    MetricsHandler.prototype.save = function (metrics, callback) {
        this.db.put("id:" + metrics.id, metrics.username + "," + metrics.date + "," + metrics.weight, function (err) {
            callback(err);
        });
    };
    //`id:${metrics.id}`
    MetricsHandler.prototype.getAll = function (username, callback) {
        var metrics = [];
        var a = 0;
        var i = 0;
        this.db.createReadStream()
            .on('data', function (data) {
            console.log(data.key, '=', data.value);
            console.log(data.value.split(','));
            // console.log(data.key.split(':'))
            var name = data.value.split(',')[0];
            var date = data.value.split(',')[1];
            var weight = data.value.split(',')[2];
            console.log(date);
            console.log(weight);
            if (username === name) {
                console.log('trouve');
                var metric = new Metric(i, username, date, weight);
                metrics.push(metric);
                a = 1;
            }
            i++;
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        })
            .on('close', function () {
            console.log('Stream closed');
        })
            .on('end', function () {
            console.log('Stream ended');
            if (a === 0) {
                console.log("You don't have some metrics: Please add metrics");
            }
            callback(null, metrics);
        });
    };
    MetricsHandler.prototype.getOne = function (key, callback) {
        var MetricFound = false;
        this.db.createReadStream()
            .on('data', function (data) {
            if (key === data.key) {
                MetricFound = true;
                // console.log(data.key, '=', data.value)
                //console.log(data.key.split(':'))
                //console.log(data.value.split(':'))
                var timestamp = data.key.split(':')[2];
                var value = data.value;
                //callback(null,new Metric(timestamp, value))
            }
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        })
            .on('end', function () {
            if (!MetricFound)
                callback(Error("Metric doesn't exist"), null);
            console.log('Stream ended');
        });
    };
    MetricsHandler.prototype.delete = function (key) {
        var MetricFound = false;
        var metrics = [];
        var a = 0;
        var i = 0;
        this.db.createReadStream()
            .on('data', function (data) {
            console.log(data.key, '=', data.value);
            console.log(data.value.split(','));
            // console.log(data.key.split(':'))
            var id = data.key.split(':')[1];
            var name = data.value.split(',')[0];
            var date = data.value.split(',')[1];
            var weight = data.value.split(',')[2];
            console.log(id);
            console.log(key);
            if (id == key) {
                console.log('la');
                a = 1;
                var metric = new Metric(id, name, date, weight);
                metrics.push(metric);
                console.log(metrics[0].id);
                i++;
            }
        })
            .on('end', function () {
            console.log('Stream ended');
            console.log(metrics[0].id);
        });
        return metrics[0];
        /*
        this.deleteOne(metrics[0],(err: Error | null) => {
          if (err) throw err
          console.log('oups')
      })*/
        /*
        console.log('deletion zone')
    
        if(a===1)
        {
          
        this.db
      }
        */
    };
    MetricsHandler.prototype.deleteOne = function (metrics, callback) {
        this.db.del("id:" + metrics.id, metrics.username + "," + metrics.date + "," + metrics.weight, function (err) {
            callback(err);
        });
    };
    MetricsHandler.get = function (callback) {
        var result = [
        //new Metric('2013-11-04 14:00 UTC', 12),
        //new Metric('2013-11-04 14:30 UTC', 15)
        ];
        callback(null, result);
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
