"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metrics_1 = require("../src/metrics");
var users_1 = require("../src/users");
/*
const met = [

  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),

  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),

  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)

]
*/
var a = new users_1.User('sofiane', 'sofiane.rahli@edu.ece.fr', '1234');
var b = new users_1.User('yvan', 'sofiane.rahli@edu.ece.fr', '5678');
var c = new users_1.User('kudinov', 'sergei.kudinov@adaltas.com', 'nodejs');
var db = new metrics_1.MetricsHandler('./db/metrics');
var dbUser = new users_1.UserHandler('./db/users');
dbUser.save(a, function (err) {
    if (err)
        throw err;
    console.log('Data populated');
});
dbUser.save(b, function (err) {
    if (err)
        throw err;
    console.log('Data populated');
});
dbUser.save(c, function (err) {
    if (err)
        throw err;
    console.log('Data populated');
});
