import { degToRad } from "./utils";

export default (graph, root, parentNode) => {
  const points = [];
  const angleSpace = degToRad(360);
  const nodeRadiusStart = 40;
  const childrenRadiusStart = 200;

  points.push({ id: root.acid, name: root.name, parent: null, x: 0, y: 0, r: nodeRadiusStart * 2, o: 1 });

  (function sort({ id, center: { x: cx, y: cy }, radius, nodeRadius, opacity, parentAngle, parentNode }) {
    const children = graph.getChildren(id);
    const onePart = angleSpace / children.length;
    const delta = onePart / 2;
    let parentDelta = 0;

    if (parentNode) {
      const angle = delta + parentAngle + degToRad(180);
      parentDelta = degToRad(180) - angle;
    }

    children.forEach((child, idx) => {
      const { acid, name } = graph.getNode(child);
      const angle = onePart * idx + delta + parentAngle + degToRad(180) + parentDelta;
      const x = Math.round((cx + radius * Math.sin(angle)) * 100000) / 100000;
      const y = Math.round((cy + radius * Math.cos(angle)) * 100000) / 100000;

      points.push({ id: acid, name, parent: id, x, y, r: nodeRadius, o: opacity });

      sort({
        id: acid,
        center: { x, y },
        radius: radius * 0.6,
        nodeRadius: nodeRadius * 0.6,
        parentAngle: angle,
        opacity: opacity / 1.75 < 0.15 ? opacity : opacity / 1.75
      });
    });
  })({
    id: root.acid,
    name: root.name,
    parent: null,
    center: { x: 0, y: 0 },
    radius: childrenRadiusStart,
    nodeRadius: nodeRadiusStart,
    opacity: 1,
    parentAngle: degToRad(-180),
    parentNode
  });

  const edges = points.reduce((acc, { x, y, id, name, parent, o }) => {
    const parentPoint = points.find(({ id }) => id === parent);
    if (parent !== null) {
      const { x: x2, y: y2, id: id2, name: name2, o: o2 } = parentPoint;
      acc.push({
        p1: { x, y, id, name, o },
        p2: { x: x2, y: y2, id: id2, name: name2, o: o2 }
      });
    }
    return acc;
  }, []);

  return { points, edges };
};
