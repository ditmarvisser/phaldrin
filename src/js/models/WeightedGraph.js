export default class WeightedGraph {
	constructor() {
		this.adjacencyList = {
			nodes: {},
			edges: {}
		};
	}
	addNode(id, data) {
		if (!this.adjacencyList.nodes[id]) this.adjacencyList.nodes[id] = data;
	}
	addEdge(road, roadID) {

		if (!this.adjacencyList.edges[roadID]) this.adjacencyList.edges[roadID] = road;

		this.adjacencyList.nodes[road.roadStartNode].connections.push({ node: road.roadEndNode, edge: roadID });
		this.adjacencyList.nodes[road.roadEndNode].connections.push({ node: road.roadStartNode, edge: roadID });
	}
}
