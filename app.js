const express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  zugaenge = require('./routes/zugaenge'),
  select = require('./routes/select'),
  tabellen = require('./routes/tabellen'),
  http = require('http'),
  path = require('path'),
  session = require('cookie-session'),
  mysql = require('mysql'),
  bodyParser = require('body-parser')
pool = require('./db/pool');
logger = require('winston');
logger.add(logger.transports.File, {
  'filename': 'error.log',
  'level': 'error'
});
process.on('error', function(err) {
  logger.error('on-error: ' + err);
});
process.on('uncaughtException', function(err) {
  logger.error('on uncaughtException: ' + err);
});

const app = express();

global.db = pool;

app.set('port', process.env.PORT || 8080);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'geheimnis',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}))

// Routen
app.get('/', routes.index);
app.get('/anmelden', routes.index);
app.post('/anmelden', user.anmelden);
app.get('/hauptmenue', user.hauptmenue);
app.get('/abmelden', user.abmelden);
app.get('/buchen/zugaenge', zugaenge.get);
app.post('/buchen/zugaenge', zugaenge.post);
app.post('/buchen/zugaenge-put', zugaenge.put);
app.post('/buchen/zugaenge-delete', zugaenge.delete);
app.get('/select/lager', select.lager);
app.get('/select/lieferant', select.lieferant);
app.get('/tabellen/zugaenge', tabellen.zugaenge);

// Server starten
app.listen(8080)
logger.info('Server läuft auf Port 8080');