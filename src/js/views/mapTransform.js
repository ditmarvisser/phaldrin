export const mapTransform = () => {
	window.onload = function() {
		const svg = document
			.getElementById("mapSVG")
			.contentDocument.getElementById("map-svg");
		console.log(svg);

		svg.addEventListener("pointerdown", onPointerDown); // Pointer is pressed
		svg.addEventListener("pointerup", onPointerUp); // Releasing the pointer
		svg.addEventListener("pointerleave", onPointerUp); // Pointer gets out of the SVG area
		svg.addEventListener("pointermove", onPointerMove); // Pointer is moving
	};
};
export const onPointerDown = () => {
	console.log("down");
};
export const onPointerUp = () => {
	console.log("up");
};
export const onPointerMove = () => {
	console.log("moving");
};
