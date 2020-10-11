const core = require('@actions/core');
const path = require('path');

const src = path.join(__dirname, '..');

async function run() {
  core.startGroup('Get Input value');
  const license_path = path.join(src, core.getInput('path', { require: false }));
  core.info(`license_path: ${license_path}`);
  core.endGroup();
}

run();
