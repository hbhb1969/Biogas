const fetch = require('node-fetch');
// Optionen für Abnahmevertraege
exports.abnehmerdaten = (req, res, next) => {
  let abgabeId = req.query.abgabeId;
  const sql = "SELECT * FROM `Abgabe`,`Person`,`Person_Adresse`,`Adresse` WHERE AG_ID = " + abgabeId + " AND P_ID = Abgabe.Person_P_ID AND P_ID = Person_Adresse.Person_P_ID AND Adresse_AD_ID = AD_ID";
  const logText = "Query Abnehmerdaten: " + sql;

  sqlQuery(res, sql, logText)
};

exports.lieferschein = (req, res, next) => {
  let abgabeId = req.query.AG_ID;
  const anfangsdatum = req.query.AG_DatumBeginn;
  const enddatum = req.query.AG_DatumEnde;
  const menge = req.query.AG_Menge;
  const abnehmer = req.query.Person_P_ID;

  logger.info('lieferschein-abgabeId: ' + abgabeId);

  // fetch Abnehmerdaten
  let urlAbnehmerdaten = 'https://localhost:8081/pdf/abnehmerdaten?abgabeId=' + abgabeId;

  logger.info('lieferschein-urlAbnehmerdaten: ' + urlAbnehmerdaten);
  let abnehmerName = '';
  let abnehmerStrasse = '';
  let abnehmerPLZ = '';
  let abnehmerOrt = '';
  let abnehmerNummer = '';
  let stickstoff = '';
  let kalium = '';
  let phosphor = '';
  fetch(urlAbnehmerdaten, {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        abnehmerName = row.B_Name;
        abnehmerNummer = row.B_Nummer;
        abnehmerStrasse = row.AD_Strasse;
        abnehmerPLZ = row.AD_PLZ;
        abnehmerOrt = row.AD_Ort;
      }
    })
    .then(() => {
      // Erzeuge PDF

      let PDFDocument = require('pdfkit');
      let fs = require('fs');
      let docname = 'public/pdf/LieferscheinGaerrest.pdf';
      let doc = new PDFDocument();

      doc.pipe(fs.createWriteStream(docname));
      //doc.pipe(res);
      doc.fontSize(25)
        .text('Lieferschein');
      doc.fontSize(15)
        .text('Anfangsdatum: ' + anfangsdatum)
        .text('Enddatum: ' + enddatum)
        .text('Abgabemenge: ' + menge)
        .text('Abnehmer: ' + abnehmerName)
        .text('Betriebsnummer: ' + abnehmerNummer)
        .text('Straße: ' + abnehmerStrasse)
        .text('PLZ und Ort: ' + abnehmerPLZ + ' ' + abnehmerOrt);

      doc.end();


    })
    .catch(error => {
      logger.error(error);
    })
  res.redirect('/buchen/abgaben?ls=1');
};

// Führt die Abfrage aus und sendet das Ergebnis zur Seite, die gefetched wird
function sqlQuery(res, sql, logText) {
  db.query(sql, (err, rows) => {
    if (err) {
      logger.error(err);
    }
    if (rows) {
      logger.info(logText + ': err: ' + err + ', rows: ' + rows.length);
      res.json(rows);
    } else {
      logger.warn('Keine ' + logText + ' gefunden: err:' + err);
      res.redirect('/hauptmenue');
    }
  });
}