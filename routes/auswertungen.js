exports.menue = function(req, res) {
  let message = '';
  let headerClass = "auswertungen";
  let headerTitel = "Auswertungen";
  let headerBild = "auswertungen.svg ";
  res.render('auswertungen', {
    headerClass: headerClass,
    headerTitel: headerTitel,
    headerBild: headerBild,
  });
};