const q = require('../eigene_module/query');
const fetch = require('node-fetch');
// Abgabedaten für Lieferschein
exports.abgabedaten = (req, res, next) => {
  let abgabeId = req.query.abgabeId;
  const sql = "SELECT * FROM `Abgabe`,`Naehrstoff_Abgabe`,`Person`,`Person_Adresse`,`Adresse` WHERE AG_ID = " + abgabeId + " AND Abgabe_AG_ID = AG_ID AND P_ID = Abgabe.Person_P_ID AND P_ID = Person_Adresse.Person_P_ID AND Adresse_AD_ID = AD_ID";
  const logText = "Query Abgabedaten: " + sql;

  q.query(res, sql, logText)
};

exports.lieferschein = (req, res, next) => {
  let abgabeId = req.query.AG_ID;
  let anfangsdatum = formatDatum(req.query.AG_DatumBeginn);
  let enddatum = formatDatum(req.query.AG_DatumEnde);
  let menge = req.query.AG_Menge;
  let abnehmer = req.query.Person_P_ID;

  logger.info('lieferschein-abgabeId: ' + abgabeId);

  // fetch Abgabedaten
  let urlAbgabedaten = 'https://localhost:8081/pdf/abgabedaten?abgabeId=' + abgabeId;

  logger.info('lieferschein-urlAbgabedaten: ' + urlAbgabedaten);
  let abnehmerName = '';
  let abnehmerStrasse = '';
  let abnehmerPLZ = '';
  let abnehmerOrt = '';
  let abnehmerNummer = '';
  let abnehmerNation = '';
  let abnehmerLand = '';
  let abnehmerLandkreis = '';;
  let abnehmerGemeinde = '';
  let abnehmerBetrieb = '';
  let stickstoff = '';
  let kalium = '';
  let phosphor = '';
  fetch(urlAbgabedaten, {
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
        })
        .fontSize(11)
        .text('gemäß §3 Bundesverbringungsverordnung (Stand 07.2012)', 28, 51, {
          align: 'center'
        })
        .fontSize(11)
        .text('Lieferschein aus der Anwendung Nährstoffmanager erstellt', 28, 65, {
          align: 'center'
        })
        .rect(28, 80, 539, 95)
        .stroke()
        .fontSize(14)
        .text('1. Abgeber', 35, 88)
        .fontSize(11)
        .text('Firma / Name:', 38, 105)
        .text('Brokser Bioenergie GmbH & Co. KG', 130, 105)
        .text('Anschrift:', 38, 120)
        .text('Lange Str. 101, 27305 Bruchhausen-Vilsen', 130, 120)
        .fontSize(9)
        .text('Betriebsnummer Agrarförderung bzw.', 38, 138)
        .text('Nation', 265, 138)
        .text('Land', 320, 138)
        .text('Landkreis', 375, 138)
        .text('Gemeinde', 430, 138)
        .text('Betrieb', 485, 138)
        .text('Registriernummer Viehverkehrsverordnung', 38, 152)
        .text('276', 280, 152)
        .text('03', 340, 152)
        .text('251', 390, 152)
        .text('010', 445, 152)
        .text('0038', 500, 152)
        .rect(260, 134, 283, 28)
        .stroke()
        .moveTo(260, 148)
        .lineTo(543, 148)
        .stroke()
        .moveTo(315, 134)
        .lineTo(315, 162)
        .stroke()
        .moveTo(370, 134)
        .lineTo(370, 162)
        .stroke()
        .moveTo(425, 134)
        .lineTo(425, 162)
        .stroke()
        .moveTo(480, 134)
        .lineTo(480, 162)
        .stroke()
        // 2. hauptblock
        .rect(28, 180, 539, 95)
        .stroke()
        .fontSize(14)
        .text('2. Empfänger', 35, 188)
        .fontSize(11)
        .text('Firma / Name:', 38, 205)
        .text(abnehmerName, 130, 205)
        .text('Anschrift:', 38, 220)
        .text(abnehmerStrasse + ', ' + abnehmerPLZ + ' ' + abnehmerOrt, 130, 220)
        .fontSize(9)
        .text('Betriebsnummer Agrarförderung bzw.', 38, 238)
        .text('Nation', 265, 238)
        .text('Land', 320, 238)
        .text('Landkreis', 375, 238)
        .text('Gemeinde', 430, 238)
        .text('Betrieb', 485, 238)
        .fontSize(9)
        .text('Registriernummer Viehverkehrsverordnung', 38, 252)
        .text(abnehmerNation, 280, 252)
        .text(abnehmerLand, 340, 252)
        .text(abnehmerLandkreis, 390, 252)
        .text(abnehmerGemeinde, 445, 252)
        .text(abnehmerBetrieb, 500, 252)
        .rect(260, 234, 283, 28)
        .stroke()
        .moveTo(260, 248)
        .lineTo(543, 248)
        .stroke()
        .moveTo(315, 234)
        .lineTo(315, 262)
        .stroke()
        .moveTo(370, 234)
        .lineTo(370, 262)
        .stroke()
        .moveTo(425, 234)
        .lineTo(425, 262)
        .stroke()
        .moveTo(480, 234)
        .lineTo(480, 262)
        .stroke()
        // 3. Block
        .rect(28, 280, 539, 165)
        .stroke()
        .fontSize(14)
        .text('3. Art des Wirtschaftsdüngers ', 35, 288)
        .fontSize(11)
        .text('Gärrest', 130, 305)
        .fontSize(14)
        .text('4. Inhaltsstoffe ', 35, 325)
        .fontSize(11)
        .text('Ges.-N', 130, 342)
        .text('P2O5', 190, 342)
        .text('K2O', 250, 342)
        .text('Gesamt', 38, 359)
        .text(stickstoff, 145, 359)
        .text(phosphor, 200, 359)
        .text(kalium, 252, 359)
        .fontSize(14)
        .text('5. Abgabedatum ', 35, 376)
        .fontSize(11)
        .text('von ' + anfangsdatum + ' bis ' + enddatum, 130, 393)
        .fontSize(14)
        .text('6. Abgabemenge ', 35, 410)
        .fontSize(11)
        .text(menge + ' in cbm Frischmasse ', 130, 427)
        // Rest
        .moveTo(28, 500)
        .lineTo(539, 500)
        .stroke()
        .fontSize(11)
        .text('Ort, Datum, Unterschriften', 28, 505)
        .fontSize(11)
        .text('Abgeber', 258, 505)
        .fontSize(11)
        .text('Empfänger', 428, 505)
        .text('Bringt der Empfänger die hier nachgewiesene Lieferung erneut in Verkehr, ist auch diese Abgabe aufzeichnungspflichtig. ', 28, 535)
        .moveDown()
        .text('Haben Abgeber und Empfänger ihren Sitz in unterschiedlichen Bundesländern, hat der Empfänger jeweils zum 31. März die im vorangegangenem Jahr empfangenem Mengen der zuständigen Behörde zu melden (siehe Formular zur Meldepflicht nach § 4).', {
          width: '539'
        })
        .moveDown()
        .text('Die Aufzeichnungen sind für drei Jahre ab dem Datum der Abgabe aufzubewahren. Abgeber haben die Nds. Verordnung über Meldepflichten(Internet - Datenbankeintrag) zu beachten.', {
          width: '539'
        })
        .moveDown()
        .text('Hinweis: Diese Aufzeichnungen entbinden nicht von den düngemittelrechtlichen Kennzeichnungspflichten. Insbesondere bei Gärresten aus Biogas - Anlagen, Pilzkultursubstraten oder sonstigen Mischungen aus Wirtschaftsdüngern ist dies zu beachten.Dem Aufnehmer bzw.Empfänger ist mit jeder Partie unverzüglich eine nach Düngemittelverordnung vorgeschriebene Kennzeichnung auszuhändigen.', {
          width: '539'
        });



      doc.end();


    })
    .catch(error => {
      logger.error(error);
    })
  res.redirect('/buchen/abgaben?ls=1');
};

