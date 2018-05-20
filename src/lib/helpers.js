// import request from 'request';
import requestPromise from 'request-promise';

const helpers = {
	createRandomString: strLength => {
		const curStrLength = typeof strLength === 'number' && strLength > 0 ? strLength : false;
		if (curStrLength) {
			const allChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
			let randomString = '';
			for (let i = 0; i < curStrLength; i += 1) {
				const curChar = allChars.charAt(Math.floor(Math.random() * allChars.length));
				randomString += curChar;
			}
			return randomString;
		}
		return false;
	},
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
