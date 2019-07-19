import WeightedGraph from "./WeightedGraph";

export const convertSVG = type => {
	// Initiate the graph
	let graph = new WeightedGraph();

	// Create an array of all nodes in the SVG and itterate over them, converting it to usable data
	let nodeElement;
	Array.from(
		document
			.getElementById("mapSVG")
			.contentDocument.getElementById("Nodes").children
	).forEach((element, index) => {
		nodeElement = {
			name: element.attributes["data-name"]
				? element.attributes["data-name"].textContent
				: element.attributes.id
				? element.attributes.id.textContent
				: null,
			coordinates: [
				parseFloat(element.attributes.cx.value),
				parseFloat(element.attributes.cy.value)
			],

			connections: []
		};

		nodeElement.svgPath = `<circle class="node" id="node-${index}" ${
			nodeElement.name ? `data-name="${nodeElement.name}"` : ""
		} cx="${nodeElement.coordinates[0]}" cy="${
			nodeElement.coordinates[1]
		}" r="10"/>`;

		graph.addNode(index, nodeElement);
	});

	// Create an array of all nodes in the SVG and itterate over them, converting it to usable data
	let roadPath,
		roadPathBegin,
		roadPathEnd,
		roadStartNode,
		roadEndNode,
		roadElement,
		node;
	Array.from(
		document
			.getElementById("mapSVG")
			.contentDocument.getElementById("Roads").children
	).forEach((road, index) => {
		roadPath = road.attributes.d.nodeValue;
		roadPathBegin = roadPath
			.split(/(?=[A-Z])/gi)[0]
			.split(/M|,/)
			.splice(1)
			.map(e => parseFloat(e));
		roadPathEnd = [
			Math.round(road.getPointAtLength(road.getTotalLength()).x * 10) /
				10,
			Math.round(road.getPointAtLength(road.getTotalLength()).y * 10) / 10
		];

		roadStartNode = undefined;
		roadEndNode = undefined;

		for (node in graph.adjacencyList.nodes) {
			if (
				graph.adjacencyList.nodes[node].coordinates[0] ===
					roadPathBegin[0] &&
				graph.adjacencyList.nodes[node].coordinates[1] ===
					roadPathBegin[1]
			) {
				roadStartNode = node;
			}
			if (
				graph.adjacencyList.nodes[node].coordinates[0] ===
					roadPathEnd[0] &&
				graph.adjacencyList.nodes[node].coordinates[1] ===
					roadPathEnd[1]
			) {
				roadEndNode = node;
			}
			if (roadStartNode && roadEndNode) {
				break;
			}
		}

		roadElement = {
			name: road.attributes["data-name"]
				? road.attributes["data-name"].textContent
				: road.attributes.id
				? road.attributes.id.textContent
				: null,
			roadLength: road.getTotalLength(),
			roadStartNode: roadStartNode,
			roadEndNode: roadEndNode,
			roadPath
		};
		roadElement.svgPath = `<path class="road" id="road-${
			index
		}" ${roadElement.name ? `data-name="${roadElement.name}"` : ""} d="${
			roadElement.roadPath
		}"/>`;

		graph.addEdge(roadElement, index);
		// tempDataRoads.push(roadElement);
	});

	
	// Create the text for the file download
	if (type === "svg") {
		let roadsSVG = []
		let edge;
		for (edge in graph.adjacencyList.edges) {
			roadsSVG.push(graph.adjacencyList.edges[edge].svgPath)
		}
		let nodesSVG = []
		let node2;
		for (node2 in graph.adjacencyList.nodes) {
			nodesSVG.push(graph.adjacencyList.nodes[node2].svgPath)
		}
		return `
			<?xml-stylesheet type="text/css" href="../css/svg.css" ?>
			<svg xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
			<title>nildrohainmap_colour_elements</title>
			<g id="Layer_1" data-name="Layer 1">
			<image width="1920" height="1080" xlink:href="nildrohainmap_colour.jpg"/>
			</g>
			<g id="Roads">
			${roadsSVG.join('')}
			</g>
			<g id="Nodes">
			${nodesSVG.join('')}
			</g>
			</svg>
			`;
	} else if (type === "json") {
		return JSON.stringify(graph.adjacencyList);
	}
};

export const download = (filename, text) => {
	// Make the button clickable
	const element = document.createElement("a");
	element.style.display = "none";

	// Define the data of the file using encodeURIComponent
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(text)
	);

	// Add the download attribute of the hidden link
	element.setAttribute("download", filename);
	document.body.appendChild(element);

	// Simulate click of the created link
	element.click();

	document.body.removeChild(element);
};
