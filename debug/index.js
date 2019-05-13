import draw from "../src/draw";
import sort from "../src/sort";
import subscribe from "../src/events";

const data = [
  "root",
  {},
  ["a", {}, ["a1", {}], ["a2", {}, ["a21", {}], ["a22", {}], ["a23", {}], ["a24", {}]], ["a3", {}]],
  ["b", {}, ["b1", {}], ["b2", {}]],
  ["c", {}, ["c1", {}, ["c11", {}], ["c12", {}]]]
];

class Graph {
  constructor() {
    this.nodes = [];
  }

  parseData([name, acid, ...children]) {
    this.addNode([name, acid, ...children]);
    children.forEach(child => this.parseData(child));

    return this;
  }

  addNode([name, acid, ...children]) {
    this.nodes.push({
      name,
      acid,
      children: children.map(([name]) => name)
    });

    return this;
  }

  getNode(nodeName) {
    const find = this.nodes.find(({ name }) => name === nodeName);

    return find ? find : null;
  }

  getChildren(nodeName) {
    const find = this.nodes.find(({ name }) => name === nodeName);

    return find ? find.children : null;
  }

  get nodesCount() {
    return this.nodes.length;
  }
}

const graph = new Graph().parseData(data);

const points = sort({ graph, rootPoint: graph.nodes[0].name });

const svg = draw(points);

subscribe(svg);
