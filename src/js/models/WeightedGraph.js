export default class WeightedGraph {
	constructor() {
		this.adjacencyList = {
			nodes: {},
			edges: {}
		};
	}

	addNode(id, node) {
		// If the node is not yet in the graph, add it
		if (!this.adjacencyList.nodes[id]) this.adjacencyList.nodes[id] = node;
	}
	
	addEdge(id, edge) {
		// If the edge is not yet in the graph, add it
		if (!this.adjacencyList.edges[id]) this.adjacencyList.edges[id] = edge;

		// Connect the 2 nodes with each other using the edge
		this.adjacencyList.nodes[edge.edgeStartNode].connections.push({ node: edge.edgeEndNode, edge: id });
		this.adjacencyList.nodes[edge.edgeEndNode].connections.push({ node: edge.edgeStartNode, edge: id });
	}
}
