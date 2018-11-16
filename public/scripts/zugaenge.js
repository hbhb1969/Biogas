  window.onload = function() {
    // Mengeneinheit dem Lager anpassen
    meAktualisieren('lager', 'zugang-me')

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
      let menge = Number(data[2].replace(".", ""));
      // Die folgenden Variablen werden bisher noch nicht genutzt
      let einheit = data[3];
      let lager = data[4];
      let lieferant = data[5];
      let lagerId = '';
      let LieferantId = '';

      // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
      document.getElementsByName('Z_ID')[0].value = id;
      document.getElementsByName('Z_Datum')[0].value = datum;
      document.getElementsByName('Z_BruttoMenge')[0].value = menge;
      let options = document.getElementsByTagName('option');
      for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML == lager) {
          lagerId = options[i].value;

        }
        if (options[i].innerHTML == lieferant) {
          lieferantId = options[i].value;
        }
      }

      document.getElementsByName('Lager_L_ID')[0].value = lagerId;
      document.getElementsByName('Person_P_ID')[0].value = lieferantId;
      btnBuchenAusB();
      smoothscroll();
    };

  };