function checkPDF() {
  let urlParams = new URLSearchParams(window.location.search);
  let pdf = urlParams.get('pdf');
  if (pdf == 1) {
    if (confirm("Nährstoffbilanz anzeigen")) {
      window.open('../pdf/Bilanz.pdf');
    }
  }
}