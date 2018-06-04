function validiereForm(form) {
  let fehler = false;
  if (form == 'abgaben') {
    if (checkReihenfolgeDatum()) {
      fehler = true;
    }
    if (checkPositiveMenge()) {
      fehler = true;
    }
  }
  if (form == 'bilanz') {
    if (checkReihenfolgeDatum()) {
      fehler = true;
    }
  }
  if (form == 'fuetterungen') {
    if (checkPositiveMenge()) {
      fehler = true;
    }
  }
  if (form == 'zugaenge') {
    if (checkPositiveMenge()) {
      fehler = true;
    }
  }
  if (fehler) {
    return false;
  } else {
    return true;
  }
}

function checkReihenfolgeDatum() {
  document.getElementById('error-datum').classList.add('nodisplay');
  let datumBeginn = document.getElementById('datum-beginn').value;
  let datumEnde = document.getElementById('datum-ende').value;
  if (datumBeginn > datumEnde) {
    document.getElementById('error-datum').innerHTML = 'Das Enddatum darf nicht vor dem Anfangsdatum liegen.';
    document.getElementById('error-datum').classList.remove('nodisplay');
    return true;
  }
}

function checkPositiveMenge() {
  document.getElementById('error-menge').classList.add('nodisplay');
  let menge = document.getElementById('menge').value;
  if (menge < 0) {
    document.getElementById('error-menge').innerHTML = 'Der eingegebene Wert darf nicht negativ sein. ';
    document.getElementById('error-menge').classList.remove('nodisplay');
    return true;
  }
}