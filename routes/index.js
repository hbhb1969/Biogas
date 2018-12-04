const db = require('../db/pool');

exports.get = (req, res) => {
  req.session = null;
  let message = '';
  res.render('index', {
    message: message
  });
};

exports.post = (req, res) => {
  let message = '';
  const sess = req.session;
  const post = req.body;
  const name = post.name;
  const pass = post.passwort;
  const email = post.email;
  const bga = post.bga;
  const sql = "SELECT BEN_ID, BEN_Name, BEN_Passwort FROM `Benutzer` WHERE `BEN_Name`='" + name + "' and BEN_Passwort = '" + pass + "'";
  db.query(sql, (err, results) => {
    if (err) {
      logger.error(err);
    }
    if (results) {
      //logger.info('Benutzer: err: ' + err + ', results: ' + results.length);
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
};