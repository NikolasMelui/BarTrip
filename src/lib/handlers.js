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
			let curMainNum = false;
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
				curMainNum = curBudget + curBarsNum + curMaxDist;
				callback(200, { budget: curBudget, barsNum: curBarsNum, maxDist: curMaxDist, mainNum: curMainNum });
			} else {
				callback(400);
			}
		},
	},
};
export default handlers;
