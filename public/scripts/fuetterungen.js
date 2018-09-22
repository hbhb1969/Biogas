window.onload = function() {
  // Mengeneinheit dem Lager anpassen
  meAktualisieren('lager', 'fuetterung-me');

  // Datum vorausfüllen
  document.getElementById('datum').valueAsDate = new Date();
}

// Bei Klick auf eine Tabellenzeile werden die Daten in das Formular übertragen
function auswahlTabelle(e) {
  e = e || window.event;
  let data = [];
  let target = e.srcElement || e.target;
  while (target && target.nodeName !== "TR") {
    target = target.parentNode;
  }
  if (target) {
    let cells = target.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
      data.push(cells[i].innerHTML);
    }
  }
  let id = data[0];
  let datum = '20' + data[1].split('.')[2] + '-' + data[1].split('.')[1] + '-' + data[1].split('.')[0];
  let menge = data[2];
  let einheit = data[3];
  let lagerRadio = document.getElementById("lager-radio");
  let lager = '';
  let stoff = '';
  if (lagerRadio.checked == true) {

    lager = data[4];
  } else {
    stoff = data[4];
  }
  let lagerId = '';
  let stoffId = '';

  // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
  document.getElementsByName('F_ID')[0].value = id;
  document.getElementsByName('F_Datum')[0].value = datum;
  document.getElementsByName('F_BruttoMenge')[0].value = menge;
  let options = document.getElementsByTagName('option');
  for (let i = 0; i < options.length; i++) {
    if (options[i].innerHTML == lager) {
      lagerId = options[i].value;
      break;
    }
    if (options[i].innerHTML == stoff) {
      stoffId = options[i].value;
      break;
    }
  }

  document.getElementsByName('Lager_L_ID')[0].value = lagerId;
  document.getElementsByName('Stoff_S_ID')[0].value = stoffId;
  btnBuchenAusB();
  smoothscroll();
}

// Wechselt zwischen Lager- und Direktrohstoff
function ansichtWechseln() {
  let lagerRadio = document.getElementById("lager-radio");
  if (lagerRadio.checked == true) {
    document.getElementById('rohstoff-wrapper').classList.add('nodisplay');
    document.getElementById('fuetterungen-direkt').classList.add('nodisplay');
    document.getElementById('lager-wrapper').classList.remove('nodisplay');
    document.getElementById('fuetterungen-lager').classList.remove('nodisplay');
    meAktualisieren('lager', 'fuetterung-me');
  } else {
    document.getElementById('rohstoff-wrapper').classList.remove('nodisplay');
    document.getElementById('fuetterungen-direkt').classList.remove('nodisplay');
    document.getElementById('lager-wrapper').classList.add('nodisplay');
    document.getElementById('fuetterungen-lager').classList.add('nodisplay');
    meAktualisieren('rohstoff', 'fuetterung-me');
  };
}