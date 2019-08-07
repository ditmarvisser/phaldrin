import data from "../models/data";

export const displayActiveNode = node => {
	node.path[0].classList.toggle("nodeActive");
};

export const clearActiveNodes = () => {
	const svgNodes = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Nodes");
	Array.prototype.forEach.call(svgNodes.children, function(e) {
		e.classList.remove("nodeActive");
	});
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

	document.querySelector(".traveled-time-distance").innerHTML = `${Math.round(
		traveledDistance / 6
	)} miles (${Math.round((traveledDistance / 6) * 1.609)} kilometers)`;
	document.querySelector(".traveled-time-time").innerHTML = `${Math.round(
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
};
