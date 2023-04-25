var SW = window.SW || {};

const makEl = type => document.createElementNS('http://www.w3.org/2000/svg', type);

// Das Grafikobjekt
SW.g = function(grafikelement, x=0, y=0) {

  // this.method = "svg";
  // SVG in Größe des "grafikelement" anlegen
  if(typeof grafikelement == "string") grafikelement = document.getElementById(grafikelement);
  const w = grafikelement.offsetWidth;
  const h = grafikelement.offsetHeight;
  var linewidth = 1;
  var svg = makEl('svg');
  svg.setAttribute("width","100%");
  svg.setAttribute("height","100%");
  svg.setAttribute("viewBox",`${-x} 0 ${w} ${h}`);
  svg.setAttribute("preserveAspectRatio","none");
  this.w = w-x;
  this.h = h-y;
  grafikelement.appendChild(svg);

  const t = y => this.H-y;
  
  // Linienstärke setzen
  this.setwidth = function(width) {
    linewidth = width;
  } // setwidth

  this.circle = function(cx,cy,r,fill) {
    const circle = makEl('circle');
    for ( const [key,val] of Object.entries({r,fill,cx,cy:this.h-cy}) ) circle.setAttribute(key, val);
    /* circle.setAttribute('cx',x);
    circle.setAttribute('cy',this.h-y);
    circle.setAttribute('r',r); */
    // circle.setAttribute('stroke-width', 0);
    svg.appendChild(circle);
  }
  
  // Linie von (xs,ys) nach (xe,ye) in Farbe color zeichnen
  this.line = function(xs,ys,xe,ye,color) {
    var linie = makEl('line');
    linie.setAttribute("x1",xs);
    linie.setAttribute("y1",this.h-ys);
    linie.setAttribute("x2",xe);
    linie.setAttribute("y2",this.h-ye);
    linie.setAttribute('stroke', color);
    linie.setAttribute('stroke-width', linewidth);
    linie.setAttribute("vector-effect","non-scaling-stroke");
    svg.appendChild(linie);
  } // line

  // Polylinie mit den Werten in points in Farbe color zeichnen
  this.polyline = function(points,color) {
    var polyline = makEl('polyline');
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', linewidth);
    polyline.setAttribute('fill', "none");
    polyline.setAttribute("vector-effect","non-scaling-stroke");
    var pointstring = "";
    for(var i=0;i<points.length;i++) pointstring += points[i].x+","+(this.h-points[i].y)+" ";
    polyline.setAttribute('points', pointstring);
    svg.appendChild(polyline);
  } // polyline

  // Text an (x,y) ausgeben
  // size: Schriftgröße
  // text: Text
  // align: Bezug für (x,y), zwei Buchstaben, z.B. lu für links unten, s. case
  // diretion: Textrichtung: v für vertikal, sonst horizontal
  this.text = function(x,y,size,color,text,align,direction) {
    var stext = makEl('text');
    stext.style.fontSize = size;
    stext.style.color = color;
    stext.style.fill = color;
    stext.textContent = text;

    const ali = (i,o,d) => o[align?.[i]]||o[d];
    stext.setAttribute('text-anchor',ali(0,{l:'start',m:'middle',r:'end'},'m'));
    stext.setAttribute('dy',ali(1,{o:'1.0',m:'0.5',u:'0.0'},'m')+'em');
    
    stext.setAttribute("x",x);
    stext.setAttribute("y",this.h-y);
    if(direction=="v") stext.setAttribute("transform","rotate(270 "+x+" "+(this.h-y)+")");
    
    svg.appendChild(stext);
    
  } // text

  // Canvas löschen
  this.del = function() {
    grafikelement.innerHTML = "";
  } // del
  
} // grafik

