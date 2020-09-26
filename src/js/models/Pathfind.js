import data from "./data";
import PriorityQueue from "./PriorityQueue";

export default class pathfinder {
	constructor() {
		this.traveledPath = [];
	}

	aStar(startingNode, targetNode) {
		// Start a timer for performance
		let t0 = performance.now();

		// Initiate a new priority queue, an empty distances object, and an empty shortest connections object
		const queue = new PriorityQueue();
		const distancesFromStartingNode = {};
		const shortestConnection = {};
		let topPriorityNode;

		// Build the initial state
		for (let node in data.nodes) {
			if (node == startingNode) {
				distancesFromStartingNode[node] = 0;
				queue.enqueue(node, 0);
			} else {
				distancesFromStartingNode[node] = Infinity;
				queue.enqueue(node, Infinity);
			}
			shortestConnection[node] = [null, null];
		}

		// debugger;
		// as long as there is something to visit
		while (queue.values.length) {
			topPriorityNode = queue.dequeue().node;
			// If the top priority node is the target node, build up a path to return
			if (topPriorityNode == targetNode) {
				while (shortestConnection[topPriorityNode][0]) {
					this.traveledPath.unshift(
						shortestConnection[topPriorityNode]
					);
					topPriorityNode = shortestConnection[topPriorityNode][0];
				}
				break;
			} else if (
				topPriorityNode ||
				distancesFromStartingNode[topPriorityNode] !== Infinity
			) {
				for (let neighbor in data.nodes[topPriorityNode].connections) {
					//find neighboring node
					let nextNode =
						data.nodes[topPriorityNode].connections[neighbor];

					if (
						document.getElementById("badlands-checkbox").checked ||
						data.edges[nextNode.edge].edgeType != "badlands"
					) {
						//calculate new distance to neighboring node
						let coordinates = data.nodes[nextNode.node].coordinates;
						let targetCoordinates =
							data.nodes[targetNode].coordinates;
						let xDistance = coordinates[0] - targetCoordinates[0];
						let yDistance = coordinates[1] - targetCoordinates[1];
						let euclidianDistance = Math.sqrt(
							xDistance * xDistance + yDistance * yDistance
						);
						let candidate =
							distancesFromStartingNode[topPriorityNode] +
							data.edges[nextNode.edge].edgeWeight +
							euclidianDistance;
						let nextNeighbor = nextNode.node;

						if (
							candidate < distancesFromStartingNode[nextNeighbor]
						) {
							//updating new topNode distance to neighbor
							distancesFromStartingNode[nextNeighbor] = candidate;
							//updating shortest connection - How we got to neighbor
							shortestConnection[nextNeighbor] = [
								topPriorityNode,
								nextNode.edge
							];
							//enqueue in priority queue with new priority
							queue.enqueue(nextNeighbor, candidate);
						}
					}
				}
			}
		}

		// console.log(this.traveledPath);

		let t1 = performance.now();
		console.log(`Calculations took ${t1 - t0} milliseconds.`);
	}
}
