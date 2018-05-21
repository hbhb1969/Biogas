function validiereForm(form) {
  let fehler = false;
  let menge = document.getElementById('menge').value;
  if (menge < 0) {
    document.getElementById('error-menge').innerHTML = 'Der eingegebene Wert darf nicht negativ sein. ';
    document.getElementById('error-menge').classList.remove('nodisplay');
    fehler = true;
  }
  if (form == 'abgaben') {
    let datumBeginn = document.getElementById('datum-beginn').value;
    let datumEnde = document.getElementById('datum-ende').value;
    if (datumBeginn > datumEnde) {
      document.getElementById('error-datum').innerHTML = 'Das Enddatum darf nicht vor dem Anfangsdatum liegen.';
      document.getElementById('error-datum').classList.remove('nodisplay');
      fehler = true;
    }
  }
  if (fehler) {
    return false;
  } else {
    return true;
  }
}