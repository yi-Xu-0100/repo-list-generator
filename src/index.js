const { debug, info, startGroup, endGroup, getInput, setFailed } = require('@actions/core');
const { join } = require('path');
const { getAll, getList } = require('./repo');
const { writeFileSync, existsSync, mkdirSync } = require('fs');

async function run() {
  var repo_list_cache = '.repo_list';
  debug(`repo_list_cache: ${repo_list_cache}`);
  var repos_path = join(repo_list_cache, 'repo-list.json');
  debug(`repos_path: ${repos_path}`);
  var list_path = join(repo_list_cache, 'repo-name.json');
  debug(`list_path: ${list_path}`);
  if (!existsSync(repo_list_cache)) mkdirSync(repo_list_cache);
  try {
    startGroup('Get input value');
    const user = getInput('user', { require: false });
    info(`[Info]: user: ${user}`);
    const maxPage = getInput('maxPage', { require: false });
    info(`[Info]: maxPage: ${maxPage}`);
    endGroup();

    startGroup('Get repo list');
    var repo_list = await getAll(user, maxPage);
    writeFileSync(repos_path, JSON.stringify(repo_list, null, 2), 'utf-8');
    var repo_name = await getList(repo_list);
    writeFileSync(list_path, JSON.stringify(repo_name, null, 2), 'utf-8');
    endGroup();
  } catch (error) {
    setFailed(error);
  }
}

run();
