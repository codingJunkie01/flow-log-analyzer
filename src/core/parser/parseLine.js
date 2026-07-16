/**
 * Parses one flow log line into a named row object, using the given schema.
 * @param {string} line - a single line from the log file
 * @param {string[]} schema - ordered field names (e.g. FLOW_LOG_SCHEMA)
 * @param {Set<string>} numericFields - list of numeric field names
 * @returns {object|null} parsed row, or null if the line is malformed/skippable
 */
const parseLine = (line, schema, numericFields) => {
  const trimmedLine = line.trim();
  if (trimmedLine === '') return null; // skip blank lines

  const fields = trimmedLine.split(/\s+/);

  // if line doesn't match the expected field count, skip it
  if (fields.length !== schema.length) {
    return null;
  }

  const row = {};
  schema.forEach((fieldName, i) => {
    const fieldValue = fields[i];
    if (numericFields.has(fieldName) && fieldValue !== '-') {
        const numValue = Number(fieldValue);
        row[fieldName] = Number.isNaN(numValue) ? fieldValue : numValue; 
    } else {
      row[fieldName] = fieldValue;
    }
  });

  return row;
}

module.exports = parseLine;