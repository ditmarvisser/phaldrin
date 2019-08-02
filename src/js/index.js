import Pathfind from "./models/Pathfind";
import * as pathfindView from "./views/pathfindView";
import * as SVGConvert from "./models/SVGConvert";
import * as mapTransform from "./views/mapTransform";

const state = {};

// When the user click the super secret dev button log a new data.json and data.svg
document.getElementById("data-download").addEventListener("click", function() {
	SVGConvert.convertSVG();
});

/**
 * PATHFINDER CONTROLLER
 */

let pathfinderNodes = [];
let svg;

export const controlPathfind = async selectedNode => {
	pathfinderNodes.push(
		parseInt(selectedNode.path[0].attributes.id.nodeValue.substring(5))
	);
	if (pathfinderNodes.length === 1) {
		// Clear the UI
		pathfindView.clearActiveNodes();
		pathfindView.clearDisplayedPath();
		// Display the chosen node on the page
		pathfindView.displayActiveNode(selectedNode);
	} else if (pathfinderNodes.length === 2) {
		pathfindView.displayActiveNode(selectedNode);
		// Create a new pathfind object
		state.pathfind = new Pathfind();

		// Calculate the shortest path
		try {
			await state.pathfind.aStar(...pathfinderNodes);
			// Display the path
			pathfindView.displayPath(state.pathfind.traveledPath);
		} catch (error) {
			console.log(error);
		}
		// Clear the pathfinderNodes list
		pathfinderNodes.length = 0;
	}
};

window.onload = function() {
	svg = document.getElementById("mapSVG");
	svg.contentDocument
		.getElementById("Nodes")
		.addEventListener("click", selectedNode => {
			controlPathfind(selectedNode);
		});
};
mapTransform.mapTransform();
