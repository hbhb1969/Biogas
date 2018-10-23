const fetch = require('node-fetch');
// Optionen für Abnahmevertraege
exports.abgabedaten = (req, res, next) => {
  let abgabeId = req.query.abgabeId;
  const sql = "SELECT * FROM `Abgabe`,`Naehrstoff_Abgabe`,`Person`,`Person_Adresse`,`Adresse` WHERE AG_ID = " + abgabeId + " AND Abgabe_AG_ID = AG_ID AND P_ID = Abgabe.Person_P_ID AND P_ID = Person_Adresse.Person_P_ID AND Adresse_AD_ID = AD_ID";
  const logText = "Query Abnehmerdaten: " + sql;

  sqlQuery(res, sql, logText)
};

exports.lieferschein = (req, res, next) => {
  let abgabeId = req.query.AG_ID;
  let anfangsdatum = formatDatum(req.query.AG_DatumBeginn);
  let enddatum = formatDatum(req.query.AG_DatumEnde);
  let menge = req.query.AG_Menge;
  let abnehmer = req.query.Person_P_ID;

  logger.info('lieferschein-abgabeId: ' + abgabeId);

  // fetch Abnehmerdaten
  let urlAbnehmerdaten = 'https://localhost:8081/pdf/abgabedaten?abgabeId=' + abgabeId;

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
        if (row.Naehrstoff_N_ID == 1) {
          stickstoff = row.N_Menge;
        } else if (row.Naehrstoff_N_ID == 2) {
          phosphor = row.N_Menge;
        } else if (row.Naehrstoff_N_ID == 3) {
          kalium = row.N_Menge;
        }
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
        .text('Aufzeichnung über Wirtschaftsdüngerlieferung', {
          align: 'center'
        });
      doc.fontSize(15)
        .text('Anfangsdatum: ' + anfangsdatum)
        .text('Enddatum: ' + enddatum)
        .text('Abgabemenge: ' + menge)
        .text('Abnehmer: ' + abnehmerName)
        .text('Betriebsnummer: ' + abnehmerNummer)
        .text('Straße: ' + abnehmerStrasse)
        .text('PLZ und Ort: ' + abnehmerPLZ + ' ' + abnehmerOrt)
        .text('Stickstoff: ' + stickstoff)
        .text('Kalium: ' + kalium)
        .text('Phosphor: ' + phosphor);

      doc.end();


    })
    .catch(error => {
      logger.error(error);
    })
  res.redirect('/buchen/abgaben?ls=1');
};

// Formatiert das Datum in deutsches Formatiert
function formatDatum(datum) {
  const [jahr, monat, tag] = datum.split("-")
  return new String(tag + "." + monat + "." + jahr);
}

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