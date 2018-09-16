  window.onload = function() {
    // Mengeneinheit dem Rohstoff anpassen
    meAktualisieren()

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
      let lager = data[1];
      let rohstoff = data[2];
      let bestand = data[3];
      let me = data[4];
      let stoffId = '';

      // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
      document.getElementsByName('L_ID')[0].value = id;
      document.getElementsByName('L_Name')[0].value = lager;
      document.getElementsByName('L_Bestand')[0].value = bestand;
      let options = document.getElementsByTagName('option');
      for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML == rohstoff) {
          stoffId = options[i].value;
        }
      }

      document.getElementsByName('S_Bezeichnung')[0].value = stoffId;

      btnBuchenAusS();
      smoothscroll();
    };

  };

  function meAktualisieren() {
    let stoff = document.getElementById('stoffbezeichnung')
    let stoffMe = stoff.options[stoff.selectedIndex].getAttribute('mebez');
    document.getElementById('stoff-me').innerHTML = '(' + stoffMe + ')';
  }