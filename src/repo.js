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

let getAll = async function (user, page = 10) {
  var my_token = getInput('my_token');
  var octokit = new getOctokit(my_token);
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
  info('[INFO]: Successfully get repo data');
  return { repo_list: zip(repo_list_name, repo_list_private, repo_list_fork) };
};

let getList = async function (repo_list, block_list) {
  debug(`repo_list:`);
  debug(JSON.stringify(repo_list));
  var repos = repo_list.repo_list;
  repos = reject(repos, item => block_list.includes(item[0]));

  const repoList = unzip(reject(repos, item => item[1] || item[2]))[0] || '';
  setOutput('repoList', repoList.toString());

  const repoList_ALL = unzip(repos)[0] || '';
  setOutput('repoList_ALL', repoList_ALL.toString());

  const repoList_PRIVATE = unzip(reject(repos, item => item[2]))[0] || '';
  setOutput('repoList_PRIVATE', repoList_PRIVATE.toString());

  const repoList_FORK = unzip(reject(repos, item => item[1]))[0] || '';
  setOutput('repoList_FORK', repoList_FORK.toString());

  const privateList = unzip(reject(repos, item => !item[1]))[0] || '';
  setOutput('privateList', privateList.toString());

  const forkList = unzip(reject(repos, item => !item[2]))[0] || '';
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
    block_list: block_list
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
  startGroup(`block_list: ${repo_name.block_list.length}`);
  info('[INFO]: block_list: Repository list that will exclude in each list.');
  info(`[INFO]: block_list: ${repo_name.block_list.toString()}`);
  endGroup();
};

module.exports = { getAll, getList, printList };
