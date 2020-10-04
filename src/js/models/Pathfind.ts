import data from "./data.json";
import PriorityQueue from "./PriorityQueue";
import { geoData } from "../base"

let geoData: geoData = data;

export default class pathfinder {
	traveledPath: [string, string][] = [];

	aStar(startingNode: number, targetNode: number) {
		// Start a timer for performance
		let t0 = performance.now();

		// Initiate a new priority queue, an empty distances object, and an empty shortest connections object
		const queue = new PriorityQueue();
		const distancesFromStartingNode: Record<string, number> = {};
		const shortestConnection: Record<string, [string, string]> = {};
		let topPriorityNode: string;

		// Build the initial state
		for (let node in data.nodes) {
			if (parseInt(node) == startingNode) {
				distancesFromStartingNode[node] = 0;
				queue.enqueue(node, 0);
			} else {
				distancesFromStartingNode[node] = Infinity;
				queue.enqueue(node, Infinity);
			}
			shortestConnection[node] = ["", ""];
		}

		// debugger;
		// as long as there is something to visit
		while (queue.values.length) {
			topPriorityNode = queue.dequeue().node;
			// If the top priority node is the target node, build up a path to return
			if (parseInt(topPriorityNode) == targetNode) {
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
				for (let neighbor in geoData.nodes[topPriorityNode].connections) {
					//find neighboring node
					let nextNode =
						geoData.nodes[topPriorityNode].connections[neighbor];

					if (
						(<HTMLInputElement>document.getElementById("badlands-checkbox")).checked ||
						geoData.edges[nextNode.edge].edgeType != "badlands"
					) {
						//calculate new distance to neighboring node
						let coordinates = geoData.nodes[nextNode.node].coordinates;
						let targetCoordinates =
							geoData.nodes[targetNode].coordinates;
						let xDistance = coordinates[0] - targetCoordinates[0];
						let yDistance = coordinates[1] - targetCoordinates[1];
						let euclidianDistance = Math.sqrt(
							xDistance * xDistance + yDistance * yDistance
						);
						let candidate =
							distancesFromStartingNode[topPriorityNode] +
							geoData.edges[nextNode.edge].edgeWeight +
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
								nextNode.edge.toString()
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
