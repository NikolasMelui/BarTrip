import http from 'http';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import handlers from './lib/handlers';
import helpers from './lib/helpers';
import config from './lib/config';

const routes = {
	ping: handlers.ping,
	trip: handlers.trip,
};

const unifiedServer = (req, res) => {
	const reqParsedUrl = url.parse(req.url, true);
	const reqPath = reqParsedUrl.pathname;
	const reqQueryStringObject = reqParsedUrl.query;
	const reqTrimmedPath = reqPath.replace(/^\/+|\/+$/g, '');
	const reqMethod = req.method.toLowerCase();
	const reqHeaders = req.headers;

	const decoder = new StringDecoder('utf-8');

	let reqPayload = '';

	req.on('data', data => {
		reqPayload += decoder.write(data);
	});
	req.on('end', () => {
		reqPayload += decoder.end();
		const chosenHandler =
			typeof routes[reqTrimmedPath] !== 'undefined' ? routes[reqTrimmedPath] : handlers.notFound;

		const data = {
			trimmedPath: reqTrimmedPath,
			queryStringObject: reqQueryStringObject,
			method: reqMethod,
			headers: reqHeaders,
			payload: JSON.parse(reqPayload),
		};

		chosenHandler(data, (_statusCode, _payload) => {
			const statusCode = typeof _statusCode === 'number' ? _statusCode : 200;
			const payload = typeof _payload === 'object' ? _payload : {};
			const payloadString = JSON.stringify(payload);
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			global.console.log('Returning the response: ', statusCode, payloadString);
		});
	});
};
const server = http.createServer((req, res) => {
	unifiedServer(req, res);
});
server.listen(config.server.port, config.server.hostname, async () => {
	global.console.log(`Server is listening on port: ${config.server.port}`);
	console.log(await helpers.gettingAccessToken('http://10.91.87.76:8080/app/rest/v2/oauth/token'));
	// helpers.gettingBars('http://10.91.87.76:8080/app/rest/v2/entities/bartrip$Bar', {
	// 	Authorization: accessToken,
	// });
});
