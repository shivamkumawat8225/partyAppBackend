const fs = require('fs');
const path = require('path');

const packageFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'buffer-equal-constant-time',
  'index.js'
);

if (!fs.existsSync(packageFile)) {
  process.exit(0);
}

let source = fs.readFileSync(packageFile, 'utf8');
source = source.replace("var SlowBuffer = require('buffer').SlowBuffer;\n", '');
source = source.replace(
  'Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {',
  'Buffer.prototype.equal = function equal(that) {'
);
source = source.replace('var origSlowBufEqual = SlowBuffer.prototype.equal;\n', '');
source = source.replace('  SlowBuffer.prototype.equal = origSlowBufEqual;\n', '');
fs.writeFileSync(packageFile, source);
