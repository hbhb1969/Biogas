let tabelle = document.getElementById('tabelle-av');
let alleZellen = tabelle.getElementsByTagName('td');

let abnehmer = [];
let ist = [];
let offen = [];

// Arrays werden mit Daten aus der Tabelle befüllt
for (let i = 0; i < alleZellen.length; i++) {
  i++;
  abnehmer.push(alleZellen[i].innerHTML);
  i = i + 2;
  ist.push(Number(alleZellen[i].innerHTML));
  i++;
  offen.push(Number(alleZellen[i].innerHTML));
}

// data wird befüllt
let data = [{
  "label": "Ist",
  "menge": ist.reduce((a, b) => a + b, 0) // Summe der Werte in ist
}, {
  "label": "Offen",
  "menge": offen.reduce((a, b) => a + b, 0) // Summe der Werte in offen
}];

// dataD wird befüllt
let dataD = [];
for (let i = 0; i < abnehmer.length; i++) {
  let datensatz = {
    label: abnehmer[i],
    menge: ist[i]
  };
  dataD.push(datensatz);
}
for (let i = 0; i < abnehmer.length; i++) {
  let datensatz = {
    label: abnehmer[i],
    menge: offen[i]
  };
  dataD.push(datensatz);
}

let width = document.getElementById("kd-abnahmevertraege").offsetWidth - 20,
  height = width,
  radius = Math.min(width, height) / 2;

let color = d3.scaleOrdinal()
  .range(["#999", "#666"]);

let pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.menge;
  })(data);

let arc = d3.arc()
  .outerRadius(radius - 99)
  .innerRadius(0);

let labelArc = d3.arc()
  .outerRadius(radius - 130)
  .innerRadius(radius - 130);

let svg = d3.select("#pie")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "kreisdiagramm")
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Moving the center point. 1/2 the width and 1/2 the height

let g = svg.selectAll("arc")
  .data(pie)
  .enter().append("g")
  .attr("class", "arc");

g.append("path")
  .attr("d", arc)
  .style("fill", function(d) {
    return color(d.data.label);
  })
  .transition()
  .ease(d3.easeLinear)
  .duration(1000)
  .attrTween("d", pieTween);

g.append("text")
  .attr("transform", function(d) {
    return "translate(" + labelArc.centroid(d) + ")";
  })
  .text(function(d) {
    return d.data.label;
  })
  .style("fill", "#fff");

function pieTween(b) {
  b.innerRadius = 0;
  let i = d3.interpolate({
    startAngle: 0,
    endAngle: 0
  }, b);
  return function(t) {
    return arc(i(t));
  };
}
// Detail-Ring
let colorD = d3.scaleOrdinal()
  .range(["#009245", "#003B4D", "#993366", "#F28C00", "#C21135", "#00ABD4"]);

let pieD = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.menge;
  })(dataD);

let arcD = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 100);

let labelArcD = d3.arc()
  .outerRadius(radius - 50)
  .innerRadius(radius - 50);

let svgD = d3.select("#pie")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "kreisdiagramm")
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Moving the center point. 1/2 the width and 1/2 the height

let gD = svgD.selectAll("arcD")
  .data(pieD)
  .enter().append("g")
  .attr("class", "arcD");

gD.append("path")
  .attr("d", arcD)
  .style("fill", function(d) {
    return colorD(d.data.label);
  })
  .transition()
  .ease(d3.easeLinear)
  .duration(1000)
  .attrTween("d", pieTweenD);

gD.append("text")
  .attr("transform", function(d) {
    return "translate(" + labelArcD.centroid(d) + ")";
  })
  .text(function(d) {
    return d.data.label;
  })
  .style("fill", "#fff");

function pieTweenD(b) {
  b.innerRadius = 0;
  let i = d3.interpolate({
    startAngle: 0,
    endAngle: 0
  }, b);
  return function(t) {
    return arcD(i(t));
  };
}