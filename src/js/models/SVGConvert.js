import WeightedGraph from "./WeightedGraph"


export const convertSVG = type => {
	let graph = new WeightedGraph();

	// Create an array of all nodes in the SVG
	let svgNodesArray = Array.from(
		document
			.getElementById("mapSVG")
			.contentDocument.getElementById("Nodes").children
	);
	
	// Convert the svg elements to usable data
	let tempDataNodes = [];
	svgNodesArray.forEach((element, index) => {
		const nodeElement = {
			nodeID: index,
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
		nodeElement.svgPath = `<circle class="node" id="nodeID-${
			nodeElement.nodeID
		}" ${nodeElement.name ? `data-name="${nodeElement.name}"` : ""} cx="${
			nodeElement.coordinates[0]
		}" cy="${nodeElement.coordinates[1]}" r="10"/>`;
		tempDataNodes.push(nodeElement);
	});

	// Create an array of all roads in the SVG
	const svgRoads = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Roads");
	let svgRoadsArray = Array.from(svgRoads.children);
	
	// Convert the svg elements to usable data
	let tempDataRoads = [];
	svgRoadsArray.forEach((element, index) => {
		const roadPath = element.attributes.d.nodeValue;
		const roadPathSplit = roadPath.split(/(?=[A-Z])/gi);
		const roadPathBegin = roadPathSplit[0]
			.split(/M|,/)
			.splice(1)
			.map(e => parseFloat(e));
		const roadPathEnd = [
			Math.round(
				element.getPointAtLength(element.getTotalLength()).x * 10
			) / 10,
			Math.round(
				element.getPointAtLength(element.getTotalLength()).y * 10
			) / 10
		];

		const roadStartNode = tempDataNodes.find(element => {
			if (
				element.coordinates[0] === roadPathBegin[0] &&
				element.coordinates[1] === roadPathBegin[1]
			) {
				return element;
			}
		});
		const roadEndNode = tempDataNodes.find(element => {
			if (
				element.coordinates[0] === roadPathEnd[0] &&
				element.coordinates[1] === roadPathEnd[1]
			) {
				return element;
			}
		});

		const roadElement = {
			roadID: index,
			name: element.attributes["data-name"]
				? element.attributes["data-name"].textContent
				: element.attributes.id
				? element.attributes.id.textContent
				: null,
			roadLength: element.getTotalLength(),
			roadStartNode: roadStartNode.nodeID,
			roadEndNode: roadEndNode.nodeID,
			roadPath
		};
		roadElement.svgPath = `<path class="road" id="roadID-${
			roadElement.roadID
		}" ${roadElement.name ? `data-name="${roadElement.name}"` : ""} d="${
			roadElement.roadPath
		}"/>`;
		tempDataRoads.push(roadElement);
	});

	// Link the nodes to the roads
	tempDataNodes.map(element => {
		tempDataRoads.forEach(element2 => {
			if (element2.roadStartNode === element.nodeID) {
				element.connections.push({
					roadID: element2.roadID,
					nodeID: tempDataNodes.find(
						element3 => element3.nodeID === element2.roadEndNode
					).nodeID
				});
			} else if (element2.roadEndNode == element.nodeID) {
				element.connections.push({
					roadID: element2.roadID,
					nodeID: tempDataNodes.find(
						element3 => element3.nodeID === element2.roadStartNode
					).nodeID
				});
			}
		});
	});

	// Create the text for the file download
	if (type === "svg") {
		return `
			<?xml-stylesheet type="text/css" href="../css/svg.css" ?>
			
			<svg xmlns="http://www.w3.org/2000/svg" 
			xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
			<title>nildrohainmap_colour_elements</title>
			<g id="Layer_1" data-name="Layer 1">
			<image width="1920" height="1080" xlink:href="nildrohainmap_colour.jpg"/>
			</g>
			<g id="Roads">
			${tempDataRoads.map(e => e.svgPath).join("")}
			</g>
			<g id="Nodes">
			${tempDataNodes.map(e => e.svgPath).join("")}
			</g>
			</svg>
			`;
	} else if (type === "json") {
		return `
			{
				"nodes": [${tempDataNodes.map(e => {
					return JSON.stringify({
						nodeID: e.nodeID,
						name: e.name,
						coordinates: e.coordinates,
						connections: e.connections
					});
				})}],
				"roads": [${tempDataRoads.map(e => {
					return JSON.stringify({
						roadID: e.roadID,
						roadLength: e.roadLength
					});
				})}]
			}
			`;
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
