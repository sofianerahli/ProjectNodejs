import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')

const app = express()
const port: string = process.env.PORT || '8083'
const authRouter = express.Router()
app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
/*SeSSION*/
const LevelStore = levelSession(session)

app.get('/', (req: any, res: any) => {
  res.render('home')
})

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

/*Metrics*/ 

//Metrics Page 


authRouter.get('userpage/metrics', (req: any, res: any) => {
  dbMet.getAll(req.session.username,(err: Error | null, result: any) => {
    if (err) throw err
    res.json(result)
  })
})

authRouter.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json({result})
  })
})

app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.getAll(req.session.username, (err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})

app.post('/addmetrics', (req: any, res: any, next:any) => {
  let a = Math.floor(Math.random() * 3000) + 1 ;
  let metric: Metric= new Metric(a,req.session.username,req.body.form_date,req.body.form_weight)
  
      dbMet.save(metric, (err: Error | null) => {
        if (err) next(err)
        console.log('Metrics added')
        
      })
   
})

/*
app.delete('/metrics/:id', (req: any, res: any) => {
  const key=req.params.id
  dbMet.delete(key,(err: Error | null, data: Metric) => {
    if (err) {
      if(err.message==="Metric doesn't exist"){
        res.sendStatus(400);
        return;
      }
      throw err;
    };
    res.status(200).json({data})
  })
})
*/


/****  USER  ****/ 

import { UserHandler, User } from './users'
const dbUser: UserHandler = new UserHandler('./db/users')


//Login page
/*authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})*/

//Inscription page
authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

//Logout
authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.username
  res.redirect('/')
})

//User Page
authRouter.get('/userpage', (req: any, res: any) => {
  res.render('userpage')
})

authRouter.post('/signup', (req: any, res: any, next:any) => {
  let user: User= new User(req.body.username,req.body.email,req.body.password)
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      console.log('user already exists')
      res.redirect('/signup')
    } else {
      dbUser.save(user, (err: Error | null) => {
        if (err) next(err)
        console.log('Inscription successful')
        req.session.loggedIn = true
        req.session.username = req.body.username
        res.redirect('/userpage')
      })
    }
  })
  
})

//save infos of a user for login
authRouter.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
      if (err) next(err)
      if (result !== undefined) { 
        if(!result.validatePassword(req.body.password)){
          console.log('Password false')
          res.redirect('/login')
        }
        else {
          console.log('Connexion successful')
          req.session.loggedIn = true
          req.session.username = req.body.username
          res.redirect('/userpage')
        }
    } else {
        console.log('Username invalid')
        res.redirect('/login')
      }
    })
})

// Session
authRouter.get('/login',function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    console.log('Welcome '+ req.session.username)
    res.redirect('/userpage')
  } else{
    console.log('Session not found')
    res.render('login')
  }
})

/*
const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}
authRouter.get('/', authCheck, (req: any, res: any) => {
  res.render('home', { name: req.session.username })
})
*/

//Save infos of a user for inscription
/*app.post('/signup', (req: any, res: any) => {
  let user: User= new User(req.body.username,req.body.email,req.body.password)
  dbUser.save(user, (err: Error | null) => {
    if (err) throw err
    res.status(200).send('saved')
    console.log(user) 
    console.log('test') 
  })
})
*/


/*
app.post('/signup', (req: any, res: any, next: any) => {
  
    dbUser.save(req.body.username, (err: Error | null, result?: User) => {
      if (err) next(err)
      if (result === undefined || !result.validatePassword(req.body.password)) {  
        console.log(result) 
        console.log('test') 
        res.redirect('/signup')

      } else {
        console.log(result) 
        console.log('test') 
        req.session.loggedIn = true
        req.session.user = result
        res.redirect('/')
      }
    })
  })
  */

app.use(authRouter)

const userRouter = express.Router()


userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})




//Get a user TEST 
/*
app.get('/users/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})
*/

//Add metrics page
authRouter.get('/userpage/addmetrics', (req: any, res: any) => {
  res.render('addmetrics')
})

//Add metrics page
authRouter.get('/userpage/deletemetrics', (req: any, res: any) => {
  res.render('deletemetrics')
})

//Add metrics page
authRouter.get('/userpage/metrics', (req: any, res: any) => {
  res.render('bringmetrics')
})

/*SERVER*/
const server = app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`Server is running on http://localhost:${port}`)
})

export default server