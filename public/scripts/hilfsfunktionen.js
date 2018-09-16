// Scrollt zum Anfang der Menüseiten
function smoothscroll() {
  var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - (currentScroll / 10));
  }
};

// Aktualisiert die Mengeneinheiten für die jeweiligen Stoffe
function meAktualisieren() {
  let lager = document.getElementById('lager')
  let lagerMe = lager.options[lager.selectedIndex].getAttribute('mebez');
  document.getElementById('zugang-me').innerHTML = '(' + lagerMe + ')';
};
// Blendet Buchen-Button auf Buchungsseiten aus und andere Buttons ein
function btnBuchenAusB() {
  document.getElementById('btn-buchen').classList.add('nodisplay');
  document.getElementById('btn-aendern').classList.remove('nodisplay');
  document.getElementById('btn-loeschen').classList.remove('nodisplay');
  document.getElementById('btn-abbrechen').classList.remove('nodisplay');
};
// Blendet Buchen-Button auf Stammdatenseiten aus und andere Buttons ein
function btnBuchenAusS() {
  document.getElementById('btn-buchen').classList.add('nodisplay');
  document.getElementById('btn-aendern').classList.remove('nodisplay');
  document.getElementById('btn-abbrechen').classList.remove('nodisplay');
};