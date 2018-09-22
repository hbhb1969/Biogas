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
  let headerClass = "rohstoffe";
  let headerTitel = "Rohstoffe";
  let headerBild = "rohstoffe.svg ";
  let meOptions = "";
  let lieferantOptions = "";
  let buchungenLagerRohstoffe = "";
  let buchungenDirektRohstoffe = "";
  fetch("https://localhost:8081/select/mengeneinheit", options)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      for (let row of json) {
        meOptions += " <option value=" + row.ME_ID + ">" + row.ME_Bezeichnung + "</option>";
      }
    })
    .then(function() {
      fetch("https://localhost:8081/select/lieferant", options)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(json) {
          for (let row of json) {
            lieferantOptions += "<option value=" + row.P_ID + ">" + row.B_Name + "</option>";
          }
        })
        .then(function() {
          fetch("https://localhost:8081/tabellen/stoffelager", options)
            .then(function(response) {
              if (response.ok) {
                return response.json();
              }
            })
            .then(function(json) {
              for (let row of json) {
                buchungenLagerRohstoffe +=
                  "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Lagerrohstoff + "</td><td>" + row.Einheit + "</td></tr>";
              }
            })
            .then(function() {
              fetch("https://localhost:8081/tabellen/stoffedirekt", options)
                .then(function(response) {
                  if (response.ok) {
                    return response.json();
                  }
                })
                .then(function(json) {
                  for (let row of json) {
                    buchungenDirektRohstoffe +=
                      "<tr><td class='t-id'>" + row.S_ID + "</td><td class='t-id'>" + row.P_ID + "</td><td>" + row.Direktrohstoff + "</td><td>" + row.Einheit + "</td><td>" + row.Lieferant + "</td></tr>";
                  }
                })

                .then(function(json) {
                  res.render('rohstoffe.ejs', {
                    user: user,
                    message: message,
                    headerClass: headerClass,
                    headerTitel: headerTitel,
                    headerBild: headerBild,
                    meOptions: meOptions,
                    lieferantOptions: lieferantOptions,
                    buchungenLagerRohstoffe: buchungenLagerRohstoffe,
                    buchungenDirektRohstoffe: buchungenDirektRohstoffe
                  });
                })
            })
            .catch(function(error) {
              logger.error(error);
            })
        })
    })
}


// ---------- Rohstoff buchen ----------
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
    name = post.S_Bezeichnung,
    mengeneinheit = post.Mengeneinheit_ME_ID,
    lieferant = post.Person_P_ID,
    lagerRadio = post.Stoffart;
  let sql = '';
  if (lagerRadio == 'lager') {
    sql = "INSERT INTO `Stoff`(`S_Bezeichnung`,`Mengeneinheit_ME_ID`,`Stofftyp`) VALUES ('" + name + "','" + mengeneinheit + "','Lagerrohstoff')";
    logger.info(sql);
  } else {
    sql = sql = "INSERT INTO `Stoff`(`S_Bezeichnung`,`Mengeneinheit_ME_ID`,`Stofftyp`) VALUES ('" + name + "','" + mengeneinheit + "','Direktrohstoff'); INSERT INTO Stoff_Person (Stoff_S_ID, Person_P_ID) VALUES ((SELECT S_ID FROM Stoff WHERE S_Bezeichnung = '" + name + "' ), " + lieferant + ")";
    logger.info(sql);
  };
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/rohstoffe');
};

// ---------- Rohstoff ändern ----------
exports.put = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const post = req.body;
  const id = post.S_ID,
    name = post.S_Bezeichnung,
    mengeneinheit = post.Mengeneinheit_ME_ID,
    lieferant = post.Person_P_ID,
    lagerRadio = post.Stoffart;
  let sql = '';

  if (lagerRadio == 'lager') {
    sql = "UPDATE `Stoff` SET S_Bezeichnung = '" + name + "', Mengeneinheit_ME_ID = '" + mengeneinheit + "' WHERE S_ID = '" + id + "';";
    logger.info(sql);
  } else {
    sql = "UPDATE `Stoff` SET S_Bezeichnung = '" + name + "', Mengeneinheit_ME_ID = '" + mengeneinheit + "' WHERE S_ID = '" + id + "'; UPDATE Stoff_Person SET Stoff_S_ID = '" + id + "', Person_P_ID = '" + lieferant + "' WHERE Stoff_S_ID = '" + id + "'";
    logger.info(sql);
  }
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/rohstoffe');
};