exports.nsabgaben = (req, res, next) => {
  let anfangsdatum = req.query.ad;
  let enddatum = req.query.ed;
  const sql = "SELECT N_ID, SUM(N_Menge) AS NS_Menge, SUM(AG_Menge) AS AG_Menge  FROM `Naehrstoff`, `Naehrstoff_Abgabe`, `Abgabe` WHERE AG_DatumEnde >= '" + anfangsdatum + "' AND AG_DatumEnde <= '" + enddatum + "' AND N_ID = Naehrstoff_N_ID AND AG_ID = Abgabe_AG_ID      GROUP BY N_ID ORDER BY N_ID";
  const logText = "Query Abgabemengen: " + sql;

  q.query(res, sql, logText)
};

exports.nszugaenge = (req, res, next) => {
  let anfangsdatum = req.query.ad;
  let enddatum = req.query.ed;
  const sql = "SELECT * FROM (SELECT S_Bezeichnung AS Stoff, N_Bezeichnung AS Naehrstoff, SUM(N_Menge) AS N_Menge, SUM(Z_BruttoMenge) AS S_Menge FROM `Naehrstoff`, `Naehrstoff_N_Eingang`, `N_Eingang`, `Zugang` , `Lager` , `Stoff` WHERE Z_Datum >= '" + anfangsdatum + "' AND Z_Datum <= '" + enddatum + "' AND N_ID = Naehrstoff_N_ID AND NE_ID = N_Eingang_NE_ID AND Z_ID = Zugang_Z_ID AND L_ID = Lager_L_ID AND S_ID = Stoff_S_ID GROUP BY Stoff, Naehrstoff ORDER BY Stoff) as Zugang UNION ALL SELECT * FROM (SELECT S_Bezeichnung AS Stoff, N_Bezeichnung AS Naehrstoff, SUM(N_Menge) AS N_Menge, SUM(F_BruttoMenge) AS S_Menge FROM `Naehrstoff`, `Naehrstoff_N_Eingang`, `N_Eingang`, `Fuetterung` , `Stoff` WHERE F_Datum >= '" + anfangsdatum + "' AND F_Datum <= '" + enddatum + "' AND N_ID = Naehrstoff_N_ID AND NE_ID = N_Eingang_NE_ID AND F_ID = Fuetterung_F_ID AND S_ID = Stoff_S_ID GROUP BY Stoff, Naehrstoff ORDER BY Stoff) AS f";
  const logText = "Query Zugangsmengenmengen: " + sql;

  q.query(res, sql, logText)
};

