const express = require('express'),
  fs = require('fs'),
  routes = require('./routes'),
  user = require('./routes/user'),
  abgaben = require('./routes/abgaben'),
  abnahmevertraege = require('./routes/abnahmevertraege'),
  abnahmevertraegedaten = require('./routes/abnahmevertraegedaten'),
  analysen = require('./routes/analysen'),
  auswertungen = require('./routes/auswertungen'),
  betriebe = require('./routes/betriebe'),
  bilanz = require('./routes/bilanz'),
  fuetterungen = require('./routes/fuetterungen'),
  lager = require('./routes/lager'),
  rohstoffe = require('./routes/rohstoffe'),
  zugaenge = require('./routes/zugaenge'),
  select = require('./routes/select'),
  tabellen = require('./routes/tabellen'),
  http = require('http'),
  spdy = require('spdy'),
  privateKey = fs.readFileSync('./https/privateKey.pem', 'utf8'),
  certificate = fs.readFileSync('./https/certificate.pem', 'utf8'),
  credentials = {
    key: privateKey,
    cert: certificate
  },
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

const app = express();
const httpServer = http.createServer(app);
const spdyServer = spdy.createServer(credentials, app);

global.db = pool;

app.set('port', process.env.PORT || 8080);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
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
app.get('/hauptmenue2', user.hauptmenue2);
app.get('/abmelden', user.abmelden);
app.get('/auswertungen', auswertungen.index);
app.get('/auswertungen/abnahmevertraege', abnahmevertraege.get);
app.post('/auswertungen/abnahmevertraege', abnahmevertraege.post);
app.get('/auswertungen/bilanz', bilanz.get);
app.post('/auswertungen/bilanz', bilanz.post);
app.get('/buchen/abgaben', abgaben.get);
app.post('/buchen/abgaben', abgaben.post);
app.post('/buchen/abgaben-put', abgaben.put);
app.post('/buchen/abgaben-delete', abgaben.delete);
app.get('/daten/analysen', analysen.get);
app.post('/daten/analysen', analysen.post);
app.post('/daten/analysen-put', analysen.put);
app.get('/buchen/fuetterungen', fuetterungen.get);
app.post('/buchen/fuetterungen', fuetterungen.post);
app.post('/buchen/fuetterungen-put', fuetterungen.put);
app.post('/buchen/fuetterungen-delete', fuetterungen.delete);
app.get('/buchen/zugaenge', zugaenge.get);
app.post('/buchen/zugaenge', zugaenge.post);
app.post('/buchen/zugaenge-put', zugaenge.put);
app.post('/buchen/zugaenge-delete', zugaenge.delete);
app.get('/daten/abnahmevertraege', abnahmevertraegedaten.get);
app.post('/daten/abnahmevertraege', abnahmevertraegedaten.post);
app.post('/daten/abnahmevertraege-put', abnahmevertraegedaten.put);
app.get('/daten/betriebe', betriebe.get);
app.post('/daten/betriebe', betriebe.post);
app.post('/daten/betriebe-put', betriebe.put);
app.get('/daten/lager', lager.get);
app.post('/daten/lager', lager.post);
app.post('/daten/lager-put', lager.put);
app.get('/daten/rohstoffe', rohstoffe.get);
app.post('/daten/rohstoffe', rohstoffe.post);
app.post('/daten/rohstoffe-put', rohstoffe.put);
app.get('/select/abnahmevertraege', select.abnahmevertraege);
app.get('/select/abnehmer', select.abnehmer);
app.get('/select/analysen', select.analysen);
app.get('/select/direktrohstoff', select.direktrohstoff);
app.get('/select/lager', select.lager);
app.get('/select/lieferant', select.lieferant);
app.get('/select/lagerrohstoff', select.lagerrohstoff);
app.get('/select/mengeneinheit', select.mengeneinheit);
app.get('/select/stoff', select.stoff);
app.get('/tabellen/abgaben', tabellen.abgaben);
app.get('/tabellen/abnahmevertraege', tabellen.abnahmevertraege);
app.get('/tabellen/abnahmevertraegedaten', tabellen.abnahmevertraegedaten);
app.get('/tabellen/analysen', tabellen.analysen);
app.get('/tabellen/betriebe', tabellen.betriebe);
app.get('/tabellen/bilanz', tabellen.bilanz);
app.get('/tabellen/fuetterungendirekt', tabellen.fuetterungendirekt);
app.get('/tabellen/fuetterungenlager', tabellen.fuetterungenlager);
app.get('/tabellen/lager', tabellen.lager);
app.get('/tabellen/stoffedirekt', tabellen.stoffedirekt);
app.get('/tabellen/stoffelager', tabellen.stoffelager);
app.get('/tabellen/zugaenge', tabellen.zugaenge);

// Fehlerbehandlung für nicht vorhandene routes
app.use((req, res, next) => {
  const error = new Error('Seite nicht gefunden' + req.url);
  logger.error('Seite nicht gefunden: ' + req.url)
  error.status = 404;
  next(error);
})

// Allgemeine Fehlerbehandlung
app.use((error, req, res, next) => {
  logger.error('Globaler Fehler: ' + error)
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

// Server starten
httpServer.listen(8080);
spdyServer.listen(8081);
logger.info('Server laufen auf Port 8080 und 8081 (https)');