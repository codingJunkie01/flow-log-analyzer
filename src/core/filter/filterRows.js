/**
 * Filters rows matching the criteria passed
 * @param {object[]} rows 
 * @param {object} criteria ex: {srcAddr: '172.31.16.139', dstPort: 22}
 * @returns {object[]}
 */
const filterRows = (rows, criteria = {}) => {
    return rows.filter((row) => {
        return Object.entries(criteria).every(([fieldName, fieldValue]) => {
            if (fieldValue === undefined) return true; // value is null or undefined, no filtering needed
            return row[fieldName] === fieldValue;
        });
    });
}

module.exports = filterRows;