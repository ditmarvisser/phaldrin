import data from "../models/data.json";
import * as geoDataInterface from "../base"
import * as mapTransform from "./mapTransform";

let geoData: geoDataInterface.geoData = data;

export const displayActiveNode = (node: number, position: string) => {
	const svg = (<HTMLObjectElement>document.getElementById("mapSVG")).contentDocument;
	let newElement, nodeCoordinates;
	
	nodeCoordinates = geoData.nodes[node].coordinates;

	newElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"circle"
		);
	newElement.setAttributeNS(null, "class", "Node");
	newElement.setAttributeNS(null, "cx", nodeCoordinates[0].toString());
	newElement.setAttributeNS(null, "cy", nodeCoordinates[1].toString());
	newElement.setAttributeNS(null, "r", "10");
	svg!.getElementById("Nodes")!
		.appendChild(newElement);
	

	
	if (position === "start") {
		document.getElementById("starting-point-name")!.innerHTML = node.toString();
	} else if (position === "target") {
		document.getElementById("target-point-name")!.innerHTML = node.toString();
	}

	mapTransform.scaleNodes();
};

export const clearNodes = () => {
	// Delete all spots
	const svgNodes = (<HTMLObjectElement>document.getElementById("mapSVG")!).contentDocument!.getElementById("Nodes");
	while (svgNodes!.firstChild) {
		svgNodes!.removeChild(svgNodes!.firstChild);
	}

	// Delete all resting spots
	const svgRestNodes = (<HTMLObjectElement>document.getElementById("mapSVG")!).contentDocument!.getElementById("RestNodes");
	while (svgRestNodes!.firstChild) {
		svgRestNodes!.removeChild(svgRestNodes!.firstChild);
	}
	
	document.getElementById("starting-point-name")!.innerHTML = "...";
	document.getElementById("target-point-name")!.innerHTML = "...";
};

export const displayPath = (completedPath: [string, string][]) => {
	const svgRoads = (<HTMLObjectElement>document.getElementById("mapSVG")!).contentDocument!.getElementById("Edges");
	let traveledDistance = 0;
	// console.log(svgRoads.children);

	completedPath.forEach(traveledRoad => {
		for (let i = 0; i < svgRoads!.children.length; i++) {
			if (svgRoads!.children[i].id.substring(5) == traveledRoad[1]) {
				svgRoads!.children[i].classList.add("edgeActive");
				break;
			}
		}
		traveledDistance += geoData.edges[traveledRoad[1]].edgeWeight;
	});

	document.getElementById("traveled-time-distance")!.innerHTML = `${Math.round(
		traveledDistance / 1000 / 1.609
	)} miles (${Math.round(traveledDistance) / 1000} kilometers)`;
	document.getElementById("traveled-time-time")!.innerHTML = `${Math.round(
		(traveledDistance / 1000 / 1.609 / 24) * 10
	) / 10} days`;
};

export const clearDisplayedPath = () => {
	const svgRoads = (<HTMLObjectElement>document.getElementById("mapSVG")!).contentDocument!.getElementById("Edges");
	Array.prototype.forEach.call(svgRoads!.children, function(e) {
		e.classList.remove("edgeActive");
	});
	document.getElementById("traveled-time-distance")!.innerHTML = "... miles";
	document.getElementById("traveled-time-time")!.innerHTML = "... days";
};

export const displayRestingSpots = (completedPath: [string, string][], startingNode: number) => {
	const svg = (<HTMLObjectElement>document.getElementById("mapSVG")).contentDocument;
	let edge: geoDataInterface.EdgeInterface,
		edgeSVGposition: number,
		edgeDirection: string,
		edgeWeight: number,
		traveledDistance: number,
		svgPoint: SVGPoint,
		newElement: SVGCircleElement,
		distanceOnEdge: number;
	let edgeStartingNode = startingNode;
	let residualWeight = 0;

	// For each path,
	completedPath.forEach(e => {
		edge = geoData.edges[e[1]];
		edgeWeight = edge.edgeWeight;
		traveledDistance = 0 - residualWeight;

		// Compute the position of the edge in the SVG array
		for (let i = 0; i < svg!.getElementById("Edges")!.children.length; i++) {
			if (svg!.getElementById("Edges")!.children[i].id.substring(5) == e[1]) {
					// console.log(svg.getElementById("Edges").children[i]);
					edgeSVGposition = i
					break
				}
			}
		

		// Take the path and compute if the individual paths are reversed or not
		if (edge.edgeStartNode == edgeStartingNode) {
			edgeDirection = "regular";
			edgeStartingNode = edge.edgeEndNode;
		} else {
			edgeDirection = "reversed";
			edgeStartingNode = edge.edgeStartNode;
		}

		// add resting spots every x distance
		while (edgeWeight - traveledDistance > 24 * 1609) {
			traveledDistance += 24 * 1609;
			if (edgeDirection === "regular") {
				distanceOnEdge = traveledDistance;
			} else if (edgeDirection === "reversed") {
				distanceOnEdge = edgeWeight - traveledDistance;
			}
			svgPoint = (<SVGPathElement>svg!
				.getElementById("Edges")!
				.children[edgeSVGposition]).getPointAtLength(distanceOnEdge);

			newElement = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"circle"
			);
			newElement.setAttributeNS(null, "class", "restNode");
			newElement.setAttributeNS(null, "cx", svgPoint.x.toString());
			newElement.setAttributeNS(null, "cy", svgPoint.y.toString());
			newElement.setAttributeNS(null, "r", "10");
			svg!.getElementById("RestNodes")!
				.appendChild(newElement);
		}
		// carrying over any residual distance
		residualWeight = edgeWeight - traveledDistance;
	});
	mapTransform.scaleNodes();
};