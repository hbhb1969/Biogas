exports.menue = function(req, res) {
  let message = '';
  let headerTitel = "Auswertungen";
  let headerBild = "auswertungen.svg ";
  res.render('auswertungen', {
    headerTitel: headerTitel,
    headerBild: headerBild,
  });
};