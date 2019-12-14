import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/users'

/*
const met = [

  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),

  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),

  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)

]
*/


var date = new Date(Date.now())
const a= new User('sofiane','sofiane.rahli@edu.ece.fr','1234')
const b= new User('yvan','sofiane.rahli@edu.ece.fr','5678')
const c= new User('kudinov','sergei.kudinov@adaltas.com','nodejs')
const d = new Metric('sofiane','2019-11-04 14:30 UTC',22) 

const db = new MetricsHandler('./db/metrics')
const dbUser = new UserHandler('./db/users')


dbUser.save(a, (err: Error | null) => {
    if (err) throw err
    console.log('Data populated')
})

dbUser.save(b, (err: Error | null) => {
    if (err) throw err
    console.log('Data populated')
})

dbUser.save(c, (err: Error | null) => {
    if (err) throw err
    console.log('Data populated')
})

db.save(d,(err: Error | null) => {
    if (err) throw err
    console.log('okok')
})