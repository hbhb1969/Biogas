// Die Daten aus der Tabelle werden in die Arrays nsNamen und daten gelesen
let tabelle = document.getElementById('tabelle-bilanz');
let alleZellen = tabelle.getElementsByTagName('td');
let nsNamen = [];
let daten = [];
for (let i = 0; i < alleZellen.length; i = i + 2) {
  nsNamen.push(alleZellen[i].innerHTML);
  i++;
  daten.push(Number(alleZellen[i].innerHTML.replace(".", "")));
  i++;
  daten.push(Number(alleZellen[i].innerHTML.replace(".", "")));
}

let svgWidth = document.getElementById('bd-bilanz').offsetWidth - 40;
let svgHeight = 300;
let barPadding = 5;
let axisWidth = 50;
let animationsdauer = 1000;

let barWidth = ((svgWidth - axisWidth) / daten.length);

let svg = d3.select('svg')
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let tooltip = d3.select('body').append('div') // Tooltip, der beim Hovern über den Balken angezeigt wird
  .style('position', 'absolute')
  .style('background', '#f4f4f4')
  .style('padding', '5px 15px')
  .style('border', '1px #333 solid')
  .style('border-radius', '5px')
  .style('opacity', '0')
  .style('font-size', '12px');

let yScale = d3.scaleLinear() // Mit scalLinear kann die Größe der Blöcke an die Größe des svg angepasst werden
  .domain([0, d3.max(daten)]) // Obergrenze ist das größte Element in daten
  .range([0, svgHeight]); // das maximal in der Höhe des svg angezeigt wird

let yScaleAxis = d3.scaleLinear() // Für die Achsenbeschriftung
  .domain([0, d3.max(daten)]) // Obergrenze ist das größte Element in daten
  .range([svgHeight, 0]); // umgekehrt wie yScale, da 0 sonst oben steht

let y_axis = d3.axisLeft() // der d3-Methode axisLeft wird die eigne Scale yScale übergeben
  .scale(yScaleAxis);

svg.append("g")
  .attr("transform", "translate(" + axisWidth + ",0)")
  .call(y_axis);

let barChart = svg.selectAll("rect") // gibt zunächst eine leere Selection zurück
  .data(daten) // bindet die Variable daten
  .enter() // führt den nachflogenden Code für alle Elemente von daten aus
  .append("rect") // hängt ein Rechteck an svg an
  .attr('y', svgHeight) // wird für die Animation auf svgHeigth gesetzt, normalerweise wie hier drunter
  .attr('height', 0) // wird für die Animation auf 0 gesetzt, normalerweise wie hier drunter
  .attr("width", barWidth - barPadding)
  .attr("transform", function(d, i) {
    let translate = 0
    if (i % 2 == 0) {
      translate = [barWidth * i + axisWidth, 0];
    } else {
      translate = [barWidth * i - 5 + axisWidth, 0];
    }
    return "translate(" + translate + ")"; // verschiebt das Rechteck um barWidth * i nach rechts und um 0 nach unten
  })
  .on('mouseover', function(d) { // mouseover für jeden Balken
    tooltip.transition()
      .style('opacity', 1) // macht den tooltip sichtbar
    tooltip.html(d)
      .style('left', (d3.event.pageX) + 'px') // positioniert den tooltip dort, wo man zuerst mit der Maus auf den entsprechenden Balken gekommen ist
      .style('top', (d3.event.pageY + 'px'));
    d3.select(this).style('opacity', 0.8); // lässt den aktiven Balken verblassen
  })
  .on('mouseout', function(d) {
    tooltip.transition()
      .style('opacity', 0) // lässt den tooltip wieder verschwinden
    d3.select(this).style('opacity', 1) // lässt den Balken zu seiner ursprünglichen Farbe zurückkehren
  })

barChart.transition() // Animation zum einblenden der einzelnen Balken
  .attr("y", function(d) { // Attribut für die y-Achse gibt an, wo die obere Kante des Rechtecks sein soll; d ist jedes einzelne Element von daten
    return svgHeight - yScale(d); //Gesamthöhe svg - Höhe konkreter Balken
  })
  .attr("height", function(d) {
    return yScale(d); // die relative Höhe bezogen auf height des svg wird zurückgegeben
  })
  .duration(animationsdauer)

let spanBreite = (svgWidth - axisWidth) / nsNamen.length - 2;

document.write('<div style="width: ' + axisWidth + 'px; display: inline-block;"></div><div style="width: ' + spanBreite + 'px; text-align: center; display: inline-block;">' + nsNamen[0] + '</div><div style="width: ' + spanBreite + 'px; text-align: center; display: inline-block;">' + nsNamen[1] + '</div><div style="width: ' + spanBreite + 'px; text-align: center; display: inline-block;">' + nsNamen[2] + '</div>');