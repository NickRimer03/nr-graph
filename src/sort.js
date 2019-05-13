import * as utils from "./utils";

export default ({ graph, rootPoint = graph.nodes[0].name }) => {
  const ratio = 1.5;
  const startRad = 70;
  const center = { x: 0, y: 0 };

  const tree = utils.graphToTreeWidthSearch(graph, rootPoint);
  tree.weights = utils.getAllGraphWeights(graph);
  tree.angles = {};
  tree.angleSpaces = {};
  tree.radiuses = {};

  let totalPoints = [];
  totalPoints.push({
    id: rootPoint,
    x: center.x,
    y: center.y,
    r: startRad,
    parentId: null,
    level: 0
  });
  tree.angles[rootPoint] = 0;
  tree.angleSpaces[rootPoint] = utils.degToRad(360);
  tree.radiuses[0] = 0;

  for (let level in tree.nodes) {
    const depth = +level + 1;
    const currRad = startRad / ratio ** depth;
    let levelPoints = [];
    let overlap = false;

    do {
      overlap = false;
      levelPoints.length = 0;
      tree.nodes[level].forEach(node => {
        const connections = graph.getChildren(node);
        if (connections.length > 0) {
          let radius = 0;
          const angleSpace = tree.angleSpaces[node];
          if (!tree.radiuses.hasOwnProperty(depth)) {
            radius = utils.getRadius(tree.radiuses[level], currRad * ratio, currRad, tree.nodes[depth].length);
            tree.radiuses[depth] = radius;
          } else {
            radius = tree.radiuses[depth];
          }

          const weightSum = connections.map(e => tree.weights[e]).reduce((s, c) => s + c, 0);
          const onePart = angleSpace / weightSum;
          const sectors = [];
          const points = [];

          connections.forEach(childNode => {
            const sector = onePart * tree.weights[childNode];
            const previousSum = sectors.reduce((s, c) => s + c, 0);
            let angle, delta;
            if (depth === 1) {
              delta = sector / 2;
            } else {
              delta = sector / 2 - angleSpace / 2;
            }
            angle = tree.angles[node] + previousSum + delta;
            sectors.push(sector);

            const nodeX = center.x + radius * Math.sin(angle);
            const nodeY = center.y + radius * Math.cos(angle);
            points.push({
              id: childNode,
              x: nodeX,
              y: nodeY,
              r: currRad,
              parentId: node,
              level: depth
            });

            tree.angles[childNode] = angle;
            tree.angleSpaces[childNode] = sector;
          });

          const oldArcLen = utils.getArcLength(tree.radiuses[depth], Math.min(...sectors));
          // if (+oldArcLen.toFixed(2) < +(currRad * 2).toFixed(2)) {
          if (Math.round(oldArcLen - currRad * 2) < 0) {
            tree.radiuses[depth] = utils.getArcRadius(currRad * 2, Math.min(...sectors));
            overlap = true;
          } else {
            levelPoints = levelPoints.concat(points);
          }
        }
      });
    } while (overlap);
    totalPoints = totalPoints.concat(levelPoints);
  }

  return totalPoints;
};
