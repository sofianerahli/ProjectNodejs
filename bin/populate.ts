import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/users'

/*
const met = [

  new Metric(${new Date('2019-11-04 14:00 UTC').getTime()}, 12),

  new Metric(${new Date('2019-11-04 14:15 UTC').getTime()}, 10),

  new Metric(${new Date('2019-11-04 14:30 UTC').getTime()}, 

]
*/



const a= new User('sofiane','sofiane.rahli@edu.ece.fr','1234')
const b= new User('yvan','sofiane.rahli@edu.ece.fr','5678')
const c= new User('kudinov','sergei.kudinov@adaltas.com','nodejs')

const d = new Metric(1,'yvan','2012-12-12 14:30',2) 
const e = new Metric(2,'sofiane','2012-12-13 11:00',6) 


const db = new MetricsHandler('./db/metrics')
const dbUser = new UserHandler('./db/users')

/*
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


db.save(e,(err: Error | null) => {
    if (err) throw err
    console.log('okok')
})*/

db.getAll('sofiane',(err: Error | null) => {
    if (err) throw err
    console.log('oups')
})


/*
db.delete(1,(err: Error | null) => {
    if (err) throw err
    console.log('oups')
})*/

/*
db.getAll('yvan',(err: Error | null) => {
    if (err) throw err
    console.log('oups')
})*/