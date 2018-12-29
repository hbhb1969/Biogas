exports.get = (req, res) => {
  const user = req.session.user,
    userId = req.session.userId;
  if (userId == null) {
    res.redirect("/anmelden");
    return;
  }
  let message = '';
  let headerClass = "stammdaten";
  let headerTitel = "Stammdaten";
  let headerBild = "stammdaten.svg ";
  res.render('stammdaten', {
    headerClass: headerClass,
    headerTitel: headerTitel,
    headerBild: headerBild,
  });
};