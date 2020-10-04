import Pathfind from "./models/Pathfind";
import * as pathfindView from "./views/pathfindView";
import * as mapTransform from "./views/mapTransform";
import * as ConvertGEOJSON from "./models/ConvertGEOJSON";

const state = {} as any;

// When the user click the super secret dev button log a new data.json and data.svg
document.getElementById("data-download")!.addEventListener("click", function () {
	ConvertGEOJSON.convertGEOJSON();
});

/**
 * PATHFINDER CONTROLLER
 */

let pathfinderNodes: number[] = [];

export const controlPathfind = async (selectedNode: number) => {
	pathfinderNodes.push(selectedNode);
	// console.log(pathfinderNodes);
	if (pathfinderNodes.length === 1) {
		// Clear the UI
		pathfindView.clearNodes();
		pathfindView.clearDisplayedPath();
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
		pathfindView.displayRestingSpots(
			state.pathfind.traveledPath,
			pathfinderNodes[0]
		);

		// Clear the pathfinderNodes list
		pathfinderNodes.length = 0;
	}
};

mapTransform.mapTransform();
