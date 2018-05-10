// Gebuchte Zugänge
exports.zugaenge = function(req, res, next) {
  const user = req.headers.user,
    userId = req.headers.userid;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }

  const sql = 'SELECT Z_ID AS ID, DATE_FORMAT(Z_Datum, "%d.%m.%y") AS Datum, Z_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit, L_Name AS Lager, B_Name As Lieferant FROM Zugang, Stoff, Mengeneinheit, Lager, Person  WHERE Lager_L_ID = L_ID AND Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID AND Person_P_ID = P_ID  ORDER BY Z_ID DESC ';

  db.query(sql, function(err, rows) {
    if (err) {
      logger.error(err);
    }
    if (rows) {
      logger.info('Zugänge: err: ' + err + ', rows: ' + rows.length);
      res.json(rows); // response = Abfrageergebnis im JSON-Format -> wird in der der HTML-Seite per fetch abgerufen
    } else {
      logger.warn('Keine Zugänge gefunden ' + err);
      res.json(rows);
    }
  });
};