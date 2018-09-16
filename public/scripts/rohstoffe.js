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
      let lagerRadio = document.getElementById("lager-radio");
      let name = '';
      let einheit = '';
      let pid = '';
      let lieferant = '';
      if (lagerRadio.checked == true) {
        name = data[1];
        einheit = data[2];
      } else {
        pid = data[1];
        name = data[2];
        einheit = data[3];
        lieferant = data[4];
      }
      let meId = '';
      let lieferantenId = '';

      // Daten der angeklickten Tabellenzeile werden in das Formular geschrieben
      document.getElementsByName('S_ID')[0].value = id;
      document.getElementsByName('S_Bezeichnung')[0].value = name;
      let options = document.getElementsByTagName('option');
      for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML == einheit) {
          meId = options[i].value;
          break;
        }
      }

      document.getElementsByName('Mengeneinheit_ME_ID')[0].value = meId;
      document.getElementsByName('Person_P_ID')[0].value = pid;
      btnBuchenAusS();
      smoothscroll();
    }

    // Wechselt zwischen Lager- und Direktrohstoff
    function ansichtWechseln() {
      let lagerRadio = document.getElementById("lager-radio");
      if (lagerRadio.checked == true) {
        document.getElementById('rohstoff-wrapper').classList.add('nodisplay');
        document.getElementById('stoffe-direkt').classList.add('nodisplay');
        document.getElementById('stoffe-lager').classList.remove('nodisplay');
      } else {
        document.getElementById('rohstoff-wrapper').classList.remove('nodisplay');
        document.getElementById('stoffe-direkt').classList.remove('nodisplay');
        document.getElementById('stoffe-lager').classList.add('nodisplay');
      };
      document.getElementById('rohstoffbezeichnung').value = '';
    }