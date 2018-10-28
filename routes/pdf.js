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
        abnehmerNation = abnehmerNummer.substr(0, 3);
        abnehmerLand = abnehmerNummer.substr(3, 2);
        abnehmerLandkreis = abnehmerNummer.substr(5, 3);
        abnehmerGemeinde = abnehmerNummer.substr(8, 3);
        abnehmerBetrieb = abnehmerNummer.substr(11, 4);
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
      doc.fontSize(20)
        .text('Aufzeichnung über Wirtschaftsdüngerlieferung', 28, 30, {
          align: 'center'
        });
      doc.fontSize(11)
        .text('gemäß §3 Bundesverbringungsverordnung (Stand 07.2012)', 28, 51, {
          align: 'center'
        });
      doc.fontSize(11)
        .text('Lieferschein aus der Anwendung Nährstoffmanager erstellt', 28, 65, {
          align: 'center'
        });
      doc.rect(28, 80, 539, 95)
        .stroke();
      doc.fontSize(14)
        .text('1. Abgeber', 35, 88);
      doc.fontSize(11)
        .text('Firma / Name:', 38, 105);
      doc.fontSize(11)
        .text('Brokser Bioenergie GmbH & Co. KG', 130, 105);
      doc.fontSize(11)
        .text('Anschrift:', 38, 116);
      doc.fontSize(11)
        .text('Lange Str. 101, 27305 Bruchhausen-Vilsen', 130, 116);
      doc.fontSize(9)
        .text('Betriebsnummer Agrarförderung bzw.', 38, 134)
        .text('Nation', 265, 134)
        .text('Land', 320, 134)
        .text('Landkreis', 375, 134)
        .text('Gemeinde', 430, 134)
        .text('Betrieb', 485, 134);
      doc.fontSize(9)
        .text('Registriernummer Viehverkehrsverordnung', 38, 148)
        .text('276', 280, 148)
        .text('03', 340, 148)
        .text('251', 390, 148)
        .text('010', 445, 148)
        .text('0038', 500, 148);
      doc.rect(260, 130, 283, 28)
        .stroke();
      doc.moveTo(260, 144)
        .lineTo(543, 144)
        .stroke();
      doc.moveTo(315, 130)
        .lineTo(315, 158)
        .stroke();
      doc.moveTo(370, 130)
        .lineTo(370, 158)
        .stroke();
      doc.moveTo(425, 130)
        .lineTo(425, 158)
        .stroke();
      doc.moveTo(480, 130)
        .lineTo(480, 158)
        .stroke();
      // 2. hauptblock
      doc.rect(28, 180, 539, 95)
        .stroke();
      doc.fontSize(14)
        .text('2. Empfänger', 35, 188);
      doc.fontSize(11)
        .text('Firma / Name:', 38, 205);
      doc.fontSize(11)
        .text(abnehmerName, 130, 205);
      doc.fontSize(11)
        .text('Anschrift:', 38, 216);
      doc.fontSize(11)
        .text(abnehmerStrasse + ', ' + abnehmerPLZ + ' ' + abnehmerOrt, 130, 216);
      doc.fontSize(9)
        .text('Betriebsnummer Agrarförderung bzw.', 38, 234)
        .text('Nation', 265, 234)
        .text('Land', 320, 234)
        .text('Landkreis', 375, 234)
        .text('Gemeinde', 430, 234)
        .text('Betrieb', 485, 234);
      doc.fontSize(9)
        .text('Registriernummer Viehverkehrsverordnung', 38, 248)
        .text(abnehmerNation, 280, 248)
        .text(abnehmerLand, 340, 248)
        .text(abnehmerLandkreis, 390, 248)
        .text(abnehmerGemeinde, 445, 248)
        .text(abnehmerBetrieb, 500, 248);
      doc.rect(260, 230, 283, 28)
        .stroke();
      doc.moveTo(260, 244)
        .lineTo(543, 244)
        .stroke();
      doc.moveTo(315, 230)
        .lineTo(315, 258)
        .stroke();
      doc.moveTo(370, 230)
        .lineTo(370, 258)
        .stroke();
      doc.moveTo(425, 230)
        .lineTo(425, 258)
        .stroke();
      doc.moveTo(480, 230)
        .lineTo(480, 258)
        .stroke();
      // 3. Block
      doc.rect(28, 280, 539, 165)
        .stroke();
      doc.fontSize(14)
        .text('3. Art des Wirtschaftsdüngers ', 35, 288);
      doc.fontSize(11)
        .text('Gärrest', 130, 305);
      doc.fontSize(14)
        .text('4. Inhaltsstoffe ', 35, 325);
      doc.fontSize(11)
        .text('Ges.-N', 130, 342);
      doc.fontSize(11)
        .text('P2O5', 190, 342);
      doc.fontSize(11)
        .text('K2O', 250, 342);
      doc.fontSize(11)
        .text('Gesamt', 38, 359);
      doc.fontSize(11)
        .text(stickstoff, 145, 359);
      doc.fontSize(11)
        .text(phosphor, 200, 359);
      doc.fontSize(11)
        .text(kalium, 252, 359);
      doc.fontSize(14)
        .text('5. Abgabedatum ', 35, 376);
      doc.fontSize(11)
        .text('von ' + anfangsdatum + ' bis ' + enddatum, 130, 393);
      doc.fontSize(14)
        .text('6. Abgabemenge ', 35, 410);
      doc.fontSize(11)
        .text(menge + ' in cbm Frischmasse ', 130, 427);
      // Rest
      doc.moveTo(28, 500)
        .lineTo(539, 500)
        .stroke();
      doc.fontSize(11)
        .text('Ort, Datum, Unterschriften', 28, 505);
      doc.fontSize(11)
        .text('Abgeber', 258, 505);
      doc.fontSize(11)
        .text('Empfänger', 428, 505);
      doc.text('Bringt der Empfänger die hier nachgewiesene Lieferung erneut in Verkehr, ist auch diese Abgabe aufzeichnungspflichtig. ', 28, 535);
      doc.moveDown();
      doc.text('Haben Abgeber und Empfänger ihren Sitz in unterschiedlichen Bundesländern, hat der Empfänger jeweils zum 31. März die im vorangegangenem Jahr empfangenem Mengen der zuständigen Behörde zu melden (siehe Formular zur Meldepflicht nach § 4).', {
        width: '539'
      });
      doc.moveDown();
      doc.text('Die Aufzeichnungen sind für drei Jahre ab dem Datum der Abgabe aufzubewahren. Abgeber haben die Nds. Verordnung über Meldepflichten(Internet - Datenbankeintrag) zu beachten.', {
        width: '539'
      });
      doc.moveDown();
      doc.text('Hinweis: Diese Aufzeichnungen entbinden nicht von den düngemittelrechtlichen Kennzeichnungspflichten. Insbesondere bei Gärresten aus Biogas - Anlagen, Pilzkultursubstraten oder sonstigen Mischungen aus Wirtschaftsdüngern ist dies zu beachten.Dem Aufnehmer bzw.Empfänger ist mit jeder Partie unverzüglich eine nach Düngemittelverordnung vorgeschriebene Kennzeichnung auszuhändigen.', {
        width: '539'
      });



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