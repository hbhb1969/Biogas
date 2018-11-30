const qa = require('../db/query');
const fetch = require('node-fetch');

// ---------- Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  let message = '';
  let headerClass = "abnahmevertraege";
  let headerTitel = "Abnahmeverträge";
  let headerBild = "abnahmevertraege.svg ";
  let jahr = '';
  let jahrOptions = '';
  let abnahmevertraege = '';
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  fetch('https://localhost:8081/select/abnahmevertraege', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        jahrOptions +=
          "<option value=" + row.AV_Jahr + ">" + row.AV_Jahr + "</option> ";
      }
    })
    .then(json => {
      res.render('abnahmevertraege.ejs', {
        headerClass: headerClass,
        headerTitel: headerTitel,
        headerBild: headerBild,
        abnahmevertraege: abnahmevertraege,
        jahr: jahr,
        jahrOptions: jahrOptions,
        message: message
      });
    })
    .catch(error => {
      logger.error(error);
    })
};

// ---------- Bilanz anzeigen ----------
exports.post = (req, res, next) => {
  let message = '';
  let headerClass = "abnahmevertraege";
  let headerTitel = "Abnahmeverträge";
  let headerBild = "abnahmevertraege.svg ";
  let abnahmevertraege = '';
  let jahrOptions = '';
  const post = req.body;
  let jahr = post.Jahr;

  fetch('https://localhost:8081/select/abnahmevertraege', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        jahrOptions +=
          "<option value=" + row.AV_Jahr + ">" + row.AV_Jahr + "</option> ";
      }
    })
    .then(response => {
      let url = "https://localhost:8081/tabellen/abnahmevertraege?jahr=" + jahr;
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
            abnahmevertraege +=
              "<tr><td><div class='farbe'></div></td><td>" + row.B_Name + "</td><td class='t-rechts'>" + row.Soll.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td class='t-rechts'>" + row.Ist.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td class='t-rechts'>" + row.Differenz.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td></tr>";
          }

        })
        .then(() => {
          res.render('abnahmevertraege.ejs', {
            headerClass: headerClass,
            headerTitel: headerTitel,
            headerBild: headerBild,
            abnahmevertraege: abnahmevertraege,
            jahr: jahr,
            jahrOptions: jahrOptions,
            message: message
          });
        })
    })
};