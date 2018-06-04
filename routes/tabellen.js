const bc = require('../eigene_module/benutzer_checken');
// Gebuchte Zugänge
exports.abgaben = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = 'SELECT AG_ID AS ID, DATE_FORMAT(AG_DatumBeginn, "%d.%m.%y") AS Anfangsdatum, DATE_FORMAT(AG_DatumEnde, "%d.%m.%y") AS Enddatum, AG_Menge AS Menge, B_Name As Abnehmer FROM Abgabe, Person  WHERE Person_P_ID = P_ID  ORDER BY AG_ID DESC ';
  const logText = "Abgaben";

  sqlQuery(res, sql, logText)
};

exports.bilanz = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);
  let anfangsdatum = req.query.anfangsdatum;
  let enddatum = req.query.enddatum;

  const sql = "SELECT NS_Abgabe AS Naehrstoff, z.Zugangsmenge + f.Zugangsmenge AS Zugang, Abgabemenge AS Abgang, z.Zugangsmenge + f.Zugangsmenge - Abgabemenge AS Saldo FROM ( SELECT N_Bezeichnung AS NS_Zugang, SUM(N_Menge) AS Zugangsmenge FROM `Naehrstoff`, `Naehrstoff_N_Eingang`, `N_Eingang`, `Zugang` WHERE Z_Datum <= '2018-07-14' AND Z_Datum >= '2018-07-01' AND N_ID = Naehrstoff_N_ID	AND NE_ID = N_Eingang_NE_ID AND Z_ID = Zugang_Z_ID GROUP BY N_Bezeichnung ORDER BY N_Bezeichnung ) z, ( SELECT N_Bezeichnung AS NS_Zugang, SUM(N_Menge) AS Zugangsmenge FROM `Naehrstoff`, `Naehrstoff_N_Eingang`, `N_Eingang`, `Fuetterung` WHERE F_Datum <= '2018-07-14' 	AND F_Datum >= '" + anfangsdatum + "' AND N_ID = Naehrstoff_N_ID AND NE_ID = N_Eingang_NE_ID AND F_ID = Fuetterung_F_ID GROUP BY N_Bezeichnung ORDER BY N_Bezeichnung ) f, ( SELECT N_Bezeichnung AS NS_Abgabe, SUM(N_Menge) AS Abgabemenge FROM `Naehrstoff`, `Naehrstoff_Abgabe`, `Abgabe` WHERE AG_DatumEnde <= '2018-07-14' AND AG_DatumEnde >= '" + anfangsdatum + "' AND N_ID = Naehrstoff_N_ID AND AG_ID = Abgabe_AG_ID GROUP BY N_Bezeichnung ORDER BY N_Bezeichnung ) a WHERE z.NS_Zugang = f.NS_Zugang AND z.NS_Zugang = NS_Abgabe ORDER BY NS_Abgabe";
  const logText = "Bilanzdaten";

  sqlQuery(res, sql, logText)
};
exports.fuetterungenlager = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = 'SELECT F_ID AS ID, DATE_FORMAT(F_Datum, "%d.%m.%y") AS Datum, S_Bezeichnung AS Stoff, F_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit, L_Name AS Lager FROM Fuetterung, Stoff, Mengeneinheit, Lager WHERE Lager_L_ID = L_ID AND Mengeneinheit_ME_ID = ME_ID AND Lager.Stoff_S_ID = S_ID ORDER BY F_ID DESC';
  const logText = "Fütterungen Lager";

  sqlQuery(res, sql, logText)
};

exports.fuetterungendirekt = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = 'SELECT F_ID AS ID, DATE_FORMAT(F_Datum, "%d.%m.%y") AS Datum, S_Bezeichnung AS Stoff, F_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit FROM Fuetterung, Stoff, Mengeneinheit WHERE Lager_L_ID IS NULL AND Fuetterung.Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID ORDER BY F_ID DESC';
  const logText = "Fütterungen Direkt";

  sqlQuery(res, sql, logText)
};

exports.zugaenge = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = 'SELECT Z_ID AS ID, DATE_FORMAT(Z_Datum, "%d.%m.%y") AS Datum, Z_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit, L_Name AS Lager, B_Name As Lieferant FROM Zugang, Stoff, Mengeneinheit, Lager, Person  WHERE Lager_L_ID = L_ID AND Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID AND Person_P_ID = P_ID  ORDER BY Z_ID DESC ';
  const logText = "Zugänge";

  sqlQuery(res, sql, logText)
};

function sqlQuery(res, sql, logText) {
  db.query(sql, function(err, rows) {
    if (err) {
      logger.error(err);
    }
    if (rows) {
      logger.info(logText + ': err: ' + err + ', rows: ' + rows.length);
      res.json(rows);
    } else {
      logger.warn('Keine ' + logText + ' gefunden: err:' + err);
      res.json(rows); // bei Select wird in diesem Fall zum Hauptmenü umgeleitet
    }
  });
}