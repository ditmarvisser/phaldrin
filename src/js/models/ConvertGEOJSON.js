import data_GEOJSON from "./data.geojson";
import WeightedGraph from "./WeightedGraph";

// Initiate the graph
let graph = new WeightedGraph();

export const convertGEOJSON = () => {
	console.log(data_GEOJSON);

	// Loop over all line features in the GEOJSON
	data_GEOJSON.features.forEach(feature => {
		if (feature.geometry.type === "LineString") {
			parseLineString(feature.geometry.coordinates);
		}
	});

	console.log(graph);
};

const parseLineString = lineCoordinates => {
	// Create the nodes from the start and end point of the LineString
	createNodesFromLineString(lineCoordinates[0]);
	createNodesFromLineString(lineCoordinates[lineCoordinates.length - 1]);
};

const createNodesFromLineString = lineCoordinates => {
	let nodeExists = false;
	let nodeArray = Object.entries(graph.adjacencyList.nodes);
	let node;
	// Check on all the nodes if there is a node with the same coordinates
	for (let i = 0; i < nodeArray.length; i++) {
		// If the node already exists, skip all other nodes
		if (
			nodeArray[i][1].coordinates[0] === lineCoordinates[0] &&
			nodeArray[i][1].coordinates[1] === lineCoordinates[1]
		) {
			nodeExists = true;
			break;
		}
	}
	// if all nodes are checked and there is not a node, create the node
	if (!nodeExists) {
		node = {
			name: null,
			coordinates: lineCoordinates,
			connections: []
		};
		graph.addNode(Object.keys(graph.adjacencyList.nodes).length, node);
	}
};
