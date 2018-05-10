// Optionen für Lager
exports.lager = function(req, res, next) {
  const user = req.headers.user,
    userId = req.headers.userid;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }

  const sql = "SELECT L_ID, L_Name FROM `Lager` ORDER BY L_Name";

  db.query(sql, function(err, rows) {
    logger.info('Lager: err: ' + err + ', rows: ' + rows.length);
    if (err) {
      logger.error(err);
    }
    if (rows) {
      res.json(rows); // response = Abfrageergebnis im JSON-Format -> wird in der der HTML-Seite per fetch abgerufen
    } else {
      logger.warn('Keine Lager gefunden ' + err);
      res.redirect('/hauptmenue');
    }
  });
};

// Optionen für Lieferanten
exports.lieferant = function(req, res, next) {
  const user = req.headers.user,
    userId = req.headers.userid;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }

  const sql = "SELECT P_ID, B_Name FROM `Person` WHERE B_Name IS NOT NULL ORDER BY B_Name";

  db.query(sql, function(err, rows) {
    logger.info('Lieferanten: err: ' + err + ', rows: ' + rows.length);
    if (err) {
      logger.error(err);
    }
    if (rows) {
      res.json(rows); // response = Abfrageergebnis im JSON-Format -> wird in der der HTML-Seite per fetch abgerufen
    } else {
      logger.warn('Keine Lieferanten gefunden: err:' + err);
      res.redirect('/hauptmenue');
    }
  });
};