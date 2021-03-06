const qa = require('../db/query');

// ---------- Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  const user = req.session.user,
    userId = req.session.userId;
  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  let message = '';
  const fetch = require('node-fetch');
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let headerClass = "analysen";
  let headerTitel = "Analysen";
  let headerBild = "analysen.svg ";
  let analysetypOptions = "";
  let stoffOptions = "";
  let buchungenAnalysen = "";
  fetch('https://localhost:8081/select/analysen', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        analysetypOptions +=
          "<option value=" + row.AT_ID + ">" + row.AT_Bezeichnung + "</option> ";
      }
    })
    .then(() => {
      fetch('https://localhost:8081/select/stoff', {
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(json => {
          for (let row of json) {
            stoffOptions +=
              "<option value=" + row.S_ID + ">" + row.S_Bezeichnung + "</option> ";
          }
        })
        .then(() => {
          fetch('https://localhost:8081/tabellen/analysen', {
              credentials: 'include'
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
            })
            .then(json => {
              for (let row of json) {
                buchungenAnalysen +=
                  "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Stoff + "</td><td>" + row.ExterneID + "</td><td>" + row.Datum + "</td><td class='desktop desktop-tc'>" + row.Gueltigkeitsdatum + "</td><td>" + row.Analysetyp + "</td><td class='desktop desktop-tc'>" + row.Wert + "</td></tr>";
              }
            })
            .then(json => {
              res.render('analysen.ejs', {
                message: message,
                headerClass: headerClass,
                headerTitel: headerTitel,
                headerBild: headerBild,
                analysetypOptions: analysetypOptions,
                stoffOptions: stoffOptions,
                buchungenAnalysen: buchungenAnalysen
              });
            })
        })
        .catch(error => {
          logger.error(error);
        })
    });
};

// ---------- Analyse buchen ----------
exports.post = (req, res, next) => {
  let message = '';
  const post = req.body;
  const stoff = post.S_ID;
  const externeid = post.A_ExterneID;
  const datum = post.A_Datum;
  const gueltigkeitsdatum = post.A_DatumGueltigAb;
  const analysetyp = post.AT_ID;
  const wert = post.SA_A_Wert;

  const sql = "INSERT INTO `Stoffanalyse`(`Stoff_S_ID`,`A_ExterneID`,`A_Datum`,`A_DatumGueltigAb`) VALUES ('" + stoff + "','" + externeid + "','" + datum + "','" + gueltigkeitsdatum + "'); INSERT INTO Stoffanalyse_Analysetyp (Stoffanalyse_A_ID, Analysetyp_AT_ID, SA_A_Wert) VALUES ((SELECT MAX(A_ID) FROM Stoffanalyse), " + analysetyp + ", " + wert + ")";

  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/daten/analysen');
  })();
};

// ---------- Analyse ändern ----------
exports.put = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.A_ID;
  const stoff = post.S_ID;
  const externeId = post.A_ExterneID;
  const datum = post.A_Datum;
  const gueltigkeitsdatum = post.A_DatumGueltigAb;
  const analysetyp = post.AT_ID;
  const wert = post.SA_A_Wert;

  const sql = "UPDATE `Stoffanalyse` SET A_ExterneID = '" + externeId + "', A_Datum = '" + datum + "', A_DatumGueltigAb = '" + gueltigkeitsdatum + "', Stoff_S_ID = '" + stoff + "' WHERE A_ID = " + id + "; UPDATE Stoffanalyse_Analysetyp SET SA_A_Wert = '" + wert + "' WHERE Stoffanalyse_A_ID = " + id + " AND Analysetyp_AT_ID = " + analysetyp + ";";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/daten/analysen');
  })();
};