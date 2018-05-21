const bc = require('../eigene_module/benutzer_checken');
// ---------- Zugänge: Vorbereitung Formular ----------
exports.get = function(req, res, next) {
  let message = '';
  const fetch = require('node-fetch');
  const user = req.session.user,
    userId = req.session.userId;

  const options = bc.sessionBenutzerChecken(user, userId, res); // options werden für fetch benötigt
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let lagerOptions = "";
  let lieferantenOptions = "";
  let buchungenZugaenge = "";
  fetch("http://localhost:8080/select/lager", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        lagerOptions += " <option value=" + row.L_ID + " meid=" + row.ME_ID + " mebez=" + row.ME_Bezeichnung + ">" + row.L_Name + "</option>";
      }
    })
    .then(function() {
      fetch("http://localhost:8080/select/lieferant", options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            lieferantenOptions +=
              "<option value=" + row.P_ID + ">" + row.B_Name + "</option> ";
          }
        })
        .then(function() {
          fetch("http://localhost:8080/tabellen/zugaenge", options)
            .then(function(response) {
              if (response.ok) {
                return response.json();
              }
            })
            .then(function(json) {
              for (let row of json) {
                buchungenZugaenge +=
                  "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Datum + "</td><td class='t-rechts'>" + row.Menge + "</td><td>" + row.Einheit + "</td><td>" + row.Lager + "</td><td>" + row.Lieferant + "</td></tr>";
              }
            })

            .then(function(json) {
              res.render('zugaenge.ejs', {
                user: user,
                message: message,
                lagerOptions: lagerOptions,
                lieferantenOptions: lieferantenOptions,
                buchungenZugaenge: buchungenZugaenge
              });
            })
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
  const datum = post.Z_Datum;
  const menge = post.Z_BruttoMenge;
  const lager = post.Lager_L_ID;
  const lieferant = post.Person_P_ID;

  const sql = "INSERT INTO `Zugang`(`Z_Datum`,`Z_BruttoMenge`,`Lager_L_ID`,`Person_P_ID`) VALUES ('" + datum + "','" + menge + "','" + lager + "','" + lieferant + "')";
  logger.info(sql);
  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const zugangbuchen = async function() {
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
    await zugangbuchen();
  })();

  res.redirect('/buchen/zugaenge');
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
  const id = post.Z_ID;
  const datum = post.Z_Datum;
  const menge = post.Z_BruttoMenge;
  const lager = post.Lager_L_ID;
  const lieferant = post.Person_P_ID;

  const sql = "UPDATE `Zugang` SET Z_Datum = '" + datum + "', Z_BruttoMenge = '" + menge + "', Lager_L_ID ='" + lager + "', Person_P_ID = '" + lieferant + "' WHERE Z_ID = " + id + ";";
  logger.info(sql);

  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const zugangbuchen = async function() {
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
    await zugangbuchen();
  })();

  res.redirect('/buchen/zugaenge');
};

// ---------- Zugang löschen ----------
exports.delete = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.Z_ID;

  const sql = "DELETE FROM `Naehrstoff_N_Eingang` WHERE N_Eingang_NE_ID IN (SELECT NE_ID FROM `N_Eingang` WHERE Zugang_Z_ID = '" + id + "'); DELETE FROM `N_Eingang` WHERE Zugang_Z_ID = '" + id + "';DELETE FROM `Zugang` WHERE Z_ID = '" + id + "'";
  logger.info(sql);

  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const zugangloeschen = async function() {
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
    await zugangloeschen();
  })();

  res.redirect('/buchen/zugaenge');
};