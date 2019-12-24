"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var path = require("path");
var bodyparser = require("body-parser");
var session = require("express-session");
var levelSession = require("level-session-store");
var app = express();
var port = process.env.PORT || '8083';
var authRouter = express.Router();
app.use(express.static(path.join(__dirname, '/../public')));
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
/*Home*/
app.get('/', function (req, res) {
    res.render('home');
});
/*SeSSION*/
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
/*Metrics*/
//Metrics Page 
authRouter.get('userpage/metrics', function (req, res) {
    dbMet.getAll(req.session.username, function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
});
authRouter.get('/metrics.json', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json({ result: result });
    });
});
app.get('/metrics/:id', function (req, res) {
    dbMet.getAll(req.session.username, function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
});
authRouter.post('/addmetrics', function (req, res, next) {
    var a = Math.floor(Math.random() * 3000) + 1;
    var metric = new metrics_1.Metric(a, req.session.username, req.body.date, req.body.weight);
    dbMet.save(metric, function (err) {
        if (err) {
            next(err);
            console.log('Metric added');
            res.redirect('/addmetrics');
        }
    });
});
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
var users_1 = require("./users");
var dbUser = new users_1.UserHandler('./db/users');
//Inscription page
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
//Logout
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.username;
    res.redirect('/');
});
//User Page
authRouter.get('/userpage', function (req, res) {
    res.render('userpage');
});
//Signup
authRouter.post('/signup', function (req, res, next) {
    var user = new users_1.User(req.body.username, req.body.email, req.body.password);
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            console.log('user already exists');
            res.redirect('/signup');
        }
        else {
            dbUser.save(user, function (err) {
                if (err)
                    next(err);
                console.log('Inscription successful');
                req.session.loggedIn = true;
                req.session.username = req.body.username;
                res.redirect('/userpage');
            });
        }
    });
});
//Login
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result !== undefined) {
            if (!result.validatePassword(req.body.password)) {
                console.log('Password false');
                res.redirect('/login');
            }
            else {
                console.log('Connexion successful');
                req.session.loggedIn = true;
                req.session.username = req.body.username;
                res.redirect('/userpage');
            }
        }
        else {
            console.log('Username invalid');
            res.redirect('/login');
        }
    });
});
// Session
authRouter.get('/login', function (req, res, next) {
    if (req.session.loggedIn) {
        console.log('Welcome ' + req.session.username);
        res.redirect('/userpage');
    }
    else {
        console.log('Session not found');
        res.render('login');
    }
});
app.use(authRouter);
var userRouter = express.Router();
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
//Add metrics page
authRouter.get('/addmetrics', function (req, res) {
    res.render('addmetrics');
});
//delete metrics page
authRouter.get('/deletemetrics', function (req, res) {
    res.render('deletemetrics');
});
//bring metrics page
authRouter.get('/userpage/metrics', function (req, res) {
    res.render('bringmetrics');
});
/*SERVER*/
var server = app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("Server is running on http://localhost:" + port);
});
exports.default = server;
