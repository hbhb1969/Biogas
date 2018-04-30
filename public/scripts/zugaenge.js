  window.onload = function() {
    var table = document.getElementsByTagName("table")[0];
    var tbody = table.getElementsByTagName("tbody")[0];
    tbody.onclick = function(e) {
      e = e || window.event;
      var data = [];
      var target = e.srcElement || e.target;
      while (target && target.nodeName !== "TR") {
        target = target.parentNode;
      }
      if (target) {
        var cells = target.getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
          data.push(cells[i].innerHTML);
        }
      }
      let id = data[0];
      let datum = '20' + data[1].split('.')[2] + '-' + data[1].split('.')[1] + '-' + data[1].split('.')[0];
      let menge = data[2];
      // Die folgenden Variablen werden bisher noch nicht genutzt
      let einheit = data[3];
      let lager = data[4];
      let lieferant = data[5];
      let lagerId = '';
      let LieferantId = '';

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

      document.getElementById('btn-buchen').classList.add('nodisplay');
      document.getElementById('btn-aendern').classList.remove('nodisplay');
      document.getElementById('btn-loeschen').classList.remove('nodisplay');
      document.getElementById('btn-abbrechen').classList.remove('nodisplay');

    };

  };