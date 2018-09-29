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