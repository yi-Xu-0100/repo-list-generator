const { context, getOctokit } = require('@actions/github');
const {
  debug,
  info,
  getInput,
  setOutput,
  isDebug,
  startGroup,
  endGroup
} = require('@actions/core');
const { pluck, zip, unzip, reject } = require('underscore');
const { join } = require('path');
const { writeFileSync } = require('fs');
const _user = getInput('user');
const my_token = getInput('my_token');
const octokit = new getOctokit(my_token);
const asyncFilter = async (arr, predicate) =>
  Promise.all(arr.map(predicate)).then(results => arr.filter((_v, index) => results[index]));

let checkEmptyRepo = async function (name) {
  debug(`owner: ${_user}`);
  debug(`repo: ${name}`);
  var resp = await octokit.repos.listBranches({
    owner: _user,
    repo: name
  });
  debug(`branches of ${_user}/${name}: ${JSON.stringify(resp.data)}`);
  return JSON.stringify(resp.data) === '[]';
};

let getAll = async function (user, page = 10) {
  try {
    var listFunction = octokit.repos.listForAuthenticatedUser;
    await listFunction();
  } catch (error) {
    if (error.message === 'Resource not accessible by integration') {
      info('[INFO]: This token can not used for listForAuthenticatedUser()');
      listFunction = octokit.repos.listForUser;
    } else {
      debug(`ERROR[listFunction]: ${error}`);
      throw error;
    }
  }
  var repo_list = [];
  for (let i = 1; i < parseInt(page, 10); i++) {
    try {
      let resp = await listFunction({ username: user, page: i, per_page: 100 });
      debug(`Request Header [${i}]:`);
      debug(JSON.stringify(resp.headers));
      repo_list.push.apply(repo_list, resp.data);
      if (!resp.headers.link || resp.headers.link.match(/rel=\\"first\\"/)) break;
    } catch (error) {
      debug(`ERROR[getAll]: [${i}]: ${error}`);
      throw error;
    }
  }
  var repo_info = join('.repo_list', 'repo-info.json');
  debug(`repo-info: ${repo_info}`);
  if (isDebug()) writeFileSync(repo_info, JSON.stringify(repo_list, null, 2), 'utf-8');
  repo_list = reject(repo_list, item => item.owner.login != user);
  var repo_list_name = pluck(repo_list, 'name');
  var repo_list_private = pluck(repo_list, 'private');
  var repo_list_fork = pluck(repo_list, 'fork');
  var repo_list_size = pluck(repo_list, 'size');
  info('[INFO]: Successfully get repo data');
  return { repo_list: zip(repo_list_name, repo_list_private, repo_list_fork, repo_list_size) };
};

let getList = async function (repo_list, block_list, allowEmpty = false) {
  debug('repo_list:');
  debug(JSON.stringify(repo_list));
  var repos = repo_list.repo_list;
  repos = reject(repos, item => block_list.includes(item[0]));

  var _emptyList = unzip(reject(repos, item => item[3] > 0))[0] || [];
  debug(`_emptyList[${_emptyList.length}]: ${_emptyList.toString()}`);
  if (_emptyList) var emptyList = await asyncFilter(_emptyList, checkEmptyRepo);
  debug(`emptyList[${emptyList.length}]: ${emptyList.toString()}`);
  setOutput('emptyList', emptyList.toString());

  var repoList = unzip(reject(repos, item => item[1] || item[2]))[0] || [];
  if (!allowEmpty) repoList.filter(item => emptyList.includes(item));
  setOutput('repoList', repoList.toString());

  var repoList_ALL = unzip(repos)[0] || [];
  if (!allowEmpty) repoList_ALL.filter(item => emptyList.includes(item));
  setOutput('repoList_ALL', repoList_ALL.toString());

  var repoList_PRIVATE = unzip(reject(repos, item => item[2]))[0] || [];
  if (!allowEmpty) repoList_PRIVATE.filter(item => emptyList.includes(item));
  setOutput('repoList_PRIVATE', repoList_PRIVATE.toString());

  var repoList_FORK = unzip(reject(repos, item => item[1]))[0] || [];
  if (!allowEmpty) repoList_FORK.filter(item => emptyList.includes(item));
  setOutput('repoList_FORK', repoList_FORK.toString());

  var privateList = unzip(reject(repos, item => !item[1]))[0] || [];
  if (!allowEmpty) privateList.filter(item => emptyList.includes(item));
  setOutput('privateList', privateList.toString());

  var forkList = unzip(reject(repos, item => !item[2]))[0] || [];
  if (!allowEmpty) forkList.filter(item => emptyList.includes(item));
  setOutput('forkList', forkList.toString());

  setOutput('repo', context.repo.repo);
  return {
    repo: context.repo.repo,
    repoList: repoList,
    repoList_ALL: repoList_ALL,
    repoList_PRIVATE: repoList_PRIVATE,
    repoList_FORK: repoList_FORK,
    privateList: privateList,
    forkList: forkList,
    block_list: block_list,
    empty_list: emptyList
  };
};

