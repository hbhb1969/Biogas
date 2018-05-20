const bc = require('../eigene_module/benutzer_checken');
// Optionen für Abnehmer
exports.abnehmer = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = "SELECT P_ID, B_Name FROM `Person` WHERE Geschaeftsp_Typ_GPT_ID = 1 OR Geschaeftsp_Typ_GPT_ID = 3 ORDER BY B_Name";
  const logText = "Abnehmer";

  sqlQuery(res, sql, logText)
};

// Optionen für Direktrohstoffe
exports.direktrohstoff = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = "SELECT S_ID, S_Bezeichnung, ME_ID, ME_Bezeichnung FROM `Mengeneinheit`, `Stoff` WHERE Stofftyp = 'Direktrohstoff' AND Mengeneinheit_ME_ID = ME_ID  ORDER BY S_Bezeichnung ";
  const logText = "Direktrohstoffe";

  sqlQuery(res, sql, logText)
};

// Optionen für Lager
exports.lager = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = "SELECT L_ID, L_Name, ME_ID, ME_Bezeichnung FROM `Lager`, `Mengeneinheit`, `Stoff` WHERE Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID  ORDER BY L_Name ";
  const logText = "Lager";

  sqlQuery(res, sql, logText)
};

// Optionen für Lieferanten
exports.lieferant = function(req, res, next) {
  bc.headersBenutzerChecken(req, res);

  const sql = "SELECT P_ID, B_Name FROM `Person` WHERE B_Name IS NOT NULL ORDER BY B_Name";
  const logText = "Lieferanten";

  sqlQuery(res, sql, logText)
};

// Führt die Abfrage aus und sendet das Ergebnis zur Seite, die gefetched wird
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
      res.redirect('/hauptmenue');
    }
  });
}