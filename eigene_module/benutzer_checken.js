exports.sessionBenutzerChecken = (user, userId, res) => {
  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  const options = {
    'headers': {
      'user': user,
      'userid': userId
    }
  };
  return options;
};

// Checkt, ob Benutzer angemeldet ist, der mit headers übergeben wurde
exports.headersBenutzerChecken = (req, res) => {
  const user = req.headers.user,
    userId = req.headers.userid;
  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
}