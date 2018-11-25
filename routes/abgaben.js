const qa = require('../eigene_module/query');
const fetch = require('node-fetch');

// ---------- Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  let message = '';

  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let headerClass = "abgaben";
  let headerTitel = "Abgaben";
  let headerBild = "abgaben.svg ";
  let abnehmerOptions = "";
  let buchungenAbgaben = "";
  fetch('https://localhost:8081/select/abnehmer', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        abnehmerOptions +=
          "<option value=" + row.P_ID + ">" + row.B_Name + "</option> ";
      }
    })
    .then(() => {
      fetch('https://localhost:8081/tabellen/abgaben', {
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(json => {
          for (let row of json) {
            buchungenAbgaben +=
              "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Anfangsdatum + "</td><td>" + row.Enddatum + "</td><td class='t-rechts'>" + row.Menge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td>" + row.Abnehmer + "</td></tr>";
          }
        })
        .then(json => {
          res.render('abgaben.ejs', {
            headerClass: headerClass,
            headerTitel: headerTitel,
            headerBild: headerBild,
            message: message,
            abnehmerOptions: abnehmerOptions,
            buchungenAbgaben: buchungenAbgaben
          });
        })
    })
    .catch(error => {
      logger.error(error);
    })
};

// ---------- Abgabe buchen ----------
exports.post = (req, res, next) => {
  let message = '';
  const post = req.body;
  const anfangsdatum = post.AG_DatumBeginn;
  const enddatum = post.AG_DatumEnde;
  const menge = post.AG_Menge;
  const abnehmer = post.Person_P_ID;

  const sql = "INSERT INTO `Abgabe`(`AG_DatumBeginn`,`AG_DatumEnde`,`AG_Menge`,`Biogasanlage_BGA_ID`,`Stoff_S_ID`,`Person_P_ID`) VALUES ('" + anfangsdatum + "','" + enddatum + "','" + menge + "', '1', '1','" + abnehmer + "')";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/buchen/abgaben');
  })();

  //res.redirect('/buchen/abgaben');
};

// ---------- Abgabe ändern ----------
exports.put = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.AG_ID;
  const anfangsdatum = post.AG_DatumBeginn;
  const enddatum = post.AG_DatumEnde;
  const menge = post.AG_Menge;
  const abnehmer = post.Person_P_ID;

  const sql = "UPDATE `Abgabe` SET AG_DatumBeginn = '" + anfangsdatum + "', AG_DatumEnde = '" + enddatum + "', AG_Menge = '" + menge + "', Person_P_ID = '" + abnehmer + "' WHERE AG_ID = " + id + ";";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/buchen/abgaben');
  })();

  //res.redirect('/buchen/abgaben');
};

// ---------- Abgabe löschen ----------
exports.delete = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.AG_ID;

  const sql = "DELETE FROM `Naehrstoff_Abgabe` WHERE Abgabe_AG_ID = '" + id + "';DELETE FROM `Abgabe` WHERE AG_ID = '" + id + "'";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/buchen/abgaben');
  })();

  //res.redirect('/buchen/abgaben');
};