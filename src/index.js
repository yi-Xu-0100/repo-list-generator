const { debug, info, startGroup, endGroup, getInput, setFailed } = require('@actions/core');
const { join } = require('path');
const { getAll, getList } = require('./repo');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const src = join(__dirname, '..');
const cache_path = join(src, '.repo_list');
if (!existsSync(cache_path)) mkdirSync(cache_path);

async function run() {
  try {
    startGroup('Get input value');
    debug(`[Info]: src: ${src}`);
    const username = getInput('user', { require: false });
    info(`[Info]: username: ${username}`);
    const maxPage = getInput('maxPage', { require: false });
    info(`[Info]: maxPage: ${maxPage}`);
    endGroup();

    startGroup('Get repo list');
    var repo_list = await getAll(maxPage);
    const repos_path = join(cache_path, 'repo-list.json');
    debug(`repos_path: ${repos_path}`);
    writeFileSync(repos_path, JSON.stringify(repo_list, null, 2), 'utf-8');
    var repo_name = await getList(repo_list);
    const list_path = join(cache_path, 'repo-name.json');
    debug(`list_path: ${list_path}`);
    writeFileSync(list_path, JSON.stringify(repo_name, null, 2), 'utf-8');
    endGroup();
  } catch (error) {
    setFailed(error);
  }
}

run();
