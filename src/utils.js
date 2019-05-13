export function graphToTreeWidthSearch(graph, rootPoint) {
  const processed = [];
  const tree = {
    nodes: {
      0: [rootPoint]
    },
    parents: {}
  };
  let maxLevel = 0;
  let queue = [rootPoint];
  let levels = [maxLevel];
  while (queue.length > 0) {
    const active = queue.shift();
    const activeLevel = levels.shift();
    processed.push(active);
    const children = graph.getChildren(active);
    const childrenFiltered = children.filter(e => {
      return !queue.includes(e);
    });
    if (childrenFiltered.length > 0) {
      maxLevel = activeLevel + 1;
      queue = queue.concat(childrenFiltered);
      levels = levels.concat(new Array(childrenFiltered.length).fill(maxLevel));
      childrenFiltered.forEach(net => {
        tree.parents[`${net}`] = active;
      });
      if (maxLevel in tree.nodes) {
        tree.nodes[maxLevel] = tree.nodes[maxLevel].concat(childrenFiltered);
      } else {
        tree.nodes[maxLevel] = childrenFiltered;
      }
    }
  }

  return tree;
}

export function getAllGraphWeights(graph) {
  const weights = {};
  const globalProcessed = [];
  const localProcessed = [];

  graph.nodes.forEach(({ name, children }) => {
    let length = 1;
    (function process({ name, children }) {
      const nets = children.filter(e => {
        return !localProcessed.includes(e) && !globalProcessed.includes(e);
      });
      localProcessed.push(name);
      if (nets.length > 0) {
        length += nets.length;
        nets.forEach(n => {
          process(graph.getNode(n));
        });
      }
    })({ name, children });

    globalProcessed.push(name);
    localProcessed.length = 0;
    weights[name] = length;
  });

  return weights;
}

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad) {
  return (180 * rad) / Math.PI;
}

export function getRadius(rPrev, rPrevNode, rCurrNode, quantity, delta = 10) {
  return rPrev + rPrevNode + rCurrNode + (quantity * rCurrNode) / (2 * Math.PI) + delta;
}

export function getArcLength(rad, angle) {
  return (Math.PI * rad * radToDeg(angle)) / 180;
}

export function getArcRadius(len, angle) {
  return (180 * len) / (Math.PI * radToDeg(angle));
}
