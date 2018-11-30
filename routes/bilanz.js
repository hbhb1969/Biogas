const qa = require('../db/query');
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
  let pdf = req.query.pdf;
  let anfangsdatumSql = '';
  let enddatumSql = '';
  logger.info('pdf: ' + pdf);
  if (pdf == 1) {
    anfangsdatumSql = req.query.ad;
    enddatumSql = req.query.ed;
  } else {
    const post = req.body;
    anfangsdatumSql = post.Anfangsdatum;
    enddatumSql = post.Enddatum;
  }

  let anfangsdatum = anfangsdatumSql.split('-')[2] + '.' + anfangsdatumSql.split('-')[1] + '.' + anfangsdatumSql.split('-')[0];
  let enddatum = enddatumSql.split('-')[2] + '.' + enddatumSql.split('-')[1] + '.' + enddatumSql.split('-')[0];
  let url = "https://localhost:8081/tabellen/bilanz?anfangsdatum=" + anfangsdatumSql + "&enddatum=" + enddatumSql;
  logger.info('url: ' + url);
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
          "<tr><td>" + row.Naehrstoff + "</td><td class='t-rechts'>" + row.Zugang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td class='t-rechts'>" + row.Abgang.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td class='t-rechts'>" + row.Saldo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td></tr>";
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