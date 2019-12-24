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
    MetricsHandler.prototype.getAll = function (username, callback) {
        var metrics = [];
        var a = 0;
        var i = 0;
        this.db.createReadStream()
            .on('data', function (data) {
            var name = data.value.split(',')[0];
            var date = data.value.split(',')[1];
            var weight = data.value.split(',')[2];
            if (username === name) {
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
    MetricsHandler.prototype.delete = function (key) {
        var MetricFound = false;
        var metrics = [];
        var a = 0;
        var i = 0;
        this.db.createReadStream()
            .on('data', function (data) {
            var id = data.key.split(':')[1];
            var name = data.value.split(',')[0];
            var date = data.value.split(',')[1];
            var weight = data.value.split(',')[2];
            if (id == key) {
                a = 1;
                var metric = new Metric(id, name, date, weight);
                metrics.push(metric);
                i++;
            }
        })
            .on('end', function () {
            console.log('Stream ended');
        });
        return metrics[0];
    };
    MetricsHandler.prototype.deleteOne = function (metrics, callback) {
        this.db.del("id:" + metrics.id, metrics.username + "," + metrics.date + "," + metrics.weight, function (err) {
            callback(err);
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
