exports.get = (req, res) => {
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