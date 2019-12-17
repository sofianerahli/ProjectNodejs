import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'
import { Stream } from 'stream'

export class Metric {
  public timestamp: string
  public value: number
  public username : string
  public date : string
  public weight : number

  constructor( username : string ,date : string,weight : number ) {
    this.timestamp = 'toto'
    this.value = 2
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
     this.db.put(`metric:${metrics.username}`,`${metrics.date},${metrics.weight}`,(err: Error | null) => {
      callback(err)
    })
  }
    

  public getAll(username :string,  callback: (error: Error | null, result : Metric [] | null) => void) {
    let metrics : Metric[] = []
    this.db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value)
      console.log(data.value.split(','))
     // console.log(data.key.split(':'))
      const date=data.value.split(',')[0];
      const weight = data.value.split(',')[1];
      console.log(date)
      console.log(weight)
      let metric: Metric = new Metric(username,date,weight)
      metrics.push(metric)
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
      callback(null,metrics)
    })
  }

  public getOne(key : string,callback: (error: Error | null, data: Metric  | null) => void) {
    let MetricFound= false
    this.db.createReadStream()
    .on('data', function (data) {
      if(key===data.key) {
        MetricFound= true
       // console.log(data.key, '=', data.value)
        //console.log(data.key.split(':'))
        //console.log(data.value.split(':'))
        const timestamp=data.key.split(':')[2]
        const value = data.value
        //callback(null,new Metric(timestamp, value))
      }
      
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
      callback(err,null)
    })
    .on('end', function () {
      if(!MetricFound) callback(Error("Metric doesn't exist"), null)
      console.log('Stream ended')
    })
  }

  public delete(key : string,callback: (error: Error | null, data) => void) {
    let MetricFound= false
    let metrics : Metric[] = []
    this.db.createReadStream()
    .on('data', function (data) {
      if(key===data.key) {
        MetricFound= true
        const timestamp=data.key.split(':')[2]
        const value = data.value
        //callback(null,new Metric(timestamp, value))
      }
    })
    
    .on('error', function (err) {
      console.log('Oh my!', err)
      callback(err,null)
    })
    .on('end', function () {
      if(!MetricFound) callback(Error("Metric doesn't exist"), null)
      console.log('Stream ended')
    })
    if(MetricFound){
      this.db.del(key)
    }


    
  }

  static get(callback: (error: Error | null, result?: Metric[]) => void) {
    const result = [
      //new Metric('2013-11-04 14:00 UTC', 12),
      //new Metric('2013-11-04 14:30 UTC', 15)
    ]
    callback(null, result)
  }
  

  
}