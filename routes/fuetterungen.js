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
  let headerClass = "fuetterungen";
  let headerTitel = "Fütterungen";
  let headerBild = "fuetterungen.svg ";
  let lagerOptions = "";
  let direktOptions = "";
  let buchungenFuetterungenLager = "";
  let buchungenFuetterungenDirekt = "";
  fetch("https://localhost:8081/select/lager", options)
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
      fetch("https://localhost:8081/select/direktrohstoff", options)
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
          fetch("https://localhost:8081/tabellen/fuetterungenlager", options)
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
              fetch("https://localhost:8081/tabellen/fuetterungendirekt", options)
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
                    headerClass: headerClass,
                    headerTitel: headerTitel,
                    headerBild: headerBild,
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
  let sql = '';
  if (lagerRadio == 'lager') {
    sql = "INSERT INTO `Fuetterung`(`Biogasanlage_BGA_ID`,`F_Datum`,`F_BruttoMenge`,`Lager_L_ID`) VALUES ('" + bga + "','" + datum + "','" + menge + "','" + lager + "')";
    logger.info(sql);
  } else {
    sql = "INSERT INTO `Fuetterung`(`Biogasanlage_BGA_ID`,`F_Datum`,`F_BruttoMenge`,`Stoff_S_ID`) VALUES ('" + bga + "','" + datum + "','" + menge + "','" + stoff + "')";
    logger.info(sql);
  };
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/buchen/fuetterungen');
};

// ---------- Fütterung ändern ----------
exports.put = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.F_ID;
  const datum = post.F_Datum;
  const menge = post.F_BruttoMenge;
  const lager = post.Lager_L_ID;
  const stoff = post.Stoff_S_ID;
  const lagerRadio = post.Stoffart;
  let sql = '';

  if (lagerRadio == 'lager') {
    sql = "UPDATE `Fuetterung` SET F_Datum = '" + datum + "', F_BruttoMenge = '" + menge + "', Lager_L_ID ='" + lager + "' WHERE F_ID = " + id + ";";
    logger.info(sql);
  } else {
    sql = "UPDATE `Fuetterung` SET F_Datum = '" + datum + "', F_BruttoMenge = '" + menge + "', Stoff_S_ID ='" + stoff + "' WHERE F_ID = " + id + ";";
    logger.info(sql);
  }
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/buchen/fuetterungen');
};

// ---------- Fuetterung löschen ----------
exports.delete = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.F_ID;

  const sql = "DELETE FROM `Naehrstoff_N_Eingang` WHERE N_Eingang_NE_ID IN (SELECT NE_ID FROM `N_Eingang` WHERE Fuetterung_F_ID = '" + id + "'); DELETE FROM `N_Eingang` WHERE Fuetterung_F_ID = '" + id + "';DELETE FROM `Fuetterung` WHERE F_ID = '" + id + "'";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/buchen/fuetterungen');
};