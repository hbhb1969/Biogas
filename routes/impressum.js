exports.get = (req, res) => {
  const user = req.session.user,
    userId = req.session.userId;
  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  let message = '';
  let headerClass = "auswertungen";
  let headerTitel = "Impressum";
  let headerBild = "";
  res.render('impressum', {
    headerClass: headerClass,
    headerTitel: headerTitel,
    headerBild: headerBild,
  });
};