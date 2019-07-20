export default class WeightedGraph {
	constructor() {
		this.adjacencyList = {
			nodes: {},
			edges: {}
		};
	}

	addNode(id, node) {
		if (!this.adjacencyList.nodes[id]) this.adjacencyList.nodes[id] = node;
	}

	addEdge(id, edge) {
		if (!this.adjacencyList.edges[id]) this.adjacencyList.edges[id] = edge;
		this.adjacencyList.nodes[edge.edgeStartNode].connections.push({ node: edge.edgeEndNode, edge: id });
		this.adjacencyList.nodes[edge.edgeEndNode].connections.push({ node: edge.edgeStartNode, edge: id });
	}
}
