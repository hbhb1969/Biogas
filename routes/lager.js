const bc = require('../eigene_module/benutzer_checken');
const qa = require('../eigene_module/queryAsync');
// ---------- Zugänge: Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  const fetch = require('node-fetch');
  const user = req.session.user,
    userId = req.session.userId;

  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können

  let stoffOptions = "";
  let buchungenLager = "";
  fetch("http://localhost:8080/select/lagerrohstoff", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        stoffOptions += " <option value=" + row.S_ID + " meid=" + row.Mengeneinheit_ME_ID + " mebez=" + row.ME_Bezeichnung + ">" + row.S_Bezeichnung + "</option>";
      }
    })
    .then(function() {
      fetch("http://localhost:8080/tabellen/lager", options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            buchungenLager +=
              "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Lager + "</td><td>" + row.Rohstoff + "</td><td class='t-rechts'>" + row.Bestand + "</td><td>" + row.Einheit + "</td></tr>";
          }
        })

        .then(function(json) {
          res.render('lager.ejs', {
            user: user,
            message: message,
            stoffOptions: stoffOptions,
            buchungenLager: buchungenLager
          });
        })
    })

    .catch(function(error) {
      logger.error(error);
    })
};

// ---------- Zugänge buchen ----------
exports.post = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const lagername = post.L_Name;
  const lagerrohstoff = post.S_Bezeichnung;
  const lagerbestand = post.L_Bestand;

  const sql = "INSERT INTO `Lager`(`L_Name`,`Stoff_S_ID`,`L_Bestand`) VALUES ('" + lagername + "','" + lagerrohstoff + "','" + lagerbestand + "')";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/lager');
};

// ---------- Zugänge ändern ----------
exports.put = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.L_ID;
  const lagername = post.L_Name;
  const lagerrohstoff = post.S_Bezeichnung;
  const lagerbestand = post.L_Bestand;

  const sql = "UPDATE `Lager` SET L_Name = '" + lagername + "', L_Bestand = '" + lagerbestand + "', Stoff_S_ID ='" + lagerrohstoff + "' WHERE L_ID = " + id + ";";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/lager');
};