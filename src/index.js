import http from 'http';
import url from 'url';
import googleMaps from '@google/maps';
import { StringDecoder } from 'string_decoder';
import dataStorage from './lib/dataStorage';
import handlers from './lib/handlers';
import config from './lib/config';

const googleMapsClient = googleMaps.createClient({
	key: 'AIzaSyBlCPWOmrOEKqe89ATezi_msSCnuKIPrzA',
	Promise,
});

const routes = {
	ping: handlers.ping,
	trip: handlers.trip,
};

const unifiedServer = (req, res) => {
	const reqParsedUrl = url.parse(req.url, true);
	global.console.log(reqParsedUrl);
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
			googleMapsClient
				.directions({
					origin: {
						lat: 55.7507309,
						lng: 48.7392266,
					},
					destination: {
						lat: 55.7517591,
						lng: 48.7397137,
					},
					mode: 'walking',
				})
				.asPromise()
				.then(async response => {
					const curValue = response.json.routes[0].legs;
					await global.console.log(curValue);
					// dataStorage.create('routes', 'newFile', curValue, err => global.console.log(err));
					dataStorage.read('routes', 'newFile', (err, _data) =>
						/**
						 * @TODO: delete stringify function.
						 */
						global.console.log(`Error is: ${err} , data is: ${JSON.stringify(_data)}`)
					);
				})
				.catch(err => {
					global.console.log(err);
				});
		});
	});
};
const server = http.createServer((req, res) => {
	unifiedServer(req, res);
});
server.listen(config.server.port, config.server.hostname, () => {
	global.console.log(`Server is listening on port: ${config.server.port}`);
});
