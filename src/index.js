const {
  debug,
  info,
  startGroup,
  endGroup,
  getInput,
  setFailed,
  warning,
  isDebug
} = require('@actions/core');
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
  try {
    startGroup('Get input value');
    const user = getInput('user', { require: false });
    info(`[Info]: user: ${user}`);
    const maxPage = getInput('maxPage', { require: false });
    info(`[Info]: maxPage: ${maxPage}`);
    info(`[Info]: isDebug: ${isDebug()}`);
    if (!existsSync(repo_list_cache)) {
      if (isDebug()) mkdirSync(repo_list_cache);
    } else {
      if (isDebug()) throw Error(`The cache directory(${repo_list_cache}) is occupied!`);
      else
        warning(
          `The cache directory(${repo_list_cache}) is occupied! ` +
            '\n' +
            'If debug option set to be true, it will be Error!'
        );
    }
    endGroup();

    startGroup('Get repo list');
    var repo_list = await getAll(user, maxPage);
    if (isDebug()) writeFileSync(repos_path, JSON.stringify(repo_list, null, 2), 'utf-8');
    var repo_name = await getList(repo_list);
    if (isDebug()) writeFileSync(list_path, JSON.stringify(repo_name, null, 2), 'utf-8');
    endGroup();
  } catch (error) {
    debug(`Error[run]: ${error}`);
    setFailed(error.message);
  }
}

run();
