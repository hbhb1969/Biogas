//----------------------------------------------- Anmeldeseite ------------------------------------------------------
exports.anmelden = function(req, res) {
  let message = '';
  const sess = req.session;

  if (req.method == "POST") {
    const post = req.body;
    const name = post.name;
    const pass = post.passwort;
    const email = post.email;
    const bga = post.bga;
    const sql = "SELECT BEN_ID, BEN_Name, BEN_Passwort FROM `Benutzer` WHERE `BEN_Name`='" + name + "' and BEN_Passwort = '" + pass + "'";
    db.query(sql, function(err, results) {
      logger.info('Benutzer: err: ' + err + ', results: ' + results.length);
      if (err) {
        logger.error(err);
      }
      if (results) {
        if (results.length) {
          req.session.userId = results[0].BEN_ID;
          req.session.user = results[0];
          res.redirect('/hauptmenue');
        } else {
          message = 'Die Logindaten sind nicht korrekt.';
          res.render('index.ejs', {
            message: message
          });
        }
      } else {
        message = 'Datenbankfehler: ' + err;
        logger.error('Datenbankfehler: ' + err);
        res.render('index.ejs', {
          message: message
        });
      }
    });
  } else {
    res.render('index.ejs', {
      message: message
    });
  }

};
//----------------------------------------------- Hauptmenü ----------------------------------------------
exports.hauptmenue = function(req, res, next) {
  let message = '';
  const user = req.session.user,
    userId = req.session.userId;

  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }

  const sql = "SELECT * FROM `Benutzer` WHERE `BEN_ID`='" + userId + "'";
  db.query(sql, function(err, results) {
    if (err) {
      logger.error(err);
    }
    res.render('hauptmenue.ejs', {
      user: user,
      message: message
    });
  });
};

//------------------------------------ Abmelden ----------------------------------------------
exports.abmelden = function(req, res) {
  req.session = null;
  res.redirect("/anmelden");
};