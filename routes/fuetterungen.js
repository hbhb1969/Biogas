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
  let direktOptions = "";
  let buchungenFuetterungenLager = "";
  let buchungenFuetterungenDirekt = "";
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
      fetch("http://localhost:8080/select/direktrohstoff", options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            direktOptions += "<option value=" + row.S_ID + " meid=" + row.ME_ID + " mebez=" + row.ME_Bezeichnung + ">" + row.S_Bezeichnung + "</option>";
          }
        })
        .then(function() {
          fetch("http://localhost:8080/tabellen/fuetterungenlager", options)
            .then(function(response) {
              if (response.ok) {
                return response.json();
              }
            })
            .then(function(json) {
              for (let row of json) {
                buchungenFuetterungenLager +=
                  "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Datum + "</td><td class='t-rechts'>" + row.Menge + "</td><td>" + row.Einheit + "</td><td>" + row.Lager + "</td></tr>";
              }
            })
            .then(function() {
              fetch("http://localhost:8080/tabellen/fuetterungendirekt", options)
                .then(function(response) {
                  if (response.ok) {
                    return response.json();
                  }
                })
                .then(function(json) {
                  for (let row of json) {
                    buchungenFuetterungenDirekt +=
                      "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Datum + "</td><td class='t-rechts'>" + row.Menge + "</td><td>" + row.Einheit + "</td><td>" + row.Stoff + "</td></tr>";
                  }
                })

                .then(function(json) {
                  res.render('fuetterungen.ejs', {
                    user: user,
                    message: message,
                    lagerOptions: lagerOptions,
                    direktOptions: direktOptions,
                    buchungenFuetterungenLager: buchungenFuetterungenLager,
                    buchungenFuetterungenDirekt: buchungenFuetterungenDirekt
                  });
                })
            })
            .catch(function(error) {
              logger.error(error);
            })
        })
    })
}


// ---------- Zugänge buchen ----------
exports.post = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body,
    bga = 1,
    datum = post.F_Datum,
    menge = post.F_BruttoMenge,
    lager = post.Lager_L_ID,
    stoff = post.Stoff_S_ID,
    lagerRadio = post.Stoffart;
  logger.info('lagerRadio: ' + lagerRadio);
  let sql = '';
  if (lagerRadio == 'lager') {
    sql = "INSERT INTO `Fuetterung`(`Biogasanlage_BGA_ID`,`F_Datum`,`F_BruttoMenge`,`Lager_L_ID`) VALUES ('" + bga + "','" + datum + "','" + menge + "','" + lager + "')";
    logger.info(sql);
  } else {
    sql = "INSERT INTO `Fuetterung`(`Biogasanlage_BGA_ID`,`F_Datum`,`F_BruttoMenge`,`Stoff_S_ID`) VALUES ('" + bga + "','" + datum + "','" + menge + "','" + stoff + "')";
    logger.info(sql);
  };
  // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
  // neu aus der Datenbank ausgelesen werden
  const fuetterungbuchen = async function() {
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
    await fuetterungbuchen();
  })();

  res.redirect('/buchen/fuetterungen');
};

// // ---------- Zugänge ändern ----------
// exports.put = function(req, res, next) {
//   let message = '';
//   const user = req.session.user,
//     userId = req.session.userId;
//
//   if (userId == null) {
//     res.redirect("/anmelden");
//     return;
//   }
//   const post = req.body;
//   const id = post.Z_ID;
//   const datum = post.Z_Datum;
//   const menge = post.Z_BruttoMenge;
//   const lager = post.Lager_L_ID;
//   const lieferant = post.Person_P_ID;
//
//   const sql = "UPDATE `Zugang` SET Z_Datum = '" + datum + "', Z_BruttoMenge = '" + menge + "', Lager_L_ID ='" + lager + "', Person_P_ID = '" + lieferant + "' WHERE Z_ID = " + id + ";";
//   logger.info(sql);
//
//   // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
//   // neu aus der Datenbank ausgelesen werden
//   const zugangbuchen = async function() {
//     try {
//       const query = db.query(sql, function(err, result) {
//         if (err) {
//           logger.error(err);
//         }
//       });
//     } catch (ex) {
//       logger.error(ex);
//     }
//   };
//   (async () => {
//     await zugangbuchen();
//   })();
//
//   res.redirect('/buchen/zugaenge');
// };
//
// // ---------- Zugang löschen ----------
// exports.delete = function(req, res, next) {
//   let message = '';
//   const user = req.session.user,
//     userId = req.session.userId;
//
//   if (userId == null) {
//     res.redirect("/anmelden");
//     return;
//   }
//   const post = req.body;
//   const id = post.Z_ID;
//
//   const sql = "DELETE FROM `Zugang` WHERE Z_ID = '" + id + "'";
//   logger.info(sql);
//
//   // Durch die asynchrone Funktion zugangbuchen kann mit await auf das Ende der Buchung gewartet werden, bevor die Buchungen
//   // neu aus der Datenbank ausgelesen werden
//   const zugangloeschen = async function() {
//     try {
//       const query = db.query(sql, function(err, result) {
//         if (err) {
//           logger.error(err);
//         }
//       });
//     } catch (ex) {
//       logger.error(ex);
//     }
//   };
//   (async () => {
//     await zugangloeschen();
//   })();
//
//   res.redirect('/buchen/zugaenge');
//};