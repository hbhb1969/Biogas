  window.onload = function() {
    // Tabelle wird in die Variable data ausgelesen
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    tbody.onclick = function(e) {
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
      let betrieb = data[1];
      let betriebsnummer = data[2];
      let gptId = data[3];
      let adID = data[4];
      let adStrasse = data[5];
      let adPostfach = data[6];
      let adPLZ = data[7];
      let adOrt = data[8];

      // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
      document.getElementsByName('P_ID')[0].value = id;
      document.getElementsByName('B_Name')[0].value = betrieb;
      document.getElementsByName('B_Nummer')[0].value = betriebsnummer;
      document.getElementById('abnehmer').checked = false;
      document.getElementById('lieferant').checked = false;

      if (gptId == 1 || gptId == 3) {
        document.getElementById('abnehmer').checked = true;
      }
      if (gptId == 2 || gptId == 3) {
        document.getElementById('lieferant').checked = true;
      }
      document.getElementsByName('AD_ID')[0].value = adID;
      document.getElementsByName('AD_Strasse')[0].value = adStrasse;
      if (adPostfach != 'null') {
        document.getElementsByName('AD_Postfach')[0].value = adPostfach;
        console.log("adPostfach: " + adPostfach);
      }
      document.getElementsByName('AD_PLZ')[0].value = adPLZ;
      document.getElementsByName('AD_Ort')[0].value = adOrt;

      document.getElementById('btn-buchen').classList.add('nodisplay');
      document.getElementById('btn-aendern').classList.remove('nodisplay');
      document.getElementById('btn-abbrechen').classList.remove('nodisplay');

    };

  };