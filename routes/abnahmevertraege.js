const bc = require('../eigene_module/benutzer_checken');
const qa = require('../eigene_module/queryAsync');
const fetch = require('node-fetch');

// ---------- Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  let jahr = '';
  let jahrOptions = '';
  let abnahmevertraege = '';
  const user = req.session.user,
    userId = req.session.userId;
  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  fetch("http://localhost:8080/select/abnahmevertraege", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        jahrOptions +=
          "<option value=" + row.AV_Jahr + ">" + row.AV_Jahr + "</option> ";
      }
    })
    .then(function(json) {
      res.render('abnahmevertraege.ejs', {
        abnahmevertraege: abnahmevertraege,
        jahr: jahr,
        jahrOptions: jahrOptions,
        message: message
      });
    })
    .catch(function(error) {
      logger.error(error);
    })
};

// ---------- Bilanz anzeigen ----------
exports.post = function(req, res, next) {
  let message = '';
  let abnahmevertraege = '';
  let jahrOptions = '';
  const user = req.session.user,
    userId = req.session.userId;
  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  let jahr = post.Jahr;

  fetch("http://localhost:8080/select/abnahmevertraege", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        jahrOptions +=
          "<option value=" + row.AV_Jahr + ">" + row.AV_Jahr + "</option> ";
      }
    })
    .then(function(response) {
      let url = "http://localhost:8080/tabellen/abnahmevertraege?jahr=" + jahr;
      fetch(url, options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            abnahmevertraege +=
              "<tr><td>" + row.B_Name + "</td><td class='t-rechts'>" + row.Soll + "</td><td class='t-rechts'>" + row.Ist + "</td><td class='t-rechts'>" + row.Differenz + "</td></tr>";
          }

        })
        .then(function() {
          res.render('abnahmevertraege.ejs', {
            abnahmevertraege: abnahmevertraege,
            jahr: jahr,
            jahrOptions: jahrOptions,
            message: message
          });
        })
    })
};