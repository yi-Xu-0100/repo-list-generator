const core = require('@actions/core');
const path = require('path');

const src = path.join(__dirname, '..');

async function run() {
  core.startGroup('Get Input value');
  const username = core.getInput('user', { require: false });
  core.info(`src: ${src}`);
  core.info(`username: ${username}`);
  core.endGroup();
}

run();
