const { debug, info, startGroup, endGroup, getInput } = require('@actions/core');
const { join } = require('path');
const { getAll, getList } = require('./repo');
const { writeFileSync } = require('fs');
const src = join(__dirname, '..');

async function run() {
  startGroup('Get input value');
  debug(`src: ${src}`);
  const username = getInput('user', { require: false });
  info(`username: ${username}`);
  const maxPage = getInput('maxPage', { require: false });
  info(`maxPage: ${maxPage}`);
  endGroup();

  startGroup('Get repo list');
  var repo_list = await getAll(maxPage);
  const repos_path = join(src, 'repo-list.json');
  debug(`repos_path: ${repos_path}`);
  writeFileSync(repos_path, JSON.stringify(repo_list, null, 2), 'utf-8');
  var repo_name = await getList(repo_list);
  const list_path = join(src, 'repo-name.json');
  debug(`list_path: ${list_path}`);
  writeFileSync(list_path, JSON.stringify(repo_name, null, 2), 'utf-8');
  endGroup();
}

run();
