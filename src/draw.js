const SVGNS = "http://www.w3.org/2000/svg";

function addCircle({ x, y, r }) {
  const circle = document.createElementNS(SVGNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", "#f00");
  circle.setAttribute("stroke", "none");

  return circle;
}

function addText({ id, x, y }) {
  const text = document.createElementNS(SVGNS, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.textContent = id;

  return text;
}

function addLine({ x1, y1, x2, y2 }, slave = false) {
  const line = document.createElementNS(SVGNS, "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", slave ? "#0f0" : "#00f");

  return line;
}

export default points => {
  const svg = document.createElementNS(SVGNS, "svg");
  const [w, h] = [1024, 768];
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  // svg.setAttribute("viewBox", `${-w / 2} ${-h / 2} ${w} ${h}`);

  // edges
  points.forEach(point => {
    if (point.parentId !== null) {
      const parentPoint = points.find(({ id }) => id === point.parentId);
      svg.append(addLine({ x1: parentPoint.x, y1: parentPoint.y, x2: point.x, y2: point.y }));
    }
  });

  // nodes
  points.forEach(point => {
    svg.append(addCircle(point));
    svg.append(addText(point));
  });

  document.body.append(svg);

  return svg;
};
