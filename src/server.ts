import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')

const app = express()
const port: string = process.env.PORT || '8082'
app.use(express.static(path.join(__dirname, '/../public')))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

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
/* */

app.get('/hello/:name', (req: any, res: any) => {
  res.render('index.ejs', {name: req.params.name})
})

app.get('/metrics.json', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send('ok')
    res.end()
  })
})

app.get('/metrics/', (req: any, res: any) => {
  dbMet.getAll((err: Error | null, result: any) => {
    if (err) throw err
    res.status(200).json({result})
    
  })
})

app.get('/metrics/:id', (req: any, res: any) => {
  const key=req.params.id
  dbMet.getOne(key,(err: Error | null, data: Metric | null) => {
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
/*USER*/ 
import { UserHandler, User } from './users'
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()



authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})


authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})
app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

app.post('/signup', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
      if (err) next(err)
      if (result === undefined || !result.validatePassword(req.body.password)) {
        
        res.redirect('/signup')
      } else {
        req.session.loggedIn = true
        req.session.user = result
        res.redirect('/')
      }
    })
  })

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

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})


app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

/* SERVER*/
app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`Server is running on http://localhost:${port}`)
})
