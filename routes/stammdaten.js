exports.menue = function(req, res) {
  let message = '';
  let headerTitel = "Stammdaten";
  let headerBild = "stammdaten.svg ";
  res.render('stammdaten', {
    headerTitel: headerTitel,
    headerBild: headerBild,
  });
};