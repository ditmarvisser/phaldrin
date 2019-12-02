import data_GEOJSON from "./data.geojson";
import WeightedGraph from "./WeightedGraph";

// Initiate the graph
let graph = new WeightedGraph();

export const convertGEOJSON = () => {
	console.log(data_GEOJSON);

	// Loop over all line features in the GEOJSON
	data_GEOJSON.features.forEach(feature => {
		if (feature.geometry.type === "LineString") {
			parseLineString(feature);
		}
	});

	console.log(graph);
	console.log(Object.entries(graph.adjacencyList.nodes).length);
};

const parseLineString = feature => {
	let edgeStartCoordinate,
		edgeEndCoordinate,
		edgeStartNode,
		edgeEndNode,
		edgeWeight = 0,
		SVGdPath,
		edge;

	// Get the starting coordinate
	edgeStartCoordinate = feature.geometry.coordinates[0];

	// Get the end coordinate
	edgeEndCoordinate =
		feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

	// Get the start and end node by comparing the coordinates
	edgeStartNode = createNodesFromLineString(edgeStartCoordinate);
	edgeEndNode = createNodesFromLineString(edgeEndCoordinate);

	// Calculate the edge weight
	for (let i = 0; i < feature.geometry.coordinates.length - 1; i++) {
		edgeWeight += Math.hypot(
			Math.abs(
				feature.geometry.coordinates[i][0] -
					feature.geometry.coordinates[i + 1][0]
			),
			Math.abs(
				feature.geometry.coordinates[i][1] -
					feature.geometry.coordinates[i + 1][1]
			)
		);
	}

	// Initiate the edge object
	edge = {
		edgeName: feature.properties.edgeName,
		edgeWeight,
		edgeStartNode,
		edgeEndNode,
		edgeType: feature.properties.edgeType
	};

	// Create the svg d string
	SVGdPath = `M${feature.geometry.coordinates[0]}`;
	for (let i = 1; i < feature.geometry.coordinates.length; i++) {
		SVGdPath = SVGdPath.concat(`L${feature.geometry.coordinates[i]}`);
	}

	// Construct the string for the svg
	edge.edgeSVGString = `<path class="edge ${edge.edgeType}" id="edge-${
		feature.properties.fid
	}" ${edge.name ? `data-name="${edge.name}"` : ""} d="${SVGdPath}"/>`;

	// Add the edge to the graph
	graph.addEdge(feature.properties.fid, edge);
};

const createNodesFromLineString = lineCoordinates => {
	let nodeExists = false;
	let nodeArray = Object.entries(graph.adjacencyList.nodes);
	// Check on all the nodes if there is a node with the same coordinates
	let i = 0;
	for (i = 0; i < nodeArray.length; i++) {
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
		let node = {
			name: null,
			coordinates: lineCoordinates,
			connections: []
		};
		graph.addNode(Object.keys(graph.adjacencyList.nodes).length, node);
	}
	// Return the index of the node created, or broke the loop
	return i;
};
