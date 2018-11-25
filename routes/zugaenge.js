const qa = require('../eigene_module/query');
const fetch = require('node-fetch');

// ---------- Zugänge: Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  let message = '';
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let headerClass = "zugaenge";
  let headerTitel = "Zugänge";
  let headerBild = "zugaenge.svg ";
  let lagerOptions = "";
  let lieferantenOptions = "";
  let buchungenZugaenge = "";
  fetch('https://localhost:8081/select/lager', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        lagerOptions += " <option value=" + row.L_ID + " meid=" + row.ME_ID + " mebez=" + row.ME_Bezeichnung + ">" + row.L_Name + "</option>";
      }
    })
    .then(() => {
      fetch('https://localhost:8081/select/lieferant', {
          credentials: 'include'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(json => {
          for (let row of json) {
            lieferantenOptions +=
              "<option value=" + row.P_ID + ">" + row.B_Name + "</option> ";
          }
        })
        .then(() => {
          fetch('https://localhost:8081/tabellen/zugaenge', {
              credentials: 'include'
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              }
            })
            .then(json => {
              for (let row of json) {
                buchungenZugaenge +=
                  "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Datum + "</td><td class='t-rechts'>" + row.Menge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "</td><td>" + row.Einheit + "</td><td>" + row.Lager + "</td><td>" + row.Lieferant + "</td></tr>";
              }
            })

            .then(json => {
              res.render('zugaenge.ejs', {
                message: message,
                headerClass: headerClass,
                headerTitel: headerTitel,
                headerBild: headerBild,
                lagerOptions: lagerOptions,
                lieferantenOptions: lieferantenOptions,
                buchungenZugaenge: buchungenZugaenge
              });
            })
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
  const datum = post.Z_Datum;
  const menge = post.Z_BruttoMenge;
  const lager = post.Lager_L_ID;
  const lieferant = post.Person_P_ID;

  const sql = "INSERT INTO `Zugang`(`Z_Datum`,`Z_BruttoMenge`,`Lager_L_ID`,`Person_P_ID`) VALUES ('" + datum + "','" + menge + "','" + lager + "','" + lieferant + "')";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/buchen/zugaenge');
  })();

  //res.redirect('/buchen/zugaenge');
};

// ---------- Zugänge ändern ----------
exports.put = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.Z_ID;
  const datum = post.Z_Datum;
  const menge = post.Z_BruttoMenge;
  const lager = post.Lager_L_ID;
  const lieferant = post.Person_P_ID;

  const sql = "UPDATE `Zugang` SET Z_Datum = '" + datum + "', Z_BruttoMenge = '" + menge + "', Lager_L_ID ='" + lager + "', Person_P_ID = '" + lieferant + "' WHERE Z_ID = " + id + ";";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/buchen/zugaenge');
  })();

  //res.redirect('/buchen/zugaenge');
};

// ---------- Zugang löschen ----------
exports.delete = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.Z_ID;

  const sql = "DELETE FROM `Naehrstoff_N_Eingang` WHERE N_Eingang_NE_ID IN (SELECT NE_ID FROM `N_Eingang` WHERE Zugang_Z_ID = '" + id + "'); DELETE FROM `N_Eingang` WHERE Zugang_Z_ID = '" + id + "';DELETE FROM `Zugang` WHERE Z_ID = '" + id + "'";
  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
    res.redirect('/buchen/zugaenge');
  })();

  //res.redirect('/buchen/zugaenge');
};