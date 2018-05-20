// import request from 'request';
import requestPromise from 'request-promise';

const helpers = {
	// createRandomString: () => {},
	gettingAccessToken: url => {
		const reqOptions = {
			url,
			headers: {
				Authorization: 'Basic Y2xpZW50OnNlY3JldA==',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			formData: { grant_type: 'password', username: 'admin', password: 'admin' },
		};
		return requestPromise(reqOptions);
	},
	gettingBarTrip: (url, headers) => {
		const reqOptions = {
			url,
			headers,
			method: 'GET',
		};
		return requestPromise(reqOptions);
	},
	gettingBars: (url, headers) => {
		const reqOptions = {
			url,
			headers,
		};
		return requestPromise(reqOptions);
	},
};
export default helpers;
