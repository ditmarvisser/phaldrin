export default class pathfinder {
	constructor(startingNode, targetNode, data) {
		this.startingNode = startingNode;
		this.targetNode = targetNode;
		this.data = JSON.parse(JSON.stringify(data))
	}
	
	
	pathfind() {
		// console.log(this.data)
		// Start a timer for performance
		let t0 = performance.now();

		// Set the complete starting and a target node
		this.startingNode = this.data.nodes.find(
			element => element.nodeID === this.startingNode
		);
		this.targetNode = this.data.nodes.find(
			element => element.nodeID === this.targetNode
		);

		// Initiate the checklist
		const checklist = {
			openNodes: [],
			closedNodes: []
		};
		const calculateDistance = node => {
			let traveledDistance = 0;
			// If there are parentNode
			if (node.parentNode) {
				// Take the road just traveled and add the traveledDistance from the parent node. This is the total traveledDistance of the current node.
				traveledDistance =
					this.data.roads.find(
						element => element.roadID === node.parentNode.roadID
					).roadLength + checklist.closedNodes[0].traveledDistance;
			}

			// Calculate the x and y distance between the current node and the target node, and then the heuristic cost
			const xDistance = Math.abs(
				node.coordinates[0] - this.targetNode.coordinates[0]
			);
			const yDistance = Math.abs(
				node.coordinates[1] - this.targetNode.coordinates[1]
			);
			const heuristicCost = xDistance * xDistance + yDistance * yDistance;

			const totalCost = traveledDistance + heuristicCost;

			return {
				...node,
				traveledDistance,
				heuristicCost,
				totalCost
			};
		};

		// Add the starting node (with calculated distances) to the open list
		checklist.openNodes.push(calculateDistance(this.startingNode));

		let searching = true;
		while (searching) {
			// Sort the openNodes array on ascending total cost
			checklist.openNodes.sort((a, b) => a.totalCost - b.totalCost);

			// Check if the closest node is the target node.
			if (checklist.openNodes[0].nodeID === this.targetNode.nodeID) {
				searching = false;
				let completedPath = [];
				const findParent = node => {
					if (node.parentNode) {
						// Add to the completedPath array: Starting point, destination, road used
						completedPath.unshift([
							node.parentNode.nodeID,
							node.nodeID,
							node.parentNode.roadID
						]);
						findParent(
							checklist.closedNodes.find(
								element =>
									element.nodeID === node.parentNode.nodeID
							)
						);
					}
				};
				findParent(checklist.openNodes[0]);
				// console.log(completedPath);
				this.completedPath = completedPath;
				console.log(
					`We have arrived at our destination after traveling ${checklist
						.openNodes[0].traveledDistance /
						6} miles. It will take ${Math.round(
						(checklist.openNodes[0].traveledDistance / 6 / 24) * 10
					) / 10} days of normal paced travel.`
				);
				let t1 = performance.now();
				console.log(`Calculations took ${t1 - t0} milliseconds.`);
			} else {
				// Move the lowest total cost node to the start of the closed list
				checklist.closedNodes.unshift(checklist.openNodes.shift());

				// For each connection to the current node
				checklist.closedNodes[0].connections.forEach(element => {
					// Check if the connection is already in the closedNodes array
					if (
						checklist.closedNodes.findIndex(
							element2 => element2.nodeID === element.nodeID
						) === -1
					) {
						// Select the full node
						let fullElement = this.data.nodes.find(
							element3 => element3.nodeID === element.nodeID
						);
						// Check if it is in the openNodes array, if it is return the index in openNodes, if not return -1
						const nodeIndex = checklist.openNodes.findIndex(
							element4 => element4.nodeID === element.nodeID
						);
						// Make the current node the parent of the connection
						fullElement.parentNode = {
							nodeID: checklist.closedNodes[0].nodeID,
							roadID: element.roadID
						};
						const currentNode = calculateDistance(fullElement);
						if (nodeIndex === -1) {
							// Add the connection to the open list with calculated distances
							checklist.openNodes.push(currentNode);
						} else {
							// Take the traveled distance from the existing openNode and compare it to the new connection
							if (
								checklist.openNodes[nodeIndex]
									.traveledDistance >
								currentNode.traveledDistance
							) {
								checklist.openNodes.splice(nodeIndex, 1);
								checklist.openNodes.push(currentNode);
							}
						}
					}
				});
			}
		}
	}
}
