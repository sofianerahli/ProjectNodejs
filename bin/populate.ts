import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/users'

const userA= new User('sofiane','sofiane.rahli@edu.ece.fr','1234')
const userB= new User('yvan','sofiane.rahli@edu.ece.fr','5678')
const userC= new User('kudinov','sergei.kudinov@adaltas.com','nodejs')

const metricA1 = new Metric(1,'sofiane','2017-12-12',65) 
const metricA2 = new Metric(2,'sofiane','2018-12-12',75) 

const metricB1 = new Metric(3,'yvan','2017-12-12',68) 
const metricB2 = new Metric(4,'yvan','2018-12-13',75) 

const metricC1 = new Metric(5,'kudinov','2016-12-12',69) 
const metricC2 = new Metric(6,'kudinov','2017-12-13',75) 

const db = new MetricsHandler('./db/metrics')
const dbUser = new UserHandler('./db/users')


dbUser.save(userA, (err: Error | null) => {
    if (err) throw err
    console.log('UserA populated')
})

dbUser.save(userB, (err: Error | null) => {
    if (err) throw err
    console.log('UserB populated')
})

dbUser.save(userC, (err: Error | null) => {
    if (err) throw err
    console.log('UserC populated')
})

//UserA
db.save(metricA1,(err: Error | null) => {
    if (err) throw err
    console.log('MetricA1 populated')
})

db.save(metricA2,(err: Error | null) => {
    if (err) throw err
    console.log('MetricA2 populated')
})

//UserB
db.save(metricB1,(err: Error | null) => {
    if (err) throw err
    console.log('MetricB1 populated')
})

db.save(metricB2,(err: Error | null) => {
    if (err) throw err
    console.log('MetricB2 populated')
})

//UserC
db.save(metricC1,(err: Error | null) => {
    if (err) throw err
    console.log('MetricC1 populated')
})

db.save(metricC2,(err: Error | null) => {
    if (err) throw err
    console.log('MetricC2 populated')
})
