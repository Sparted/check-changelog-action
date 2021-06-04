# check-changelog-action

A github action which check if the changelog has been modified

## Inputs

### `token`

**Required** The github token

### `repo`

The repository name to check
By default, take the repository name where the action is executed

## How to update the action

- Make your change
- Edit `package.json` and `README.md`
- `yarn build`
- Push or merge changes on master
- Tag the version: `git tag -a -m "Name" v1.x.x`
- Push tags: `git push --follow-tags`
