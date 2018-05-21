const bc = require('../eigene_module/benutzer_checken');
// ---------- Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  const fetch = require('node-fetch');
  const user = req.session.user,
    userId = req.session.userId;

  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let abnehmerOptions = "";
  let buchungenAbgaben = "";
  fetch("http://localhost:8080/select/abnehmer", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        abnehmerOptions +=
          "<option value=" + row.P_ID + ">" + row.B_Name + "</option> ";
      }
    })
    .then(function() {
      fetch("http://localhost:8080/tabellen/abgaben", options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            buchungenAbgaben +=
              "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Anfangsdatum + "</td><td>" + row.Enddatum + "</td><td class='t-rechts'>" + row.Menge + "</td><td>" + row.Abnehmer + "</td></tr>";
          }
        })
        .then(function(json) {
          res.render('abgaben.ejs', {
            user: user,
            message: message,
            abnehmerOptions: abnehmerOptions,
            buchungenAbgaben: buchungenAbgaben
          });
        })
    })
    .catch(function(error) {
      logger.error(error);
    })
};

// ---------- Abgabe buchen ----------
exports.post = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const anfangsdatum = post.AG_DatumBeginn;
  const enddatum = post.AG_DatumEnde;
  const menge = post.AG_Menge;
  const abnehmer = post.Person_P_ID;

  const sql = "INSERT INTO `Abgabe`(`AG_DatumBeginn`,`AG_DatumEnde`,`AG_Menge`,`Biogasanlage_BGA_ID`,`Stoff_S_ID`,`Person_P_ID`) VALUES ('" + anfangsdatum + "','" + enddatum + "','" + menge + "', '1', '1','" + abnehmer + "')";
  logger.info(sql);
  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const abgabeBuchen = async function() {
    try {
      const query = db.query(sql, function(err, result) {
        if (err) {
          logger.error(err);
        }
      });
    } catch (ex) {
      logger.error(ex);
    }
  };
  (async () => {
    await abgabeBuchen();
  })();

  res.redirect('/buchen/abgaben');
};

// ---------- Abgabe ändern ----------
exports.put = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.AG_ID;
  const anfangsdatum = post.AG_DatumBeginn;
  const enddatum = post.AG_DatumEnde;
  const menge = post.AG_Menge;
  const abnehmer = post.Person_P_ID;

  const sql = "UPDATE `Abgabe` SET AG_DatumBeginn = '" + anfangsdatum + "', AG_DatumEnde = '" + enddatum + "', AG_Menge = '" + menge + "', Person_P_ID = '" + abnehmer + "' WHERE AG_ID = " + id + ";";
  logger.info(sql);

  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const abgabeBuchen = async function() {
    try {
      const query = db.query(sql, function(err, result) {
        if (err) {
          logger.error(err);
        }
      });
    } catch (ex) {
      logger.error(ex);
    }
  };
  (async () => {
    await abgabeBuchen();
  })();

  res.redirect('/buchen/abgaben');
};

// ---------- Abgabe löschen ----------
exports.delete = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.AG_ID;

  const sql = "DELETE FROM `Naehrstoff_Abgabe` WHERE Abgabe_AG_ID = '" + id + "';DELETE FROM `Abgabe` WHERE AG_ID = '" + id + "'";
  logger.info(sql);

  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const abgabeLoeschen = async function() {
    try {
      const query = db.query(sql, function(err, result) {
        if (err) {
          logger.error(err);
        }
      });
    } catch (ex) {
      logger.error(ex);
    }
  };
  (async () => {
    await abgabeLoeschen();
  })();

  res.redirect('/buchen/abgaben');
};