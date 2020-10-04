export const elements = {};

export interface geoData {
	"nodes": Record<string, NodeInterface>;
	"edges": Record<string, EdgeInterface>
}

interface NodeInterface {
	"name": string | null;
	"coordinates": number[];
	"connections": Connection[];
	"nodeSVGString": string;
}

interface Connection {
	node: number;
	edge: number;
}

interface EdgeInterface {
	"edgeName": string | null;
	"edgeWeight": number;
	"edgeStartNode": number;
	"edgeEndNode": number;
	"edgeType": string;
	"edgeSVGString": string;
}
