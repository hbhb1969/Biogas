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
  let anfangsdatum = '20' + data[1].split('.')[2] + '-' + data[1].split('.')[1] + '-' + data[1].split('.')[0];
  let enddatum = '20' + data[2].split('.')[2] + '-' + data[2].split('.')[1] + '-' + data[2].split('.')[0];
  let menge = data[3];
  let abnehmer = data[4];
  let abnehmerId = '';

  // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
  document.getElementsByName('AG_ID')[0].value = id;
  document.getElementsByName('AG_DatumBeginn')[0].value = anfangsdatum;
  document.getElementsByName('AG_DatumEnde')[0].value = enddatum;
  document.getElementsByName('AG_Menge')[0].value = menge;
  let options = document.getElementsByTagName('option');
  for (let i = 0; i < options.length; i++) {
    if (options[i].innerHTML == abnehmer) {
      abnehmerId = options[i].value;
      break;
    }
  }

  document.getElementsByName('Person_P_ID')[0].value = abnehmerId;
  document.getElementById('btn-buchen').classList.add('nodisplay');
  document.getElementById('btn-aendern').classList.remove('nodisplay');
  document.getElementById('btn-abbrechen').classList.remove('nodisplay');
}