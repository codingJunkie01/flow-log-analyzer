const fs = require('fs');
const parseLine = require('./parseLine');

/**
 * Reads a flow log file and parses it into row objects
 * @param {string} filePath 
 * @param {string[]} schema 
 * @param {Set<string>} numericFields 
 * @returns {object[]} parsed rows
 */

const parseFile = (filePath, schema, numericFields) => {
    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        throw new Error(`Couldn't read log file at "${filePath}": ${err.message}`);
    }
    const lines = fileContent.split('\n');
    const rows = [];
    for (const line of lines) {
        const parsedLine = parseLine(line, schema, numericFields);
        if (parsedLine !== null) {
            rows.push(parsedLine);
        }
    }
    return rows;
}

module.exports = parseFile;