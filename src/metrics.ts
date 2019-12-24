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
  //`id:${metrics.id}`
    

  public getAll(username :string,  callback: (error: Error | null, result : Metric [] | null) => void) {
    let metrics : Metric[] = []
    let a=0
    let i=0
    this.db.createReadStream()
    .on('data', function (data) {
      
      console.log(data.key, '=', data.value)
      console.log(data.value.split(','))
     // console.log(data.key.split(':'))
     const name = data.value.split(',')[0];
      const date=data.value.split(',')[1];
      const weight = data.value.split(',')[2];
      console.log(date)
      console.log(weight)
      if(username === name ){
      console.log('trouve')
      let metric: Metric = new Metric(i,username,date,weight)
      metrics.push(metric)
    a=1}
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
  
  
  delete(key : number ) :Metric {
    let MetricFound= false
    let metrics : Metric[] = []
    let a=0
    let i=0
    this.db.createReadStream()
   
    .on('data', function (data) {
      
      console.log(data.key, '=', data.value)
      console.log(data.value.split(','))
     // console.log(data.key.split(':'))
     const id = data.key.split(':')[1];
     const name = data.value.split(',')[0];
      const date=data.value.split(',')[1];
      const weight = data.value.split(',')[2];
      console.log(id)
      console.log(key)

      if(id == key ){
      console.log('la')
      a=1
      let metric: Metric = new Metric(id,name,date,weight)
      metrics.push(metric)
      console.log(metrics[0].id)
      
    
     i++;
    }
      
    })

    .on('end', function () {
      
      console.log('Stream ended')
      console.log(metrics[0].id)
      
      
      
    })

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
    
  
  }
  

  public deleteOne(metrics: Metric,callback: (error: Error | null) => void) {  
    this.db.del(`id:${metrics.id}`,`${metrics.username},${metrics.date},${metrics.weight}`,(err: Error | null) => {
     callback(err)
   })
 }

  static get(callback: (error: Error | null, result?: Metric[]) => void) {
    const result = [
      //new Metric('2013-11-04 14:00 UTC', 12),
      //new Metric('2013-11-04 14:30 UTC', 15)
    ]
    callback(null, result)
  }

  

  
}
