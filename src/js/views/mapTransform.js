let svg, widthOutput, heightOutput, viewBox;

export const mapTransform = () => {
	window.onload = function() {
		svg = document
			.getElementById("mapSVG")
			.contentDocument.getElementById("map-svg");

		// We save the original values from the viewBox
		viewBox = svg.viewBox.baseVal;
		console.log(viewBox);

		// Calculate the ratio based on the viewBox width and the SVG width
		reportSize();

		svg.addEventListener("pointerdown", onPointerDown); // Pointer is pressed
		svg.addEventListener("pointerup", onPointerUp); // Releasing the pointer
		svg.addEventListener("pointerleave", onPointerUp); // Pointer gets out of the SVG area
		svg.addEventListener("pointermove", onPointerMove); // Pointer is moving
		svg.addEventListener("wheel", onScroll);
	};
};

export const reportSize = () => {
	widthOutput = window.innerWidth - 400;
	heightOutput = window.innerHeight;
	// console.log(widthOutput, heightOutput);
	// svg.setAttribute("width", widthOutput);
	// svg.setAttribute("height", heightOutput);
};

// This function returns an object with X & Y values from the pointer event
function getPointFromEvent(event) {
	let point = svg.createSVGPoint();
	// If event is triggered by a touch event, we get the position of the first finger
	if (event.targetTouches) {
		point.x = event.targetTouches[0].clientX;
		point.y = event.targetTouches[0].clientY;
	} else {
		point.x = event.clientX;
		point.y = event.clientY;
	}

	var invertedSVGMatrix = svg.getScreenCTM().inverse();

	return point.matrixTransform(invertedSVGMatrix);
}

// This variable will be used later for move events to check if pointer is down or not
let isPointerDown = false;

// This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
let pointerOrigin = {
	x: 0,
	y: 0
};

// Function called by the event listeners when user start pressing/touching
const onPointerDown = event => {
	isPointerDown = true; // We set the pointer as down

	// We get the pointer position on click/touchdown so we can get the value once the user starts to drag
	pointerOrigin = getPointFromEvent(event);
};

// Function called by the event listeners when user start moving/dragging
const onPointerMove = event => {
	// Only run this function if the pointer is down
	if (!isPointerDown) {
		return;
	}
	// This prevent user to do a selection on the page
	event.preventDefault();

	// Get the pointer position as an SVG Point
	var pointerPosition = getPointFromEvent(event);

	// Update the viewBox variable with the distance from origin and current position
	// We don't need to take care of a ratio because this is handled in the getPointFromEvent function
	viewBox.x -= pointerPosition.x - pointerOrigin.x;
	viewBox.y -= pointerPosition.y - pointerOrigin.y;
};

// Function called by the event listeners when user stops pressing/touching
const onPointerUp = () => {
	// The pointer is no longer considered as down
	isPointerDown = false;
};

// Function called by the event listeners when user starts scrolling
const onScroll = event => {
	pointerOrigin = getPointFromEvent(event);
	if (event.deltaY) {
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
	}
};
