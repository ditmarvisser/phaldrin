import { elements } from "./base";

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
	completedPath.forEach(e => {
		svgRoads.children[e[1]].classList.add("edgeActive");
	});
};

export const clearDisplayedPath = () => {
	const svgRoads = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Edges");
	Array.prototype.forEach.call(svgRoads.children, function(e) {
		e.classList.remove("edgeActive");
	});
};
