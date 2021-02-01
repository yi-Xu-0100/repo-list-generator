# ⚡️ Repo List Generator GitHub Action

[![sync2gitee(list)](<https://github.com/yi-Xu-0100/hub-mirror/workflows/sync2gitee(list)/badge.svg>)](https://github.com/yi-Xu-0100/hub-mirror)
[![test](https://github.com/yi-Xu-0100/repo-list-generator/workflows/test/badge.svg)](https://github.com/yi-Xu-0100/repo-list-generator/actions?query=workflow%3Atest)
[![Github last commit](https://img.shields.io/github/last-commit/yi-Xu-0100/repo-list-generator)](https://github.com/yi-Xu-0100/repo-list-generator)
[![Github latest release](https://img.shields.io/github/v/release/yi-Xu-0100/repo-list-generator)](https://github.com/yi-Xu-0100/repo-list-generator/releases)
[![Github license](https://img.shields.io/github/license/yi-Xu-0100/repo-list-generator)](./LICENSE)

The GitHub action that generate repo list for user or organization.

**The personal access token (PAT) is used to fetch the repository list. Guide in [here](#-generate-my_token).**

## 🎨 Table of Contents

- [🎨 Table of Contents](#-table-of-contents)
- [🚀 Configuration](#-configuration)
- [📝 Default example](#-default-example)
- [📝 Example for get private repository](#-example-for-get-private-repository)
- [🚀 More Related Usage](#-more-related-usage)
- [📝 Use dependabot to keep action up-to-date](#-use-dependabot-to-keep-action-up-to-date)
- [🙈 Generate `my_token`](#-generate-my_token)
- [🔊 CHANGELOG](#-changelog)
- [📄 LICENSE](#-license)

## 🚀 Configuration

```yml
inputs:
  user:
    description: >
      Set up the name to generate repository list.
      It can be user or organization.
    required: false
    default: ${{ github.actor }}
  maxPage:
    description: >
      Deprecated!
      Set up maxPage for request to generate repository list.
      Default 100 repository per page and one page is 100 items.
    required: false
    default: 10
  max_page:
    description: >
      Set up maxPage for request to generate repository list.
      Default 100 repository per page and one page is 100 items.
    required: false
    default: 10
  my_token:
    description: >
      Set up the personal access token (PAT).
      The PAT is used to generate repository list for user or organization.
    required: false
    default: ${{ github.token }}
  block_list:
    description: >
      Set up the block_list for repoList.
      The repositories in block_list will exclude in repository list.
    required: false
    default: ''

outputs:
  repo:
    description: >
      Current repository name.
  repoList:
    description: >
      Repository list exclude private and fork.
      Source without private(Public) and no fork.
  repoList_ALL:
    description: >
      Repository list include private and fork.
      Source and fork
  repoList_PRIVATE:
    description: >
      Repository list include private.
      Source and no fork.
  repoList_FORK:
    description: >
      Repository list include fork.
      Source without private(Public) and fork.
  privateList:
    description: >
      Private repository list.
      Only private(fork can not be private).
  forkList:
    description: >
      Fork repository list.
      Only fork(private can not be fork).
```

## 📝 Default example

**Default example use `GITHUB_TOKEN` to fetch public repository list for user or organization.**

```yml
- name: Get Repo List
  id: repo
  uses: yi-Xu-0100/repo-list-generator@v0.4.1
  #with:
  #(default)my_token: ${{ secrets.GITHUB_TOKEN }}
  #(default)user: ${{ github.actor }}
  #(default)max_page: 10
  #(default)block_list:

- name: Echo Output
  run: |
    echo repo: ${{steps.repo.outputs.repo}}
    echo repoList: ${{steps.repo.outputs.repoList}}
    echo repoList_ALL: ${{steps.repo.outputs.repoList_ALL}}
    echo repoList_PRIVATE: ${{steps.repo.outputs.repoList_PRIVATE}}
    echo repoList_FORK: ${{steps.repo.outputs.repoList_FORK}}
    echo privateList: ${{steps.repo.outputs.privateList}}
    echo forkList: ${{steps.repo.outputs.forkList}}
```

## 📝 Example for get private repository

**This example use `REPO_TOKEN` to fetch private repository list for user or organization. The Guide to generate in [here](#-generate-my_token).**

```yml
- name: Get Repo List
  id: repo
  uses: yi-Xu-0100/repo-list-generator@v0.4.1
  with:
    my_token: ${{ secrets.REPO_TOKEN }}
    #(default)user: ${{ github.actor }}
    #(default)max_page: 10
    #(default)block_list:

- name: Echo Output
  run: |
    echo repo: ${{steps.repo.outputs.repo}}
    echo repoList: ${{steps.repo.outputs.repoList}}
    echo repoList_ALL: ${{steps.repo.outputs.repoList_ALL}}
    echo repoList_PRIVATE: ${{steps.repo.outputs.repoList_PRIVATE}}
    echo repoList_FORK: ${{steps.repo.outputs.repoList_FORK}}
    echo privateList: ${{steps.repo.outputs.privateList}}
    echo forkList: ${{steps.repo.outputs.forkList}}
```

## 🚀 More Related Usage

**This action result can be used in the follow actions `static_list` generating.**

- [yi-Xu-0100/hub-mirror](https://github.com/yi-Xu-0100/hub-mirror) use [Yikun/hub-mirror-action](https://github.com/Yikun/hub-mirror-action) to synchronize `GitHub` repositories to `Gitee`.
- [yi-Xu-0100/traffic-to-badge](https://github.com/yi-Xu-0100/traffic-to-badge) use repositories `Insights/traffic` data to generate badges that include views and clones.

## 📝 Use dependabot to keep action up-to-date

This file is build in [`./github/dependabot.yml`](./.github/dependabot.yml) to keep action up-to-date.

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'daily'
```

## 🙈 Generate `my_token`

> This part is obtained from [yi-Xu-0100/traffic-to-badge](https://github.com/yi-Xu-0100/traffic-to-badge#-generate-my_token).

You'll first need to create a personal access token (PAT) which make the action having the access to the GitHub API.

You can generate a PAT by going to `Settings(GitHub) -> Developer Settings -> Personal Access Tokens -> Generate new token`, and will need to grant repo permission. For more information, see the [GitHub documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

After you generated the PAT, go to `Settings(repository) -> Secrets -> New secret`, name the secret `REPO_TOKEN` and copy the PAT into the box.

## 🔊 CHANGELOG

- [CHANGELOG](./CHANGELOG.md)

## 📄 LICENSE

- [MIT](./LICENSE)
