function checkLieferschein() {
  let urlParams = new URLSearchParams(window.location.search);
  let pdf = urlParams.get('pdf');
  if (pdf == 1) {
    if (confirm("Nährstoffbilanz anzeigen")) {
      window.open('../pdf/Bilanz.pdf');
    }
  }
}

function gotoPDF() {
  let ad = document.getElementById('datum-beginn').value;
  let ed = document.getElementById('datum-ende').value;

  document.getElementById('btn-pdf').setAttribute("formaction", "/pdf/bilanz");
}