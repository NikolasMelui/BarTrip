const lib = {
	/**
	 * @TODO: get...
	 *
	 * Calculate trip function
	 *
	 * Main data:
	 * 	budget - rubles,
	 * 	barsNum - number,
	 * 	maxDist - metres
	 */
	calculateTrip: (budget, barsNum, maxDist) => {
		const curValue = budget + barsNum + maxDist;
		return curValue;
	},
};
export default lib;
