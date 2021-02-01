# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The emoji used in the `GitHub` commit message is based on [gitmoji](https://gitmoji.carloscuesta.me/).

## [Unreleased]

## [1.0.0] - 2021-02-01

### ✨ Added

- ✨ add `allow_empty` support, default exclude the empty repo in repo list.
- ✨ add `emptyList` output.

### ♻️ Changed

- 📝 add descriptions for repo list output in logs.
- 🔥 Delete `maxPage` input.

## [0.4.1] - 2020-11-09

### ♻️ Changed

- 📝 update version for readme.

## [0.4.0] - 2020-11-09

### ✨ Added

- ✨ add `block_list` support.

### ♻️ Changed

- 🗑 change maxPage to max_page.

## [0.3.0] - 2020-10-20

### ✨ Added

- ✨ support default `GITHUB_TOKEN`.

## [0.2.1] -2020-10-19

### ✨ Added

- support for organization.

### ♻️ Changed

- 📝 update descriptions about `my_token`.
- ✏️ update version for readme.

## [0.2.0] - 2020-10-18

### ✨ Added

- ✨ Fit debug option for save repo information.(default false)
- ✨ Use artifact option to upload repo information in debug mode.
- ✨ Add current repo name to output(repo).

### ♻️ Changed

- 🙈 remove test directory.

### 🐛 Fixed

- 🐛 Fix `privateList` and `forkList` info error.

## [0.1.0] - 2020-10-16

### 🐛 Fixed

- 🚑 fix get the organization repo list with the repo token.

## [0.0.3] - 2020-10-16

### ♻️ Changed

- 🔥 Delete `privateList_ALL` and `forkList_ALL` for output.
- 🔥 Delete repo sync2gitee workflow.
- 📝 Update repo data save to `${{ github.workspace }}/.repo_list`.

## [0.0.2] - 2020-10-14

### ✨ Added

- ✨ support repo list with private and fork setting.

## [0.0.1] - 2020-10-11

### ✨ Added

- 🎉 first publish.

[unreleased]: https://github.com/yi-Xu-0100/repo-list-generator/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v1.0.0
[0.4.1]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.4.1
[0.4.0]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.4.0
[0.3.0]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.3.0
[0.2.1]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.2.1
[0.2.0]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.2.0
[0.1.0]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.1.0
[0.0.3]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.0.3
[0.0.2]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.0.2
[0.0.1]: https://github.com/yi-Xu-0100/repo-list-generator/tree/v0.0.1
