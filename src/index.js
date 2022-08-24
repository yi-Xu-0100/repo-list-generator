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
const { mkdirP, rmRF } = require('@actions/io');
const artifact = require('@actions/artifact');
const { join } = require('path');
const { getAll, getList, printList } = require('./repo');
const { writeFileSync, existsSync } = require('fs');

async function run() {
  info('[INFO]: Usage https://github.com/yi-Xu-0100/repo-list-generator#readme');
  const repo_list_cache = '.repo_list';
  debug(`repo_list_cache: ${repo_list_cache}`);
  const repos_path = join(repo_list_cache, 'repo-list.json');
  debug(`repos_path: ${repos_path}`);
  const list_path = join(repo_list_cache, 'repo-name.json');
  debug(`list_path: ${list_path}`);
  try {
    startGroup('Get input value');
    const user = getInput('user').split(`/`).shift();
    info(`[INFO]: user: ${user}`);
    const max_page = getInput('max_page');
    info(`[INFO]: max_page: ${max_page}`);
    const block_list = getInput('block_list')
      .split(',')
      .map(item => item.split(`/`).pop());
    info(`[INFO]: block_list: ${block_list}`);
    const allow_empty = getInput('allow_empty').toUpperCase() === 'TRUE' ? true : false;
    info(`[INFO]: allow_empty: ${allow_empty}`);
    const allow_archived = getInput('allow_archived').toUpperCase() === 'TRUE' ? true : false;
    info(`[INFO]: allow_archived: ${allow_archived}`);
    info(`[INFO]: isDebug: ${isDebug()}`);
    if (!existsSync(repo_list_cache) && isDebug()) await mkdirP(repo_list_cache);
    else if (existsSync(repo_list_cache) && isDebug())
      throw Error(`The cache directory(${repo_list_cache}) is occupied!`);
    else if (existsSync(repo_list_cache) && !isDebug())
      warning(
        `The cache directory(${repo_list_cache}) is occupied!\n` +
          'If debug option set to be true, it will be Error!'
      );
    endGroup();

    startGroup('Get repo list');
    var repo_list = await getAll(user, max_page);
    if (isDebug()) writeFileSync(repos_path, JSON.stringify(repo_list, null, 2), 'utf-8');
    var repo_name = await getList(repo_list, block_list, allow_empty, allow_archived);
    endGroup();

    info('[INFO]: Print repo list');
    await printList(repo_name);

    if (isDebug()) writeFileSync(list_path, JSON.stringify(repo_name, null, 2), 'utf-8');
    if (isDebug() && !process.env['LOCAL_DEBUG']) {
      startGroup('Upload repo list debug artifact');
      const artifactClient = artifact.create();
      const artifactName = `repos-${user}-${process.env['GITHUB_ACTION']}`;
      const files = [
        '.repo_list/repo-info.json',
        '.repo_list/repo-list.json',
        '.repo_list/repo-name.json'
      ];
      const rootDirectory = '.repo_list/';
      const options = {
        retentionDays: 1
      };

      await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options);
      await rmRF(repo_list_cache);
      endGroup();
    }
    info('[INFO]: Action successfully completed');
  } catch (error) {
    debug(`ERROR[run]: ${error}`);
    setFailed(error.message);
  }
}

run();
