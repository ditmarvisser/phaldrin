import data_GEOJSON from "./data.geojson";
import WeightedGraph from "./WeightedGraph";

// Initiate the graph
let graph = new WeightedGraph();

export const convertGEOJSON = () => {
	// console.log(data_GEOJSON);

	// Loop over all line features in the GEOJSON
	data_GEOJSON.features.forEach(feature => {
		if (feature.geometry.type === "LineString") {
			parseLineString(feature);
		}
	});

	// Create an array of all edge svgPaths, join them in a string, and log the string
	let edge,
		edgeSVGArray = [];
	for (edge in graph.adjacencyList.edges) {
		edgeSVGArray.push(graph.adjacencyList.edges[edge].edgeSVGString);
	}
	console.log(`
			<?xml-stylesheet type="text/css" href="../css/svg.css" ?>
			<svg xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink" width="1280" height="720" viewBox="-120000 -75000 520000 300000" id="map-svg">
			<title>nildrohainmap_colour_elements</title>
			<g id="Layer_1" data-name="Layer 1"> 
			<image width="518953.8838352524224" height="291911.5596573294876" x="-116595.8971" y="-73593.4179" xlink:href="nildrohainmap_colour.jpg"/>
			<image width="2013.66866685003446592" height="2128.23764973059489568" x="-50030.166193" y="64691.489913" xlink:href="aequor.png"/>
			<image width="1089.5104513363612484" height="652.4790375024391206" x="-70738.5200858080806242" y="-31952.7801656043555603" xlink:href="TabulaRasa.png"/>
			<image width="1435.423670122944" height="1138.023518242937" x="12540.09222039974" y="100930.0152016375" xlink:href="graymoor.png"/>
			</g>
			<g id="Edges">
			${edgeSVGArray.join("")}
			</g>
			<g id="Nodes"></g>
			<g id="RestNodes"></g>
			</svg>
			`);

	// Log a stringified version of the graph
	console.log(JSON.stringify(graph.adjacencyList));
};

const parseLineString = feature => {
	let edgeStartCoordinate,
		edgeEndCoordinate,
		edgeStartNode,
		edgeEndNode,
		edgeWeight = 0,
		SVGdPath,
		edge;

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

	// Get the starting coordinate
	edgeStartCoordinate = feature.geometry.coordinates[0];

	// Get the end coordinate
	edgeEndCoordinate =
		feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

	// Create the svg d string
	SVGdPath = `M${feature.geometry.coordinates[0][0]},${feature.geometry
		.coordinates[0][1] * -1}`;
	for (let i = 1; i < feature.geometry.coordinates.length; i++) {
		SVGdPath = SVGdPath.concat(
			`L${feature.geometry.coordinates[i][0]},${feature.geometry
				.coordinates[i][1] * -1}`
		);
	}

	// Flip the y coordinate
	edgeStartCoordinate[1] *= -1;
	edgeEndCoordinate[1] *= -1;

	// Get the start and end node by comparing the coordinates
	edgeStartNode = createNodesFromLineString(edgeStartCoordinate);
	edgeEndNode = createNodesFromLineString(edgeEndCoordinate);

	// Initiate the edge object
	edge = {
		edgeName: feature.properties.edgeName,
		edgeWeight,
		edgeStartNode,
		edgeEndNode,
		edgeType: feature.properties.edgeType
	};

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
