## ⚡️ Repo List Generator GitHub Action

[![sync2gitee(cached)](<https://github.com/yi-Xu-0100/repo-list-generator/workflows/sync2gitee(cached)/badge.svg>)](https://github.com/yi-Xu-0100/repo-list-generator/actions?query=workflow%3Async2gitee%28cached%29)
[![test](https://github.com/yi-Xu-0100/repo-list-generator/workflows/test/badge.svg)](https://github.com/yi-Xu-0100/repo-list-generator/actions?query=workflow%3Atest)
[![Github last commit](https://img.shields.io/github/last-commit/yi-Xu-0100/repo-list-generator)](https://github.com/yi-Xu-0100/repo-list-generator)
[![Github latest release](https://img.shields.io/github/v/release/yi-Xu-0100/repo-list-generator)](https://github.com/yi-Xu-0100/repo-list-generator/releases)
[![Github license](https://img.shields.io/github/license/yi-Xu-0100/repo-list-generator)](./LICENSE)

The GitHub action that generate repository list for user.

**The personal access token (PAT) used to fetch the repository. Guide in [here](#-generate-my_token).**

## 🎨 Table of Contents

- [⚡️ Repo List Generator GitHub Action](#️-repo-list-generator-github-action)
- [🎨 Table of Contents](#-table-of-contents)
- [🚀 Configuration](#-configuration)
- [📝 Example](#-example)
- [🙈 Generate `my_token`](#-generate-my_token)
- [🔊 CHANGELOG](#-changelog)
- [📄 LICENSE](#-license)

## 🚀 Configuration

```yml
inputs:
  user:
    description: 'Set up the user to generate repository list.'
    required: false
    default: ${{ github.actor }}
  maxPage:
    description: 'Set up maxPage for request to generate repository list.(default 100 repository per page.)'
    required: false
    default: 10
  my_token:
    description: 'Set up the personal access token (PAT) to generate repository list for user.'
    required: true

outputs:
  repoList:
    description: 'Repository list exclude private and fork'
  repoList_ALL:
    description: 'Repository list include private and fork'
  repoList_PRIVATE:
    description: 'Repository list include private'
  repoList_FORK:
    description: 'Repository list include fork'
  privateList:
    description: 'Private repository list exclude fork'
  privateList_ALL:
    description: 'Private repository list include fork'
  forkList:
    description: 'Fork repository list exclude private'
  forkList_ALL:
    description: 'Fork repository list include private'
```

## 📝 Example

This example use `REPO_TOKEN` to fetch repository list. The Guide in [here](#-generate-my_token).

```yml
- name: Get Repo List
  id: repo
  uses: ./
  with:
    my_token: ${{ secrets.REPO_TOKEN }}
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
