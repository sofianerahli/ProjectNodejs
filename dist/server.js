"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var path = require("path");
var bodyparser = require("body-parser");
var session = require("express-session");
var levelSession = require("level-session-store");
var app = express();
var port = process.env.PORT || '8082';
app.use(express.static(path.join(__dirname, '/../public')));
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
/*SeSSION*/
var LevelStore = levelSession(session);
app.get('/', function (req, res) {
    res.render('home');
});
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
/* */
app.get('/hello/:name', function (req, res) {
    res.render('index.ejs', { name: req.params.name });
});
app.get('/metrics.json', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.post('/metrics/:id', function (req, res) {
    dbMet.save(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).send('ok');
        res.end();
    });
});
app.get('/metrics/', function (req, res) {
    dbMet.getAll(function (err, result) {
        if (err)
            throw err;
        res.status(200).json({ result: result });
    });
});
app.get('/metrics/:id', function (req, res) {
    var key = req.params.id;
    dbMet.getOne(key, function (err, data) {
        if (err) {
            if (err.message === "Metric doesn't exist") {
                res.sendStatus(400);
                return;
            }
            throw err;
        }
        ;
        res.status(200).json({ data: data });
    });
});
app.delete('/metrics/:id', function (req, res) {
    var key = req.params.id;
    dbMet.delete(key, function (err, data) {
        if (err) {
            if (err.message === "Metric doesn't exist") {
                res.sendStatus(400);
                return;
            }
            throw err;
        }
        ;
        res.status(200).json({ data: data });
    });
});
/*USER*/
var users_1 = require("./users");
var dbUser = new users_1.UserHandler('./db/users');
var authRouter = express.Router();
authRouter.get('/login', function (req, res) {
    res.render('login');
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
app.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
app.post('/signup', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/signup');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
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
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
app.use('/user', userRouter);
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.username });
});
/* SERVER*/
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("Server is running on http://localhost:" + port);
});
