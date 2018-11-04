const qa = require('../eigene_module/query');
// ---------- Zugänge: Vorbereitung Formular ----------
exports.get = (req, res, next) => {
  let message = '';
  const fetch = require('node-fetch');
  // Variablen werden mit HTML-Code für Selects und Tables gefüllt, damit sie später dem Template übergeben werden können
  let headerClass = "betriebe";
  let headerTitel = "Betriebe";
  let headerBild = "betriebe.svg ";
  let buchungenBetriebe = "";

  fetch('https://localhost:8081/tabellen/betriebe', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(json => {
      for (let row of json) {
        buchungenBetriebe +=
          "<tr><td class='t-id'>" + row.ID + "</td><td>" + row.Betrieb + "</td><td>" + row.Betriebsnummer + "</td><td class='nodisplay'>" + row.GPT_ID + "</td><td class='nodisplay'>" + row.AD_ID + "</td><td class='nodisplay'>" + row.AD_Strasse + "</td><td class='nodisplay'>" + row.AD_Postfach + "</td><td class='nodisplay'>" + row.AD_PLZ + "</td><td class='nodisplay'>" + row.AD_Ort + "</td></tr>";
      }
    })

    .then(json => {
      res.render('betriebe.ejs', {
        message: message,
        headerClass: headerClass,
        headerTitel: headerTitel,
        headerBild: headerBild,
        buchungenBetriebe: buchungenBetriebe
      });
    })

    .catch(error => {
      logger.error(error);
    })
};

// ---------- Zugänge buchen ----------
exports.post = (req, res, next) => {
  let message = '';
  const post = req.body;
  const betrieb = post.B_Name;
  const betriebsnummer = post.B_Nummer;
  const lieferant = post.lieferant;
  const abnehmer = post.abnehmer;
  const strasse = post.AD_Strasse;
  const postfach = post.AD_Postfach;
  const plz = post.AD_PLZ;
  const ort = post.AD_Ort;
  let gpTyp = 3;

  if (lieferant == "lieferant") {
    if (abnehmer != "abnehmer") {
      gpTyp = 2;
    }
  } else {
    gpTyp = 1;
  }

  const sql = "INSERT INTO `Person`(`B_Nummer`,`B_Name`,`Geschaeftsp_Typ_GPT_ID`,`Personentyp`) VALUES ('" + betriebsnummer + "','" + betrieb + "','" + gpTyp + "','Betrieb'); INSERT INTO Adresse (`AD_Strasse`,`AD_Postfach`,`AD_PLZ`,`AD_Ort`) VALUES ('" + strasse + "','" + postfach + "','" + plz + "','" + ort + "'); INSERT INTO Person_Adresse (Person_P_ID, Adresse_AD_ID) VALUES((SELECT MAX(P_ID) FROM Person), (SELECT MAX(AD_ID) FROM Adresse)";
  logger.info(sql);
  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/betriebe');
};

// ---------- Zugänge ändern ----------
exports.put = (req, res, next) => {
  let message = '';
  const post = req.body;
  const id = post.P_ID
  const betrieb = post.B_Name;
  const betriebsnummer = post.B_Nummer;
  const lieferant = post.lieferant;
  const abnehmer = post.abnehmer;
  const adressId = post.AD_ID
  const strasse = post.AD_Strasse;
  const postfach = post.AD_Postfach;
  const plz = post.AD_PLZ;
  const ort = post.AD_Ort;
  let gpTyp = 3;

  if (lieferant == "lieferant") {
    if (abnehmer != "abnehmer") {
      gpTyp = 2;
    }
  } else {
    gpTyp = 1;
  }

  const sql = "UPDATE `Person` SET B_Nummer = '" + betriebsnummer + "', B_Name = '" + betrieb + "', Geschaeftsp_Typ_GPT_ID = '" + gpTyp + "' WHERE P_ID = " + id + "; UPDATE `Adresse` SET AD_Strasse = '" + strasse + "', AD_Postfach = '" + postfach + "', AD_PLZ = '" + plz + "', AD_Ort = '" + ort + "' WHERE AD_ID =" + adressId + "; ";

  logger.info(sql);

  (async () => {
    await qa.queryAsync(sql);
  })();

  res.redirect('/daten/betriebe');
};