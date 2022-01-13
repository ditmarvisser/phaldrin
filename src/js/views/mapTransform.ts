import * as index from "../index";
import data from "../models/data.json";
import * as geoDataInterface from "../base";

let geoData: geoDataInterface.geoData = data;
let svg: SVGSVGElement, viewBox: DOMRect;

export const mapTransform = () => {
	window.onload = function () {
		svg = (<HTMLObjectElement>(
			document.getElementById("mapSVG")!
		)).contentDocument!.getElementById("map-svg")!;

		// We save the original values from the viewBox
		viewBox = svg.viewBox.baseVal;
		// console.log(viewBox);

		svg.addEventListener("pointerdown", onPointerDown); // Pointer is pressed
		svg.addEventListener("pointerup", onPointerUp); // Releasing the pointer
		// svg.addEventListener("pointerleave", onPointerUp); // Pointer gets out of the SVG area
		svg.addEventListener("pointermove", onPointerMove); // Pointer is moving
		svg.addEventListener("wheel", onScroll);

		scaleNodes();
	};
};

// This function returns an object with X & Y values from the pointer event
const getPointFromEvent = (event: PointerEvent | WheelEvent) => {
	let point = svg.createSVGPoint();
	// If event is triggered by a touch event, we get the position of the first finger

	point.x = event.clientX;
	point.y = event.clientY;

	var invertedSVGMatrix = svg.getScreenCTM()!.inverse();

	return point.matrixTransform(invertedSVGMatrix);
};

// This variable will be used later for move events to check if pointer is down or not
let isPointerDown = false;
let hasMoved = false;

// This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
let pointerOrigin = {
	x: 0,
	y: 0,
};

// Function called by the event listeners when user start pressing/touching
const onPointerDown = (event: PointerEvent) => {
	// controlPathfind.controlPathfind();
	isPointerDown = true; // We set the pointer as down

	// We get the pointer position on click/touchdown so we can get the value once the user starts to drag
	pointerOrigin = getPointFromEvent(event);
};

// Function called by the event listeners when user start moving/dragging
const onPointerMove = (event: PointerEvent) => {
	// Only run this function if the pointer is down
	if (!isPointerDown) {
		return;
	}
	// This prevent user to do a selection on the page
	event.preventDefault();

	// Prevent the pathfinding
	hasMoved = true;

	// Get the pointer position as an SVG Point
	var pointerPosition = getPointFromEvent(event);

	// Update the viewBox variable with the distance from origin and current position
	// We don't need to take care of a ratio because this is handled in the getPointFromEvent function
	viewBox.x -= pointerPosition.x - pointerOrigin.x;
	viewBox.y -= pointerPosition.y - pointerOrigin.y;
};

// Function called by the event listeners when user stops pressing/touching
const onPointerUp = (event: PointerEvent) => {
	// If the pointer hasn't moved, add the node to pathfinding

	if (!hasMoved) {
		let clickPoint = getPointFromEvent(event);
		let closestNode: number[] = [];
		for (const key in geoData.nodes) {
			let nodeCoordinates = geoData.nodes[key].coordinates;
			let distanceToNode = Math.hypot(
				Math.abs(clickPoint.x - nodeCoordinates[0]),
				Math.abs(clickPoint.y - nodeCoordinates[1])
			);
			if (!closestNode[1]) {
				closestNode[0] = parseInt(key);
				closestNode[1] = distanceToNode;
			} else if (closestNode[1] > distanceToNode) {
				closestNode[0] = parseInt(key);
				closestNode[1] = distanceToNode;
			}
		}
		index.controlPathfind(closestNode[0]);
	}
	// The pointer is no longer considered as down
	isPointerDown = false;
	hasMoved = false;
};

// Function called by the event listeners when user starts scrolling
const onScroll = (event: WheelEvent) => {
	// We get the pointer position on click/touchdown so we can get the value once the user starts to zoom
	pointerOrigin = getPointFromEvent(event);

	// If scroll up --> zoom in, scroll down --> zoom out
	if (event.deltaY === 100) {
		viewBox.x -= (pointerOrigin.x - viewBox.x) * 0.1;
		viewBox.y -= (pointerOrigin.y - viewBox.y) * 0.1;
		viewBox.width *= 1.1;
		viewBox.height *= 1.1;
	} else if (event.deltaY === -100) {
		viewBox.x += (pointerOrigin.x - viewBox.x) / 1.1 / 10;
		viewBox.y += (pointerOrigin.y - viewBox.y) / 1.1 / 10;
		viewBox.width /= 1.1;
		viewBox.height /= 1.1;
	}
	scaleNodes();
};

export const scaleNodes = () => {
	for (const node of (<HTMLObjectElement>(
		document.getElementById("mapSVG")!
	)).contentDocument!.getElementById("Nodes")!.children) {
		node.setAttribute("r", (viewBox.width / 250).toString());
		(<HTMLElement>node).style.strokeWidth = (
			viewBox.width / 2500
		).toString();
	}
	for (const node of (<HTMLObjectElement>(
		document.getElementById("mapSVG")!
	)).contentDocument!.getElementById("RestNodes")!.children) {
		node.setAttribute("r", (viewBox.width / 250).toString());
		(<HTMLElement>node).style.strokeWidth = (
			viewBox.width / 2500
		).toString();
	}
};
