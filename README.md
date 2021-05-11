# check-changelog-action

A github action which check if the changelog has been modified

## Inputs

### `token`

**Required** The github token

### `repo`

**Required** The repository name to check

#### `github-base-ref`

**Required** The base branch (the branch you want to merge on)

#### `github-head-ref`

**Required** The head branch (your current branch)

## How to update the action

- Make your change
- Edit `package.json` and `README.md`
- `yarn build`
- Push or merge changes on master
- Tag the version: `git tag -a -m "Name" v1.x.x`
- Push tags: `git push --follow-tags`
