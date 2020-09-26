import data from "../models/data";

export const displayActiveNode = (node, position) => {
	document
		.getElementById("mapSVG")
		.contentDocument.getElementById(`node-${node}`).classList.toggle("nodeActive");
	if (position === "start") {
		document.getElementById("starting-point-name").innerHTML = `${
			data.nodes[node].name
		}`;
	} else if (position === "target") {
		document.getElementById("target-point-name").innerHTML = `${
			data.nodes[node].name
		}`;
	}
};

export const clearActiveNodes = () => {
	const svgNodes = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Nodes");
	Array.prototype.forEach.call(svgNodes.children, function(e) {
		e.classList.remove("nodeActive");
	});
	document.getElementById("starting-point-name").innerHTML = "...";
	document.getElementById("target-point-name").innerHTML = "...";
};

export const displayPath = completedPath => {
	const svgRoads = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Edges");
	let traveledDistance = 0;
	completedPath.forEach(e => {
		svgRoads.children[e[1]].classList.add("edgeActive");
		traveledDistance += data.edges[e[1]].edgeWeight;
	});

	// console.log(data);

	document.getElementById("traveled-time-distance").innerHTML = `${Math.round(
		traveledDistance / 6
	)} miles (${Math.round((traveledDistance / 6) * 1.609)} kilometers)`;
	document.getElementById("traveled-time-time").innerHTML = `${Math.round(
		(traveledDistance / 6 / 24) * 10
	) / 10} days`;
};

export const clearDisplayedPath = () => {
	const svgRoads = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Edges");
	Array.prototype.forEach.call(svgRoads.children, function(e) {
		e.classList.remove("edgeActive");
	});
	document.getElementById("traveled-time-distance").innerHTML = "... miles";
	document.getElementById("traveled-time-time").innerHTML = "... days";
};

export const displayRestingSpots = (completedPath, startingNode) => {
	const svg = document.getElementById("mapSVG").contentDocument;
	let edge, edgeDirection, edgeWeight, traveledDistance, svgPoint, newElement;
	let edgeStartingNode = startingNode;
	let residualWeight = 0;

	// For each path,
	completedPath.forEach(e => {
		edge = data.edges[e[1]];
		edgeWeight = edge.edgeWeight;
		traveledDistance = 0 - residualWeight;

		// Take the path and compute if the individual paths are reversed or not
		if (edge.edgeStartNode == edgeStartingNode) {
			edgeDirection = "regular";
			edgeStartingNode = edge.edgeEndNode;
		} else {
			edgeDirection = "reversed";
			edgeStartingNode = edge.edgeStartNode;
		}

		// add resting spots every x distance
		while (edgeWeight - traveledDistance > 144) {
			traveledDistance += 144;
			if (edgeDirection === "regular") {
				svgPoint = svg
					.getElementById("Edges")
					.children[e[1]].getPointAtLength(traveledDistance);
			} else if (edgeDirection === "reversed") {
				svgPoint = svg
					.getElementById("Edges")
					.children[e[1]].getPointAtLength(
						edgeWeight - traveledDistance
					);
			}
			newElement = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"circle"
			);
			newElement.setAttributeNS(null, "class", "restNode");
			newElement.setAttributeNS(null, "cx", svgPoint.x);
			newElement.setAttributeNS(null, "cy", svgPoint.y);
			newElement.setAttributeNS(null, "r", 10);
			svg.documentElement
				.getElementById("RestNodes")
				.appendChild(newElement);
		}
		// carrying over any residual distance
		residualWeight = edgeWeight - traveledDistance;
	});
};

export const clearDisplayedRestingSpots = () => {
	// Delete all resting spots
	const svgRestNodes = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("RestNodes");
	while (svgRestNodes.firstChild) {
		svgRestNodes.removeChild(svgRestNodes.firstChild);
	}
};
