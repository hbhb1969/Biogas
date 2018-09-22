exports.menue = function(req, res) {
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