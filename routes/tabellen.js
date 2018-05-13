// Gebuchte Zugänge
exports.zugaenge = function(req, res, next) {
  benutzerChecken(req, res);

  const sql = 'SELECT Z_ID AS ID, DATE_FORMAT(Z_Datum, "%d.%m.%y") AS Datum, Z_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit, L_Name AS Lager, B_Name As Lieferant FROM Zugang, Stoff, Mengeneinheit, Lager, Person  WHERE Lager_L_ID = L_ID AND Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID AND Person_P_ID = P_ID  ORDER BY Z_ID DESC ';
  const logText = "Zugänge";

  sqlQuery(res, sql, logText)
};

function sqlQuery(res, sql, logText) {
  var counter = 1;
  for (var i = 0; i < 1000000000; i++) {
    counter += i
  }
  logger.info('counter: ' + counter)
  db.query(sql, function(err, rows) {
    logger.info(logText + ': err: ' + err + ', rows: ' + rows.length);
    if (err) {
      logger.error(err);
    }
    if (rows) {
      res.json(rows);
    } else {
      logger.warn('Keine ' + logText + ' gefunden: err:' + err);
      res.json(rows); // bei Select wird in diesem Fall zum Hauptmenü umgeleitet
    }
  });
}

// Checkt, ob Benutzer angemeldet ist
function benutzerChecken(req, res) {
  const user = req.headers.user,
    userId = req.headers.userid;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
}