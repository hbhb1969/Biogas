const bc = require('../eigene_module/benutzer_checken');
const qa = require('../eigene_module/queryAsync');

// ---------- Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  let nBilanz = '';
  const anfangsdatum = '';
  const enddatum = '';
  const fetch = require('node-fetch');
  const user = req.session.user,
    userId = req.session.userId;

  res.render('bilanz.ejs', {
    anfangsdatum: anfangsdatum,
    enddatum: enddatum,
    message: message,
    nBilanz: nBilanz
  });
};

// ---------- Bilanz anzeigen ----------
exports.post = function(req, res, next) {
  let message = '';
  let nBilanz = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  let anfangsdatum = post.Anfangsdatum;
  let enddatum = post.Enddatum;
  anfangsdatum = anfangsdatum.split('-')[2] + '.' + anfangsdatum.split('-')[1] + '.' + anfangsdatum.split('-')[0];
  enddatum = enddatum.split('-')[2] + '.' + enddatum.split('-')[1] + '.' + enddatum.split('-')[0];


  // Parameterübergabe
  // https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters







  // const anfangsdatum = post.AG_DatumBeginn;
  // const enddatum = post.AG_DatumEnde;
  // const menge = post.AG_Menge;
  // const abnehmer = post.Person_P_ID;
  //   const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt
  //
  // const sql = "INSERT INTO `Abgabe`(`AG_DatumBeginn`,`AG_DatumEnde`,`AG_Menge`,`Biogasanlage_BGA_ID`,`Stoff_S_ID`,`Person_P_ID`) VALUES ('" + anfangsdatum + "','" + enddatum + "','" + menge + "', '1', '1','" + abnehmer + "')";
  // logger.info(sql);
  // (async () => {
  //   await qa.queryAsync(sql);
  // })();

  res.render('bilanz.ejs', {
    nBilanz: nBilanz,
    anfangsdatum: anfangsdatum,
    enddatum: enddatum,
    message: message
  });
};