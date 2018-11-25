const qa = require('../eigene_module/query');
// ---------- Zugänge: Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  let message = '';
  let headerClass = "lager";
  let headerTitel = "Lager";
  let headerBild = "lager.svg ";
  const fetch = require('node-fetch');
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können

  let stoffOptions = "";
  let buchungenLager = "";
  fetch('https://localhost:8081/select/lagerrohstoff', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        stoffOptions += " <option value=" + row.S_ID + " meid=" + row.Mengeneinheit_ME_ID + " mebez=" + row.ME_Bezeichnung + ">" + row.S_Bezeichnung + "</option>";
      }
    })
    .then(() => {
      fetch('https://localhost:8081/tabellen/lager', {
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(json => {
          for (let row of json) {
            buchungenLager +=
              "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Lager + "</td><td>" + row.Rohstoff + "</td><td class='t-rechts'>" + row.Bestand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td>" + row.Einheit + "</td></tr>";
          }
        })

        .then(json => {
          res.render('lager.ejs', {
            message: message,
            headerClass: headerClass,
            headerTitel: headerTitel,
            headerBild: headerBild,
            stoffOptions: stoffOptions,
            buchungenLager: buchungenLager
          });
        })
    })

    .catch(error => {
      logger.error(error);
    })
};

// ---------- Zugänge buchen ----------
exports.post = (req, res, next) => {
  let message = '';
  const post = req.body;
  const lagername = post.L_Name;
  const lagerrohstoff = post.S_Bezeichnung;
  const lagerbestand = post.L_Bestand;

  const sql = "INSERT INTO `Lager`(`L_Name`,`Stoff_S_ID`,`L_Bestand`) VALUES ('" + lagername + "','" + lagerrohstoff + "','" + lagerbestand + "')";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/daten/lager');
  })();

  //res.redirect('/daten/lager');
};

// ---------- Zugänge ändern ----------
exports.put = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.L_ID;
  const lagername = post.L_Name;
  const lagerrohstoff = post.S_Bezeichnung;
  const lagerbestand = post.L_Bestand;

  const sql = "UPDATE `Lager` SET L_Name = '" + lagername + "', L_Bestand = '" + lagerbestand + "', Stoff_S_ID ='" + lagerrohstoff + "' WHERE L_ID = " + id + ";";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/daten/lager');
  })();

  //res.redirect('/daten/lager');
};