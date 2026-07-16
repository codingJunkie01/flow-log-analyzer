const analyzeFlowLog = require("..");
const FLOW_LOG_SCHEMA = require("../src/config/flowLogSchema.js");
const { NUMERIC_FIELDS } = FLOW_LOG_SCHEMA;

const filePath = './tests/testGenerator/generated-flow-log.txt';

const run = (label, criteria) => {
    const result = analyzeFlowLog({
        filePath,
        schema: FLOW_LOG_SCHEMA,
        numericFields: NUMERIC_FIELDS,
        criteria,
    });
    console.log(`=== ${label} ===`);
    console.log(`Matched rows: ${result.matched.length}`);
    console.log(JSON.stringify(result.matched.slice(0, 3), null, 2));
    console.log('');
    return result;
};

// Baseline (no filter) - also used to pick real sample values for the
// scenarios below, since the generated file's IPs/ports are randomized
// on every run.
const baseline = run('No filter (all rows)');
const sampleRow = baseline.matched[0];

// Filter by source IP address
run(`Filter by source IP (srcAddr = ${sampleRow.srcAddr})`, {
    srcAddr: sampleRow.srcAddr,
});

// Filter by destination IP address
run(`Filter by destination IP (dstAddr = ${sampleRow.dstAddr})`, {
    dstAddr: sampleRow.dstAddr,
});

// Extension: filter by source and destination port
run(`Filter by ports (srcPort = ${sampleRow.srcPort}, dstPort = ${sampleRow.dstPort})`, {
    srcPort: sampleRow.srcPort,
    dstPort: sampleRow.dstPort,
});

// Combined filter: source IP + destination port
run(`Combined filter (srcAddr = ${sampleRow.srcAddr}, dstPort = ${sampleRow.dstPort})`, {
    srcAddr: sampleRow.srcAddr,
    dstPort: sampleRow.dstPort,
});

// Extension: connection counts, keyed by the 5-tuple
// (srcAddr, srcPort, dstAddr, dstPort, protocol). Always computed over
// all rows, independent of any filter criteria above.
console.log('=== Connection counts (5-tuple) over all rows ===');
for (const [, value] of baseline.connectionCounts) {
    console.log(`${JSON.stringify(value.values)} seen ${value.count} time(s)`);
}
