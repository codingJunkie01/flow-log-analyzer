# Flow Log Parser

A small Node.js tool that parses AWS VPC flow log files and lets you filter
rows and count connections. 

Reference: [AWS VPC Flow Log Records](https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html)

## What it does

- Parses a flow log file (default/version 2 format) into structured rows.
- Filters rows by any field (e.g. source IP, destination IP, source/destination port).
- Counts connections, where a connection is the 5-tuple:
  `(source IP, source port, destination IP, destination port, protocol)`.

Filtering and connection counting are independent — both run over the full
parsed file. Filtering doesn't affect the counts, and counting isn't
limited to filtered rows.

## Assumptions

- Input is the **default (version 2) flow log format** — 14 space-separated
  fields, in the fixed order AWS documents. Custom flow log formats aren't
  handled.
- **IPv4 only**, per the requirements — addresses aren't validated as IPv4;
  we assume the input conforms. IPv6 rows would be parsed like any other
  string field, not rejected.
- A `-` in any field (AWS's placeholder for "not applicable," e.g. on
  `SKIPDATA` rows) is kept as the literal string `-`, not converted to
  `null` or `0`.
- Blank lines and lines with the wrong number of fields are skipped
  silently rather than causing the whole file to fail.
- Filters use **exact equality** on a field (e.g. `srcAddr` must match
  exactly). If multiple filter criteria are given, a row must match all
  of them (AND).

## Project structure

```
index.js                          # entry point (re-exports analyzeFlowLog)
src/
  config/
    flowLogSchema.js              # field order + which fields are numeric
  core/
    parser/
      parseLine.js                # convert each line in log file -> row object
      parseFile.js                # reads a file, parses every line
    filter/
      filterRows.js                # filters rows by any field(s)
    countConnections.js            # groups rows by a set of fields, counts them
    analyzeFlowLog.js              # ties parsing + filtering + counting together
tests/
  manualTest.js                    # ad hoc script to run analyzeFlowLog against generated data
  generated-flow-log.txt           # larger generated file, for scale testing
  testGenerator/
    generateSampleFlowLog.js       # script to generate a large test file
```

## Usage

```js
const analyzeFlowLog = require('.');
const FLOW_LOG_SCHEMA = require('./src/config/flowLogSchema');
const { NUMERIC_FIELDS } = FLOW_LOG_SCHEMA;

const result = analyzeFlowLog({
  filePath: './tests/generated-flow-log.txt',
  schema: FLOW_LOG_SCHEMA,
  numericFields: NUMERIC_FIELDS,
  criteria: { srcAddr: '172.31.16.139' }, // optional — omit for no filtering
});

result.matched;           // rows matching the criteria
result.connectionCounts;  // Map of 5-tuple -> { values, count }, always over all rows
```

See `tests/manualTest.js` for a working example against generated data.

`criteria` can be any combination of row fields — it's not limited to IP
addresses. For example, `{ srcAddr: '...', dstPort: 22 }` filters by both.

By default, connection counting uses the standard 5-tuple
(`srcAddr`, `srcPort`, `dstAddr`, `dstPort`, `protocol`). This can be
overridden by passing `connectionKeyFields` with a different list of field
names, so the tool isn't locked into one specific grouping.

## Generating a large test file

```
node tests/testGenerator/generateSampleFlowLog.js
```

Writes a ~20MB flow log file with realistic, randomized rows (repeated
5-tuples included, so connection counting has real duplicates to count).
Used to sanity-check parsing performance at the file size mentioned in
the requirements. Note that IPs are randomized on every run, so any
hardcoded `criteria` values (e.g. in `manualTest.js`) may need updating
to match a `srcAddr` that actually exists in the newly generated file.

## Running the manual test

```
node tests/manualTest.js
```

Runs `analyzeFlowLog` against the generated flow log file and prints
matched rows and connection counts.
