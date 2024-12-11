const moment = require('moment'); // Useful for date calculations

/**
 * Utility function to calculate the end date based on the plan's duration.
 * 
 * @param {string} durationType - 'month', 'year', or 'days'
 * @param {number} durationValue - The number of months, years, or days.
 * @param {Date} startDate - The start date of the plan.
 * @returns {Date} - The calculated end date.
 */
const calculateEndDate = (durationType, durationValue, startDate) => {
    let endDate;
    switch (durationType) {
        case 'month':
            endDate = moment(startDate).add(durationValue, 'months');
            break;
        case 'year':
            endDate = moment(startDate).add(durationValue, 'years');
            break;
        case 'days':
            endDate = moment(startDate).add(durationValue, 'days');
            break;
        default:
            throw new Error('Invalid duration type');
    }
    return endDate.toDate();
};

module.exports = { calculateEndDate };
