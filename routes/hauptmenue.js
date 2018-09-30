exports.get = (req, res, next) => {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  let headerTitel = "Menü";
  let headerBild = "menue-weiss.png ";

  const sql = "SELECT * FROM `Benutzer` WHERE `BEN_ID`='" + userId + "'";
  db.query(sql, (err, results) => {
    if (err) {
      logger.error(err);
    }
    res.render('hauptmenue.ejs', {
      user: user,
      message: message,
      headerTitel: headerTitel,
      headerBild: headerBild
    });
  });
};