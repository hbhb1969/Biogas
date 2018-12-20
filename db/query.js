const pool = require('../db/pool');
// Durch die asynchrone Funktion queryAsync kann mit await auf das Ende der Buchung gewartet werden,
// bevor die Buchungen neu aus der Datenbank ausgelesen werden
exports.queryAsync = async sql => {
  try {
    pool.query(sql, (err, result) => {
      if (err) {
        logger.error('DB-Fehler: ' + err);
      }
    });
  } catch (ex) {
    logger.error('DB-Exception: ' + ex);
  }
};

exports.query = (res, sql, logText) => {
  try {
    pool.query(sql, (err, rows) => {
      if (err) {
        logger.error(err);
      }
      if (rows) {
        res.json(rows);
      } else {
        logger.warn('Keine ' + logText + ' gefunden: err:' + err);
        res.json(rows);
      }
    });
  } catch (ex) {
    logger.error(ex);
  }
};