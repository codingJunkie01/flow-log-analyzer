const parseFile = require("./parser/parseFile");
const filterRows = require("./filter/filterRows");
const countConnections = require("./countConnections");
const { DEFAULT_CONNECTION_KEY_FIELDS } = require("../config/flowLogSchema");

const analyzeFlowLog = ({
    filePath, 
    schema, 
    numericFields, 
    criteria = {}, 
    connectionKeyFields = DEFAULT_CONNECTION_KEY_FIELDS
}) => {
    const rows = parseFile(filePath, schema, numericFields);
    const matched = criteria ? filterRows(rows, criteria) : rows;

    const result = {matched};
    if (connectionKeyFields) {
        result.connectionCounts = countConnections(rows, connectionKeyFields);
    }
    return result;
} 

module.exports = analyzeFlowLog;