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
  let stoff = data[1];
  let externeID = data[2];
  let datum = '20' + data[3].split('.')[2] + '-' + data[3].split('.')[1] + '-' + data[3].split('.')[0];
  let gueltigkeitsdatum = '20' + data[4].split('.')[2] + '-' + data[4].split('.')[1] + '-' + data[4].split('.')[0];
  let analysetyp = data[5];
  let wert = data[6];
  let analysetypId = '';
  let stoffId = '';

  // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
  document.getElementsByName('A_ID')[0].value = id;
  let options = document.getElementsByTagName('option');
  for (let i = 0; i < options.length; i++) {
    if (options[i].innerHTML == analysetyp) {
      analysetypId = options[i].value;
    }
    if (options[i].innerHTML == stoff) {
      stoffId = options[i].value;
    }
  }
  document.getElementsByName('S_ID')[0].value = stoffId;
  document.getElementsByName('A_ExterneID')[0].value = externeID;
  document.getElementsByName('A_Datum')[0].value = datum;
  document.getElementsByName('A_DatumGueltigAb')[0].value = gueltigkeitsdatum;
  document.getElementsByName('AT_ID')[0].value = analysetypId;
  document.getElementsByName('SA_A_Wert')[0].value = wert;
  btnBuchenAusS();
  smoothscroll();
}