"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
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
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end();
    };
    MetricsHandler.prototype.getAll = function (callback) {
        var metrics = [];
        this.db.createReadStream()
            .on('data', function (data) {
            console.log(data.key, '=', data.value);
            console.log(data.key.split(':'));
            var timestamp = data.key.split(':')[2];
            var metric = new Metric(timestamp, data.value);
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
                console.log(data.key, '=', data.value);
                console.log(data.key.split(':'));
                var timestamp = data.key.split(':')[2];
                var value = data.value;
                callback(null, new Metric(timestamp, value));
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
                callback(null, new Metric(timestamp, value));
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
            new Metric('2013-11-04 14:00 UTC', 12),
            new Metric('2013-11-04 14:30 UTC', 15)
        ];
        callback(null, result);
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
