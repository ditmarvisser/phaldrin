import data from "./models/data";
import Pathfind from "./models/Pathfind";
import * as pathfindView from "./views/pathfindView";
import * as SVGConvert from "./models/SVGConvert";
import { elements } from "./views/base";

const state = {};

// When the user clicks the download button, start the download
document.getElementById("data-download").addEventListener("click", function() {
	// Generate download of file with content
	console.log(SVGConvert.convertSVG("svg"))
	console.log(SVGConvert.convertSVG("json"))

	// SVGConvert.download("data.svg", SVGConvert.convertSVG("svg"));
	// SVGConvert.download("data.json", SVGConvert.convertSVG("json"));
});

/**
 * PATHFINDER CONTROLLER
 */

let pathfinderNodes = [];
let svgNodes;

const controlPathfind = async selectedNode => {
	pathfinderNodes.push(
		parseInt(selectedNode.path[0].attributes.id.nodeValue.substring(7))
	);
	if (pathfinderNodes.length === 1) {
		// Clear the UI
		pathfindView.clearActiveNodes();
		pathfindView.clearDisplayedPath()
		// Display the chosen node on the page
		pathfindView.displayActiveNode(selectedNode);
	} else if (pathfinderNodes.length === 2) {
		pathfindView.displayActiveNode(selectedNode);
		// Create a new pathfind object
		state.pathfind = new Pathfind(...pathfinderNodes, data);
		console.log(data)
		// Calculate the shortest path
		// debugger;
		try {
			await state.pathfind.pathfind();
			console.log(state.pathfind)
		} catch (error) {
			console.log(error);
		}
		// Display the path
		pathfindView.displayPath(state.pathfind.completedPath)
		// Clear the pathfinderNodes list
		pathfinderNodes = [];
	}
};

window.onload = function() {
	svgNodes = document
		.getElementById("mapSVG")
		.contentDocument.getElementById("Nodes");
	svgNodes.addEventListener("click", selectedNode => {
		controlPathfind(selectedNode);
	});
};