exports.bilanz = (req, res, next) => {
  logger.info('in bilanz');
  let anfangsdatum = req.query.Anfangsdatum;
  let enddatum = req.query.Enddatum;
  logger.info('Anfangsdatum: ' + anfangsdatum);
  logger.info('Enddatum: ' + enddatum);

  // fetch Abgabemengen
  let urlAbgabemengen = 'https://localhost:8081/pdf/nsabgaben?ad=' + anfangsdatum + '&ed=' + enddatum;
  let urlZugangsmengen = 'https://localhost:8081/pdf/nszugaenge?ad=' + anfangsdatum + '&ed=' + enddatum;
  let agK = '';
  let agN = '';
  let agP = '';
  let agMenge = '';
  let zugaenge = [];
  let zK = 0;
  let zN = 0;
  let zP = 0;
  let zMenge = 0;
  let sK = 0;
  let sN = 0;
  let sP = 0;
  let sMenge = 0;
  fetch(urlAbgabemengen, {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        agMenge = row.AG_Menge * -1;
        if (row.N_ID == 1) {
          agN = row.NS_Menge * -1;
        } else if (row.N_ID == 2) {
          agP = row.NS_Menge * -1;
        } else if (row.N_ID == 3) {
          agK = row.NS_Menge * -1;
        }
      }
    })
    .then(() => {
      fetch(urlZugangsmengen, {
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(json => {
          let i = 1;
          for (let row of json) {
            if (i == 1) {
              zMenge = zMenge + row.S_Menge;
              zK = zK + row.N_Menge;
              zugaenge.push(row.Stoff);
              zugaenge.push(row.S_Menge);
              zugaenge.push(row.N_Menge);

              i++;
            } else if (i == 2) {
              zN = zN + row.N_Menge;
              zugaenge.push(row.N_Menge);
              i++;
            } else if (i == 3) {
              zP = zP + row.N_Menge;
              zugaenge.push(row.N_Menge);
              i = 1;
            }
          }
        })
        .then(() => {
          // Erzeuge PDF

          let PDFDocument = require('pdfkit');
          let fs = require('fs');
          let docname = 'public/pdf/Bilanz.pdf';
          let doc = new PDFDocument();

          doc.pipe(fs.createWriteStream(docname));
          //doc.pipe(res);
          doc.fontSize(20)
            .text('Nährstoffbilanz', 28, 30, {
              align: 'center'
            });
          doc.fontSize(11)
            .text('gemäß §3 Bundesverbringungsverordnung (Stand 07.2012)', 28, 51, {
              align: 'center'
            })
          let y = 200;
          for (i = 0; i < zugaenge.length; i++) {
            doc.fontSize(11)
              .text(zugaenge.shift(), 35, y)
              .text(zugaenge.shift().toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 100, y, {
                width: 100,
                align: 'right'
              })
              .text(zugaenge.shift().toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 200, y, {
                width: 100,
                align: 'right'
              })
              .text(zugaenge.shift().toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 300, y, {
                width: 100,
                align: 'right'
              })
              .text(zugaenge.shift().toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 400, y, {
                width: 100,
                align: 'right'
              });
            y = y + 15;
          }
          let yLinie = y - 5;
          doc.moveTo(35, yLinie)
            .lineTo(500, yLinie)
            .stroke()
            .text("Gesamt: ", 35, y)
            .text(zMenge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 100, y, {
              width: 100,
              align: 'right'
            })
            .text(zK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 200, y, {
              width: 100,
              align: 'right'
            })
            .text(zN.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 300, y, {
              width: 100,
              align: 'right'
            })
            .text(zP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 400, y, {
              width: 100,
              align: 'right'
            });
          y = y + 15;
          yLinie = y + 10;
          doc.text("Abgabe Gärrest ", 35, y)
            .text(agMenge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 100, y, {
              width: 100,
              align: 'right'
            })
            .text(agK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 200, y, {
              width: 100,
              align: 'right'
            })
            .text(agN.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 300, y, {
              width: 100,
              align: 'right'
            })
            .text(agP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 400, y, {
              width: 100,
              align: 'right'
            })
            .moveTo(35, yLinie)
            .lineTo(500, yLinie)
            .stroke();
          sMenge = zMenge + agMenge;
          sK = zK + agK;
          sN = zN + agN;
          sP = zP + agP;
          y = y + 15;
          yLinie = y + 10;
          doc.text("Saldo ", 35, y)
            .text(sMenge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 100, y, {
              width: 100,
              align: 'right'
            })
            .text(sK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 200, y, {
              width: 100,
              align: 'right'
            })
            .text(sN.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 300, y, {
              width: 100,
              align: 'right'
            })
            .text(sP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), 400, y, {
              width: 100,
              align: 'right'
            })
            .moveTo(35, yLinie)
            .lineTo(500, yLinie)
            .stroke();

          doc.end();
        })
    })
    .catch(error => {
      logger.error(error);
    })
  res.redirect('/auswertungen/bilanz-pdf?pdf=1&ad=' + anfangsdatum + '&ed=' + enddatum);
};

// Formatiert das Datum in deutsches Formatiert
function formatDatum(datum) {
  const [jahr, monat, tag] = datum.split("-")
  return new String(tag + "." + monat + "." + jahr);
}