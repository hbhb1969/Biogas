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
      let abnehmer = data[1];
      let jahr = data[2];
      let menge = Number(data[3].replace(".", ""));
      let pId = '';

      // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
      document.getElementsByName('AV_ID')[0].value = id;
      document.getElementsByName('AV_Jahr')[0].value = jahr;
      document.getElementsByName('AV_Menge')[0].value = menge;
      let options = document.getElementsByTagName('option');
      for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML == abnehmer) {
          pId = options[i].value;
        }
      }

      document.getElementsByName('B_Name')[0].value = pId;

      btnBuchenAusS();
      smoothscroll();
    };
  };