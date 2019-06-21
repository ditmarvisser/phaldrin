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
		.contentDocument.getElementById("Roads");
	completedPath.forEach(e => {
		Array.prototype.forEach.call(svgRoads.children, function(e2) {
			if (parseInt(e2.id.substring(7)) === e[2]) {
				e2.classList.add("roadActive");
			}
		});
	});
};

export const clearDisplayedPath = () => {
	const svgRoads = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Roads");
	Array.prototype.forEach.call(svgRoads.children, function(e) {
		e.classList.remove("roadActive");
	});
};
