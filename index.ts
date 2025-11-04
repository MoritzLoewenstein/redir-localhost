import {
	createServer,
	type IncomingMessage,
	type ServerResponse,
} from "node:http";
import { URL } from "node:url";

const PORT = process.env.PORT ?? 3000;
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
	if (req.method !== "GET") {
		res.writeHead(405);
		res.end("method not allowed");
		return;
	}

	if (!req.url || req.url === "/") {
		res.writeHead(422);
		res.end("no url provided");
		return;
	}

	const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);
	let targetUrl: URL;
	try {
		targetUrl = new URL(url.pathname.slice(1));
		if (url.search) {
			targetUrl.search = url.search;
		}
	} catch {
		res.writeHead(422);
		res.end("invalid url");
		return;
	}

	const isValidRedirect =
		(targetUrl.protocol === "http:" || targetUrl.protocol === "https:") &&
		targetUrl.hostname === "localhost";
	if (!isValidRedirect) {
		res.writeHead(403);
		res.end("only localhost http or https redirect allowed");
		return;
	}

	res.writeHead(302, { Location: targetUrl.toString() });
	res.end();
});

server.listen(PORT, () => {
	console.log(`Server listening on: http://localhost:${PORT}`);
});
