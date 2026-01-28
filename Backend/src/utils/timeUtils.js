/**
 * Get the current time, respecting the x-test-now-ms header if TEST_MODE is enabled.
 * @param {Object} req - The Express request object.
 * @returns {Date} The current date object.
 */
const getCurrentTime = (req) => {
    if (process.env.TEST_MODE === '1' && req?.headers?.['x-test-now-ms']) {
        const testTime = parseInt(req.headers['x-test-now-ms'], 10);
        if (!isNaN(testTime)) {
            return new Date(testTime);
        }
    }
    return new Date();
};

module.exports = { getCurrentTime };
