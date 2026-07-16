// generateSampleFlowLog.js
const fs = require('fs');

// --- Config: tweak these for different test scenarios ---
const TARGET_SIZE_MB = 20;
const OUTPUT_PATH = './tests/generated-flow-log.txt';
const NUM_UNIQUE_CONNECTIONS = 50; // how many distinct 5-tuples to reuse/repeat across the file

const PROTOCOLS = [6, 17, 1]; // TCP, UDP, ICMP
const ACTIONS = ['ACCEPT', 'REJECT'];

function randomIp() {
  // Random private-range-looking IPv4 (172.31.x.x, matching AWS's own examples)
  return `172.31.${randInt(0, 255)}.${randInt(0, 255)}`;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pre-generate a fixed pool of "connections" (5-tuples) so the file
// naturally contains repeats — needed to exercise countConnections.
function buildConnectionPool(size) {
  const pool = [];
  for (let i = 0; i < size; i++) {
    pool.push({
      srcAddr: randomIp(),
      dstAddr: randomIp(),
      srcPort: randInt(1024, 65535),
      dstPort: [22, 80, 443, 3306][randInt(0, 3)],
      protocol: PROTOCOLS[randInt(0, PROTOCOLS.length - 1)],
    });
  }
  return pool;
}

function buildLine(connection) {
  const accountId = '123456789010';
  const interfaceId = 'eni-1235b8ca123456789';
  const packets = randInt(1, 100);
  const bytes = randInt(40, 10000);
  const start = 1418530010 + randInt(0, 100000);
  const end = start + randInt(1, 60);
  const action = ACTIONS[randInt(0, 1)];

  return [
    2, accountId, interfaceId,
    connection.srcAddr, connection.dstAddr,
    connection.srcPort, connection.dstPort, connection.protocol,
    packets, bytes, start, end, action, 'OK',
  ].join(' ');
}

function generateFile() {
  const pool = buildConnectionPool(NUM_UNIQUE_CONNECTIONS);
  const targetBytes = TARGET_SIZE_MB * 1024 * 1024;
  const stream = fs.createWriteStream(OUTPUT_PATH);

  let bytesWritten = 0;
  while (bytesWritten < targetBytes) {
    const connection = pool[randInt(0, pool.length - 1)];
    const line = buildLine(connection) + '\n';
    stream.write(line);
    bytesWritten += Buffer.byteLength(line);
  }

  stream.end(() => {
    console.log(`Wrote ~${(bytesWritten / (1024 * 1024)).toFixed(2)} MB to ${OUTPUT_PATH}`);
  });
}

generateFile();