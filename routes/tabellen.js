const bc = require('../eigene_module/benutzer_checken');
// Gebuchte Zugänge
exports.abgaben = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = 'SELECT AG_ID AS ID, DATE_FORMAT(AG_DatumBeginn, "%d.%m.%y") AS Anfangsdatum, DATE_FORMAT(AG_DatumEnde, "%d.%m.%y") AS Enddatum, AG_Menge AS Menge, B_Name As Abnehmer FROM Abgabe, Person  WHERE Person_P_ID = P_ID  ORDER BY AG_ID DESC ';
  const logText = "Abgaben";

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