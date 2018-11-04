// Durch die asynchrone Funktion queryAsync kann mit await auf das Ende der Buchung gewartet werden,
// bevor die Buchungen neu aus der Datenbank ausgelesen werden
exports.queryAsync = async sql => {
  try {
    const query = db.query(sql, (err, result) => {
      if (err) {
        logger.error(err);
      }
    });
  } catch (ex) {
    logger.error(ex);
  }
};

exports.query = (res, sql, logText) => {
  db.query(sql, (err, rows) => {
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
};