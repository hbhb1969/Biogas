const bc = require('../eigene_module/benutzer_checken');
const qa = require('../eigene_module/queryAsync');
const fetch = require('node-fetch');

// ---------- Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  let headerTitel = "Nährstoffbilanz";
  let headerBild = "fuetterungen.svg ";
  let nBilanz = '';
  const anfangsdatum = '';
  const enddatum = '';
  const user = req.session.user,
    userId = req.session.userId;

  res.render('bilanz.ejs', {
    headerTitel: headerTitel,
    headerBild: headerBild,
    anfangsdatum: anfangsdatum,
    enddatum: enddatum,
    message: message,
    nBilanz: nBilanz
  });
};

// ---------- Bilanz anzeigen ----------
exports.post = function(req, res, next) {
  let message = '';
  let headerTitel = "Nährstoffbilanz";
  let headerBild = "fuetterungen.svg ";
  let nBilanz = '';
  const user = req.session.user,
    userId = req.session.userId;
  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  let anfangsdatumSql = post.Anfangsdatum;
  let enddatumSql = post.Enddatum;
  let anfangsdatum = anfangsdatumSql.split('-')[2] + '.' + anfangsdatumSql.split('-')[1] + '.' + anfangsdatumSql.split('-')[0];
  let enddatum = enddatumSql.split('-')[2] + '.' + enddatumSql.split('-')[1] + '.' + enddatumSql.split('-')[0];
  let url = "https://localhost:8081/tabellen/bilanz?anfangsdatum=" + anfangsdatumSql + "&enddatum=" + enddatumSql;
  fetch(url, options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        nBilanz +=
          "<tr><td>" + row.Naehrstoff + "</td><td class='t-rechts'>" + row.Zugang + "</td><td class='t-rechts'>" + row.Abgang + "</td><td class='t-rechts'>" + row.Saldo + "</td></tr>";
      }

    })
    .then(function() {
      res.render('bilanz.ejs', {
        headerTitel: headerTitel,
        headerBild: headerBild,
        nBilanz: nBilanz,
        anfangsdatum: anfangsdatum,
        enddatum: enddatum,
        message: message
      });
    })
};