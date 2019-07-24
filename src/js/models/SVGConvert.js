import WeightedGraph from "./WeightedGraph";

export const convertSVG = () => {
	// Initiate the graph
	let graph = new WeightedGraph();

	// Create an array of all nodes in the SVG and itterate over them, converting it to usable data
	let node;
	Array.from(
		document
			.getElementById("mapSVG")
			.contentDocument.getElementById("nodes").children
	).forEach((element, index) => {
		// Initiate the node object
		node = {
			// The name is either the name, or id, or null
			name: element.attributes["data-name"]
				? element.attributes["data-name"].textContent
				: element.attributes.id
				? element.attributes.id.textContent
				: null,

			// The coordinates are in the attributes
			coordinates: [
				parseFloat(element.attributes.cx.value),
				parseFloat(element.attributes.cy.value)
			],

			// Empty connection array for when we later add the edges
			connections: []
		};

		// Construct the string that will be entered in the svg
		node.svgPath = `<circle class="node" id="node-${index}" ${
			node.name ? `data-name="${node.name}"` : ""
		} cx="${node.coordinates[0]}" cy="${node.coordinates[1]}" r="10"/>`;

		// Add the node to the graph
		graph.addNode(index, node);
	});

	// Create an array of all edges in the SVG and itterate over them, converting it to usable data
	let edgePath,
		edgeStartCoordinate,
		edgeEndCoordinate,
		edgeStartNode,
		edgeEndNode,
		edge,
		convertedNode,
		convertedEdge,
		edgeType,
		index = 0;

	Array.from(
		document
			.getElementById("mapSVG")
			.contentDocument.getElementById("edges").children
	).forEach(e => {
		edgeType = e.id;
		console.log(edgeType);

		Array.from(e.children).forEach(element => {
			// The d attribute of the edge
			edgePath = element.attributes.d.nodeValue;

			// Get the starting coordinate by splicing the first instruction from the edgePath
			edgeStartCoordinate = edgePath
				.split(/(?=[A-Z])/gi)[0]
				.split(/M|,/)
				.splice(1)
				.map(e => parseFloat(e));

			// Get the end coordinate with getPointAtLength of the total length
			edgeEndCoordinate = [
				Math.round(
					element.getPointAtLength(element.getTotalLength()).x * 10
				) / 10,
				Math.round(
					element.getPointAtLength(element.getTotalLength()).y * 10
				) / 10
			];

			// Get the start and end node by comparing the coordinates
			edgeStartNode = undefined;
			edgeEndNode = undefined;

			for (convertedNode in graph.adjacencyList.nodes) {
				if (
					graph.adjacencyList.nodes[convertedNode].coordinates[0] ===
						edgeStartCoordinate[0] &&
					graph.adjacencyList.nodes[convertedNode].coordinates[1] ===
						edgeStartCoordinate[1]
				) {
					edgeStartNode = convertedNode;
				}
				if (
					graph.adjacencyList.nodes[convertedNode].coordinates[0] ===
						edgeEndCoordinate[0] &&
					graph.adjacencyList.nodes[convertedNode].coordinates[1] ===
						edgeEndCoordinate[1]
				) {
					edgeEndNode = convertedNode;
				}
				if (edgeStartNode && edgeEndNode) {
					break;
				}
			}

			// Initiate the edge object
			edge = {
				name: element.attributes["data-name"]
					? element.attributes["data-name"].textContent
					: element.attributes.id
					? element.attributes.id.textContent
					: null,
				edgeWeight: element.getTotalLength(),
				edgeStartNode,
				edgeEndNode,
				edgePath,
				edgeType
			};

			console.log(edgeType);

			// Construct the string that will be entered in the svg
			edge.svgPath = `<path class="edge ${edgeType}" id="edge-${index}" ${
				edge.name ? `data-name="${edge.name}"` : ""
			} d="${edge.edgePath}"/>`;

			// Add the edge to the graph
			graph.addEdge(index, edge);
			index++;
		});
	});

	// Create the text for the database files

	// Create an array of all the node and edge svgPaths, join them in a string, and log the string
	let nodesSVGArray = [];
	for (convertedNode in graph.adjacencyList.nodes) {
		nodesSVGArray.push(graph.adjacencyList.nodes[convertedNode].svgPath);
	}
	let edgeSVGArray = [];
	for (convertedEdge in graph.adjacencyList.edges) {
		edgeSVGArray.push(graph.adjacencyList.edges[convertedEdge].svgPath);
	}
	console.log(`
			<?xml-stylesheet type="text/css" href="../css/svg.css" ?>
			<svg xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
			<title>nildrohainmap_colour_elements</title>
			<g id="Layer_1" data-name="Layer 1">
			<image width="1920" height="1080" xlink:href="nildrohainmap_colour.jpg"/>
			</g>
			<g id="Edges">
			${edgeSVGArray.join("")}
			</g>
			<g id="Nodes">
			${nodesSVGArray.join("")}
			</g>
			</svg>
			`);

	// Log a stringified version of the graph
	console.log(JSON.stringify(graph.adjacencyList));
};
