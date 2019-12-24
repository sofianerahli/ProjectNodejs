import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'
import { Stream } from 'stream'

export class Metric {
  
  public id : number
  public username : string
  public date : string
  public weight : number

  constructor( id : number ,username : string ,date : string,weight : number ) {
    this.id = id
    this.username =username
    this.date = date
    this.weight = weight
  }
}

export class MetricsHandler {

  public db: any 
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
   
  public closeDB(){
    this.db.close();
  }

  public save( metrics: Metric, callback: (error: Error | null) => void) {  
     this.db.put(`id:${metrics.id}`,`${metrics.username},${metrics.date},${metrics.weight}`,(err: Error | null) => {
      callback(err)
    })
  }
  
  public getAll(username :string,  callback: (error: Error | null, result : Metric [] | null) => void) {
    let metrics : Metric[] = []
    let a=0
    let i=0
    this.db.createReadStream()
    .on('data', function (data) {
      const name = data.value.split(',')[0];
      const date=data.value.split(',')[1];
      const weight = data.value.split(',')[2];
      if(username === name ){
        let metric: Metric = new Metric(i,username,date,weight)
        metrics.push(metric)
        a=1
      }
      i++
    })
    
    .on('error', function (err) {
      console.log('Oh my!', err)
      callback(err,null)
    })
    .on('close', function () {
      console.log('Stream closed')
      
    })
    .on('end', function () {
      console.log('Stream ended')
      if(a===0){
        console.log("You don't have some metrics: Please add metrics")
      }
      callback(null,metrics)
    })

  }
  
  
  delete(key : string ) :Metric {
    let MetricFound= false
    let metrics : Metric[] = []
    let a=0
    let i=0
    this.db.createReadStream()
   
    .on('data', function (data) {
  
      const id = data.key.split(':')[1];
      const name = data.value.split(',')[0];
      const date=data.value.split(',')[1];
      const weight = data.value.split(',')[2];

      if(id == key ){
        a=1
        let metric: Metric = new Metric(id,name,date,weight)
        metrics.push(metric)
  
        i++;
      }
      
    })

    .on('end', function () {
      console.log('Stream ended')
    })
    return metrics[0];
  }
  

  public deleteOne(metrics: Metric,callback: (error: Error | null) => void) {  
    this.db.del(`id:${metrics.id}`,`${metrics.username},${metrics.date},${metrics.weight}`,(err: Error | null) => {
     callback(err)
   })
 }
}