let printList = async function (repo_name) {
  startGroup(`repo: ${repo_name.repo}`);
  info('[INFO]: repo: The current repository.');
  info(`[INFO]: repo: ${repo_name.repo}`);
  endGroup();
  startGroup(`repoList: ${repo_name.repoList.length}`);
  info('[INFO]: repoList: Repository list exclude private and fork.');
  info('[INFO]: repoList: Public(source without private) and no fork.');
  info(`[INFO]: repoList: ${repo_name.repoList.toString()}`);
  endGroup();
  startGroup(`repoList_ALL: ${repo_name.repoList_ALL.length}`);
  info('[INFO]: repoList_ALL: Repository list include private and fork.');
  info('[INFO]: repoList_ALL: Source(public and private) and fork.');
  info(`[INFO]: repoList_ALL: ${repo_name.repoList_ALL.toString()}`);
  endGroup();
  startGroup(`repoList_PRIVATE: ${repo_name.repoList_PRIVATE.length}`);
  info('[INFO]: repoList_PRIVATE: Repository list include private.');
  info('[INFO]: repoList_PRIVATE: Source(public and private) and no fork.');
  info(`[INFO]: repoList_PRIVATE: ${repo_name.repoList_PRIVATE.toString()}`);
  endGroup();
  startGroup(`repoList_FORK: ${repo_name.repoList_FORK.length}`);
  info('[INFO]: repoList_FORK: Repository list include fork.');
  info('[INFO]: repoList_FORK: Public(source without private) and fork.');
  info(`[INFO]: repoList_FORK: ${repo_name.repoList_FORK.toString()}`);
  endGroup();
  startGroup(`privateList: ${repo_name.privateList.length}`);
  info('[INFO]: privateList: Private repository list.');
  info('[INFO]: privateList: Only private(fork can not be private).');
  info(`[INFO]: privateList: ${repo_name.privateList.toString()}`);
  endGroup();
  startGroup(`forkList: ${repo_name.forkList.length}`);
  info('[INFO]: forkList: Fork repository list.');
  info('[INFO]: forkList: Only fork(private can not be fork).');
  info(`[INFO]: forkList: ${repo_name.forkList.toString()}`);
  endGroup();
  startGroup(`empty_list: ${repo_name.empty_list.length}`);
  info('[INFO]: empty_list: Empty repository list.');
  info('[INFO]: empty_list: Default exclude in each list.');
  info(`[INFO]: empty_list: ${repo_name.empty_list.toString()}`);
  endGroup();
  startGroup(`block_list: ${repo_name.block_list.length}`);
  info('[INFO]: block_list: Repository list that will exclude in each list.');
  info(`[INFO]: block_list: ${repo_name.block_list.toString()}`);
  endGroup();
};

module.exports = { getAll, getList, printList };
