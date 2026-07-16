const FLOW_LOG_SCHEMA = [
    'version',
    'accountId',
    'interfaceId',
    'srcAddr',
    'dstAddr',
    'srcPort',
    'dstPort',
    'protocol',
    'packets',
    'bytes',
    'start',
    'end',
    'action',
    'logStatus'
];

const NUMERIC_FIELDS = new Set(['srcPort', 'dstPort', 'protocol', 'packets', 'bytes', 'start', 'end']);

const DEFAULT_CONNECTION_KEY_FIELDS = ['srcAddr', 'srcPort', 'dstAddr', 'dstPort', 'protocol'];

module.exports = FLOW_LOG_SCHEMA;
module.exports.NUMERIC_FIELDS = NUMERIC_FIELDS;
module.exports.DEFAULT_CONNECTION_KEY_FIELDS = DEFAULT_CONNECTION_KEY_FIELDS;