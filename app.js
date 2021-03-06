process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // verhindert eine Fehlermeldung bei selbst-signierten Zertifikaten und kann entfernt werden, wenn ein fremd-signiertes Zertifikat genutzt wird.

// eigene Routen
const routes = require('./routes');
const abgaben = require('./routes/abgaben');
const abnahmevertraege = require('./routes/abnahmevertraege');
const abnahmevertraegedaten = require('./routes/abnahmevertraegedaten');
const analysen = require('./routes/analysen');
const auswertungen = require('./routes/auswertungen');
const betriebe = require('./routes/betriebe');
const bilanz = require('./routes/bilanz');
const fuetterungen = require('./routes/fuetterungen');
const hauptmenue = require('./routes/hauptmenue');
const impressum = require('./routes/impressum');
const index = require('./routes/index');
const lager = require('./routes/lager');
const rohstoffe = require('./routes/rohstoffe');
const zugaenge = require('./routes/zugaenge');
const select = require('./routes/select');
const stammdaten = require('./routes/stammdaten');
const tabellen = require('./routes/tabellen');
const pdf = require('./routes/pdf');

//Globale Variable
global.logger = require('winston');
logger.add(logger.transports.File, {
  'filename': 'error.log',
  'level': 'error'
});

// externe Module
const express = require('express');
const fs = require('fs');
const spdy = require('spdy');
const privateKey = fs.readFileSync('./https/privateKey.pem', 'utf8');
const certificate = fs.readFileSync('./https/certificate.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate
};
const path = require('path');
const session = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();

// Template-Engine zuweisen
app.set('view engine', 'ejs');

// Middleware auf Anwendungsebene einbinden
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/pdf', express.static(__dirname + '/public/pdf'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'geheimnis',
  cookie: {
    maxAge: 60000
  }
}));

// Routen
app.get('/', index.get);
app.get('/anmelden', index.get);
app.post('/anmelden', index.post);
app.get('/abmelden', index.get);
app.get('/impressum', impressum.get);
app.get('/hauptmenue', hauptmenue.get);
app.get('/auswertungen', auswertungen.get);
app.get('/auswertungen/abnahmevertraege', abnahmevertraege.get);
app.post('/auswertungen/abnahmevertraege', abnahmevertraege.post);
app.get('/auswertungen/bilanz', bilanz.get);
app.post('/auswertungen/bilanz', bilanz.post);
app.get('/auswertungen/bilanz-pdf', bilanz.post);
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
app.get('/stammdaten', stammdaten.get);
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
app.get('/pdf/abgabedaten', pdf.abgabedaten);
app.get('/pdf/lieferschein', pdf.lieferschein);
app.get('/pdf/nsabgaben', pdf.nsabgaben);
app.get('/pdf/nszugaenge', pdf.nszugaenge);
app.get('/pdf/bilanz', pdf.bilanz);

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
const spdyServer = spdy.createServer(credentials, app);
spdyServer.listen(8081);
logger.info('Server läuft auf Port 8081');