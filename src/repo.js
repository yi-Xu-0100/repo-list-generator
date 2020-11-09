const { context, getOctokit } = require('@actions/github');
const { debug, info, getInput, setOutput, isDebug } = require('@actions/core');
const { pluck, zip, unzip, reject } = require('underscore');
const { join } = require('path');
const { writeFileSync } = require('fs');

let getAll = async function (user, page = 10) {
  var my_token = getInput('my_token', { require: false });
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
  for (let i = 1; i < parseInt(page); i++) {
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
  debug(`repoList[${repoList.length}]: ${repoList.toString()}`);
  setOutput('repoList', repoList.toString());

  const repoList_ALL = unzip(repos)[0] || '';
  debug(`repoList_ALL[${repoList_ALL.length}]: ${repoList_ALL.toString()}`);
  setOutput('repoList_ALL', repoList_ALL.toString());

  const repoList_PRIVATE = unzip(reject(repos, item => item[2]))[0] || '';
  debug(`repoList_PRIVATE[${repoList_PRIVATE.length}]: ${repoList_PRIVATE.toString()}`);
  setOutput('repoList_PRIVATE', repoList_PRIVATE.toString());

  const repoList_FORK = unzip(reject(repos, item => item[1]))[0] || '';
  debug(`repoList_FORK[${repoList_FORK.length}]: ${repoList_FORK.toString()}`);
  setOutput('repoList_FORK', repoList_FORK.toString());

  const privateList = unzip(reject(repos, item => !item[1]))[0] || '';
  debug(`privateList[${privateList.length}]: ${privateList.toString()}`);
  setOutput('privateList', privateList.toString());

  const forkList = unzip(reject(repos, item => !item[2]))[0] || '';
  debug(`forkList[${forkList.length}]: ${forkList.toString()}`);
  setOutput('forkList', forkList.toString());

  setOutput('repo', context.repo.repo);
  info(`[INFO]: repo: ${context.repo.repo}`);
  info(`[INFO]: repoList: ${repoList.length}`);
  info(`[INFO]: repoList_ALL: ${repoList_ALL.length}`);
  info(`[INFO]: repoList_PRIVATE: ${repoList_PRIVATE.length}`);
  info(`[INFO]: repoList_FORK: ${repoList_FORK.length}`);
  info(`[INFO]: privateList: ${privateList.length}`);
  info(`[INFO]: forkList: ${forkList.length}`);
  info(`[INFO]: block_list: ${block_list}`);
  return {
    repoList: repoList,
    repoList_ALL: repoList_ALL,
    repoList_PRIVATE: repoList_PRIVATE,
    repoList_FORK: repoList_FORK,
    privateList: privateList,
    forkList: forkList
  };
};

module.exports = { getAll, getList };
