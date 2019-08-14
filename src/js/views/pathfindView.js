import data from "../models/data";

export const displayActiveNode = (node, position) => {
	node.path[0].classList.toggle("nodeActive");
	if (position === "start") {
		document.getElementById("starting-point-name").innerHTML = `${
			data.nodes[node.path[0].attributes.id.nodeValue.substring(5)].name
		}`;
	} else if (position === "target") {
		document.getElementById("target-point-name").innerHTML = `${
			data.nodes[node.path[0].attributes.id.nodeValue.substring(5)].name
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

export const displayRestingSpots = (completedPath) => {
	// Take the path and compute if the individual paths are reversed or not

	// For each path,
		// If the path is reversed add the resting spots in reverse
		// add resting spots every x distance
		// carrying over any residual distance
}

export const clearDisplayedRestingSpots = () => {
	// Delete all resting spots
}