import request from 'request';

const helpers = {
	// createRandomString: () => {},
	gettingAccessToken: async url => {
		const reqOptions = {
			url,
			headers: {
				Authorization: 'Basic Y2xpZW50OnNlY3JldA==',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			formData: { grant_type: 'password', username: 'admin', password: 'admin' },
		};
		const callbackHell = async (err, res, body) => {
			if (!err && res.statusCode === 200) {
				console.log(body);
				return body;
			}
		};
		request(reqOptions, callbackHell);
	},
	gettingBars: (url, headers) => {
		const reqOptions = {
			url,
			headers,
		};
		const callbackHell = (err, res, body) => {
			if (!err && res.statusCode === 200) {
				return JSON.parse(body);
			}
		};
		request(reqOptions, callbackHell);
	},
};
export default helpers;
