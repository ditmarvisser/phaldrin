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
		parseInt(selectedNode)
	);
	// console.log(pathfinderNodes);
	if (pathfinderNodes.length === 1) {
		// Clear the UI
		pathfindView.clearActiveNodes();
		pathfindView.clearDisplayedPath();
		pathfindView.clearDisplayedRestingSpots();
		// Display the chosen node on the page
		pathfindView.displayActiveNode(selectedNode, "start");
	} else if (pathfinderNodes.length === 2) {
		pathfindView.displayActiveNode(selectedNode, "target");
		// Create a new pathfind object
		state.pathfind = new Pathfind();

		try {
			// Calculate the shortest path
			await state.pathfind.aStar(...pathfinderNodes);
			// Display the path
			pathfindView.displayPath(state.pathfind.traveledPath);
		} catch (error) {
			console.log(error);
		}

		// Display the resting spots
		pathfindView.displayRestingSpots(state.pathfind.traveledPath, pathfinderNodes[0]);

		// Clear the pathfinderNodes list
		pathfinderNodes.length = 0;
	}
};

mapTransform.mapTransform();
