  window.onload = function() {
    // Mengeneinheit dem Lager anpassen
    // meAktualisieren()

    // Datum vorausfüllen
    document.getElementById('datum').valueAsDate = new Date();

    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    // Tabelle wird in die Variable data ausgelesen
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
      let datum = '20' + data[1].split('.')[2] + '-' + data[1].split('.')[1] + '-' + data[1].split('.')[0];
      let menge = data[2];
      // Die folgenden letiablen werden bisher noch nicht genutzt
      let einheit = data[3];
      let lager = data[4];
      let lieferant = data[5];
      let lagerId = '';
      let LieferantId = '';

      // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
      document.getElementsByName('F_ID')[0].value = id;
      document.getElementsByName('F_Datum')[0].value = datum;
      document.getElementsByName('F_BruttoMenge')[0].value = menge;
      let options = document.getElementsByTagName('option');
      for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML == lager) {
          lagerId = options[i].value;
        }
      }

      document.getElementsByName('Lager_L_ID')[0].value = lagerId;

      document.getElementById('btn-buchen').classList.add('nodisplay');
      document.getElementById('btn-aendern').classList.remove('nodisplay');
      document.getElementById('btn-loeschen').classList.remove('nodisplay');
      document.getElementById('btn-abbrechen').classList.remove('nodisplay');

    };

  };

  function meAktualisieren() {
    let lager = document.getElementById('lager')
    let lagerMe = lager.options[lager.selectedIndex].getAttribute('mebez');
    document.getElementById('zugang-me').innerHTML = '(' + lagerMe + ')';
  }