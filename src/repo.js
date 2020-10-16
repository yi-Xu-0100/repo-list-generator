const { getOctokit } = require('@actions/github');
const { debug, info, getInput, setOutput } = require('@actions/core');
const my_token = getInput('my_token', { require: true });
const octokit = new getOctokit(my_token);
const { pluck, zip, unzip, reject } = require('underscore');
const { join } = require('path');
const { writeFileSync } = require('fs');

let getAll = async function (user, page = 10) {
  var repo_list = [];
  for (let i = 1; i < parseInt(page); i++) {
    try {
      var resp = await octokit.repos.listForAuthenticatedUser({ page: i, per_page: 100 });
      debug(`Request Header ${i}:`);
      debug(JSON.stringify(resp.headers));
      repo_list = repo_list.concat(resp.data);
      if (!resp.headers.link || resp.headers.link.match(/rel=\\"first\\"/)) break;
    } catch (err) {
      debug(err);
      throw err;
    }
  }
  var repo_info = join('.repo_list', 'repo-info.json');
  debug(`repo-info: ${repo_info}`);
  writeFileSync(repo_info, JSON.stringify(repo_list, null, 2), 'utf-8');
  repo_list = reject(repo_list, item => item.owner.login != user);
  var repo_list_name = pluck(repo_list, 'name');
  var repo_list_private = pluck(repo_list, 'private');
  var repo_list_fork = pluck(repo_list, 'fork');
  info('[Info]: Successfully get repo data.');
  return { repo_list: zip(repo_list_name, repo_list_private, repo_list_fork) };
};

let getList = async function (repo_list) {
  debug(`repo_list:`);
  debug(JSON.stringify(repo_list));
  var repos = repo_list.repo_list;

  const repoList = unzip(reject(repos, item => item[1] || item[2]))[0];
  debug(`repoList[${repoList.length}]: ${repoList.toString()}`);
  setOutput('repoList', repoList.toString());

  const repoList_ALL = unzip(repos)[0];
  debug(`repoList_ALL[${repoList_ALL.length}]: ${repoList_ALL.toString()}`);
  setOutput('repoList_ALL', repoList_ALL.toString());

  const repoList_PRIVATE = unzip(reject(repos, item => item[2]))[0];
  debug(`repoList_PRIVATE[${repoList_PRIVATE.length}]: ${repoList_PRIVATE.toString()}`);
  setOutput('repoList_PRIVATE', repoList_PRIVATE.toString());

  const repoList_FORK = unzip(reject(repos, item => item[1]))[0];
  debug(`repoList_FORK[${repoList_FORK.length}]: ${repoList_FORK.toString()}`);
  setOutput('repoList_FORK', repoList_FORK.toString());

  const privateList = unzip(reject(repos, item => !item[1] || item[2]))[0];
  debug(`privateList[${privateList.length}]: ${privateList.toString()}`);
  setOutput('privateList', privateList.toString());

  const forkList = unzip(reject(repos, item => !item[2] || item[1]))[0];
  debug(`forkList[${forkList.length}]: ${forkList.toString()}`);
  setOutput('forkList', forkList.toString());

  info(`[Info]: repoList ${repoList.length}`);
  info(`[Info]: repoList_ALL ${repoList_ALL.length}`);
  info(`[Info]: repoList_PRIVATE ${repoList_PRIVATE.length}`);
  info(`[Info]: repoList_FORK ${repoList_FORK.length}`);
  info(`[Info]: privateList ${repoList_PRIVATE.length}`);
  info(`[Info]: forkList ${repoList_FORK.length}`);
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
