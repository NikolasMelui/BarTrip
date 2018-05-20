import googleMaps from '@google/maps';
import dataStorage from '../lib/dataStorage';
import helpers from '../lib/helpers';

const googleMapsClient = googleMaps.createClient({
	key: 'AIzaSyBlCPWOmrOEKqe89ATezi_msSCnuKIPrzA',
	Promise,
});

const handlers = {
	trip: (data, callback) => {
		const acceptMethod = 'post';
		if (data.method === acceptMethod) {
			handlers.sub_trip[data.method](data, callback);
		} else {
			callback(300);
		}
	},
	ping: (data, callback) => callback(200, { res: 'server is working!' }),
	undefined: (data, callback) => callback(400),
	sub_trip: {
		post: (data, callback) => {
			const curBudget =
				typeof data.payload.budget === 'number' && data.payload.budget % 1 === 0 && data.payload.budget >= 0
					? data.payload.budget
					: false;
			const curBarsNum =
				typeof data.payload.barsNum === 'number' && data.payload.barsNum % 1 === 0 && data.payload.barsNum >= 0
					? data.payload.barsNum
					: false;
			const curMaxDist =
				typeof data.payload.maxDist === 'number' && data.payload.maxDist % 1 === 0 && data.payload.maxDist >= 0
					? data.payload.maxDist
					: false;

			if (curBudget && curBarsNum && curMaxDist) {
				let curValue = false;
				const curHash = helpers.createRandomString(15);
				/**
				 *
				 * Google Maps API
				 *
				 */
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
					.then(response => {
						curValue = response.json;
						dataStorage.create('routes', `routes_${curHash}`, curValue, err => global.console.log(err));
						// dataStorage.read('routes', 'newFile', (err, _data) =>
						// 	global.console.log(`Error is: ${err} , data is: ${JSON.stringify(_data)}`)
						// );
					})
					.then(() => {
						helpers
							.gettingAccessToken('http://10.91.87.76:8080/app/rest/v2/oauth/token')
							.then(res => {
								helpers
									.gettingBars('http://10.91.87.76:8080/app/rest/v2/entities/bartrip$Bar', {
										Authorization: `Bearer ${JSON.parse(res).access_token}`,
									})
									.then(_res => {
										dataStorage.create('bars', `bars_${curHash}`, JSON.parse(_res), err =>
											global.console.log(err)
										);
										console.log(_res);
									})
									.then(() => {
										helpers
											.gettingBarTrip(
												'http://10.91.87.76:8080/app/rest/v2/queries/bartrip$BarTrip/uncompletedBarTrips?owner=admin',
												{
													Authorization: `Bearer ${JSON.parse(res).access_token}`,
												}
											)
											.then(___res => {
												dataStorage.create(
													'barTrip',
													`barTrip_${curHash}`,
													JSON.parse(___res),
													__err => global.console.log(__err)
												);
												console.log(___res);
											});
									});
							})
							.then(() => {
								console.log(curValue);
								callback(200, curValue);
							});
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				callback(400);
			}
		},
	},
};
export default handlers;
