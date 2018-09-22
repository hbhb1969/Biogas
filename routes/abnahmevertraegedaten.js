const bc = require('../eigene_module/benutzer_checken');
const qa = require('../eigene_module/queryAsync');
// ---------- Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  const fetch = require('node-fetch');
  const user = req.session.user,
    userId = req.session.userId;

  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let headerClass = "abnahmevertraege-d";
  let headerTitel = "Abnahmeverträge";
  let headerBild = "abnahmevertraege-d.svg ";
  let abnehmerOptions = "";
  let buchungenAbnahmevertraege = "";
  fetch("https://localhost:8081/select/abnehmer", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        abnehmerOptions += "<option value=" + row.P_ID + ">" + row.B_Name + "</option> ";
      }
    })
    .then(function() {
      fetch("https://localhost:8081/tabellen/abnahmevertraegedaten", options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            buchungenAbnahmevertraege +=
              "<tr><td class='t-id'>" + row.AV_ID + "</td><td>" + row.B_Name + "</td><td>" + row.AV_Jahr + "</td><td class='t-rechts'>" + row.AV_Menge + "</td></tr>";
          }
        })

        .then(function(json) {
          res.render('abnahmevertraege-daten.ejs', {
            user: user,
            message: message,
            headerClass: headerClass,
            headerTitel: headerTitel,
            headerBild: headerBild,
            abnehmerOptions: abnehmerOptions,
            buchungenAbnahmevertraege: buchungenAbnahmevertraege
          });
        })
    })

    .catch(function(error) {
      logger.error(error);
    })
};

// ---------- Abnahmevertraege buchen ----------
exports.post = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const abnehmer = post.B_Name;
  const jahr = post.AV_Jahr;
  const menge = post.AV_Menge;

  const sql = "INSERT INTO Abnahmevertrag (Person_P_ID, AV_Jahr, AV_Menge) VALUES ('" + abnehmer + "','" + jahr + "','" + menge + "'); INSERT INTO `Abgabe` (`AG_DatumBeginn`, `AG_DatumEnde`, `AG_Menge`, `Biogasanlage_BGA_ID`, `Stoff_S_ID`, `Person_P_ID`) VALUES ( '" + jahr + "-01-01', '" + jahr + "-01-01', '0', '1', '1', '" + abnehmer + "');"; // Eine Abgabe mit Menge 0 muss gebucht werden, damit der Abnahmevertrag auch in der Auswertung erscheint, wenn noch keine Abgabe erfolgt ist.
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/abnahmevertraege');
};

// ---------- Abgabevertraege ändern ----------
exports.put = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.AV_ID;
  const abnehmer = post.B_Name;
  const jahr = post.AV_Jahr;
  const menge = post.AV_Menge;

  const sql = "UPDATE `Abnahmevertrag` SET Person_P_ID = '" + abnehmer + "', AV_Jahr = '" + jahr + "', AV_Menge ='" + menge + "' WHERE AV_ID = " + id + ";";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/abnahmevertraege');
};