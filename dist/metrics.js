"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var Metric = /** @class */ (function () {
    function Metric(username, date, weight) {
        this.timestamp = 'toto';
        this.value = 2;
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
        this.db.put("metric:" + metrics.username, metrics.date + "," + metrics.weight, function (err) {
            callback(err);
        });
    };
    MetricsHandler.prototype.getAll = function (username, callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            console.log(data.key, '=', data.value);
            console.log(data.value.split(','));
            // console.log(data.key.split(':'))
            var date = data.value.split(',')[0];
            var weight = data.value.split(',')[1];
            console.log(date);
            console.log(weight);
            var metric = new Metric(username, date, weight);
            metrics.push(metric);
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
    MetricsHandler.prototype.delete = function (key, callback) {
        var MetricFound = false;
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            if (key === data.key) {
                MetricFound = true;
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
        if (MetricFound) {
            this.db.del(key);
        }
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
