/**
 * Counts occurrences of each unique combination of the fields provided
 * @param {*} rows 
 * @param {*} keyFields - fields that together define a connection
 * @returns {Map<string, {values: object, count: number}>}
 *    key: joined field values; value: original field values object + count of each
 */
const countConnections = (rows, keyFields) => {
    const countMap = new Map();

    for (const row of rows) {
        const values = keyFields.map((field) => row[field]);
        const countMapKey = values.join('|');

        if (countMap.has(countMapKey)) {
            countMap.get(countMapKey).count += 1;
        } else {
            const valuesByField = {};
            keyFields.forEach((field, i) => {
                valuesByField[field] = values[i];
            });
            countMap.set(countMapKey, {values: valuesByField, count: 1});
        }
    }
    return countMap;
}

module.exports = countConnections;