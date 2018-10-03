const qa = require('../eigene_module/queryAsync');
const fetch = require('node-fetch');

// ---------- Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  let message = '';
  let headerClass = "bilanz";
  let headerTitel = "Nährstoffbilanz";
  let headerBild = "bilanz.svg ";
  let nBilanz = '';
  const anfangsdatum = '';
  const enddatum = '';
  res.render('bilanz.ejs', {
    headerClass: headerClass,
    headerTitel: headerTitel,
    headerBild: headerBild,
    anfangsdatum: anfangsdatum,
    enddatum: enddatum,
    message: message,
    nBilanz: nBilanz
  });
};

// ---------- Bilanz anzeigen ----------
exports.post = (req, res, next) => {
  let message = '';
  let headerClass = "bilanz";
  let headerTitel = "Nährstoffbilanz";
  let headerBild = "bilanz.svg ";
  let nBilanz = '';
  const post = req.body;
  let anfangsdatumSql = post.Anfangsdatum;
  let enddatumSql = post.Enddatum;
  let anfangsdatum = anfangsdatumSql.split('-')[2] + '.' + anfangsdatumSql.split('-')[1] + '.' + anfangsdatumSql.split('-')[0];
  let enddatum = enddatumSql.split('-')[2] + '.' + enddatumSql.split('-')[1] + '.' + enddatumSql.split('-')[0];
  let url = "https://localhost:8081/tabellen/bilanz?anfangsdatum=" + anfangsdatumSql + "&enddatum=" + enddatumSql;
  fetch(url, {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        nBilanz +=
          "<tr><td>" + row.Naehrstoff + "</td><td class='t-rechts'>" + row.Zugang + "</td><td class='t-rechts'>" + row.Abgang + "</td><td class='t-rechts'>" + row.Saldo + "</td></tr>";
      }

    })
    .then(() => {
      res.render('bilanz.ejs', {
        headerClass: headerClass,
        headerTitel: headerTitel,
        headerBild: headerBild,
        nBilanz: nBilanz,
        anfangsdatum: anfangsdatum,
        enddatum: enddatum,
        message: message
      });
    })
};