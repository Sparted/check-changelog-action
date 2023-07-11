import { getInput, info, setFailed } from '@actions/core';

import { getOctokit } from '@actions/github';
import { wasLineAdded, isNewVersion, getChangelog } from './utils/changelog';

const run = async (): Promise<void> => {
  const token = getInput('github-token');
  const repo = getInput('repo');
  const githubBaseReference = process.env.GITHUB_BASE_REF;
  const githubHeadReference = process.env.GITHUB_HEAD_REF;

  const octokit = getOctokit(token);

  const [oldChangelog, newChangelog] = await Promise.all([
    getChangelog(octokit, githubBaseReference, repo),
    getChangelog(octokit, githubHeadReference, repo),
  ]);

  const { version } = newChangelog.versions[0];

  if (isNewVersion(oldChangelog, newChangelog)) {
    return info(`New version added: ${version}`);
  }

  if (wasLineAdded(oldChangelog, newChangelog)) {
    return info(`New line correctly added in CHANGELOG for version ${version}`);
  }

  throw new Error(`No new line added in CHANGELOG for version ${version}`);
};

try {
  run();
} catch (error) {
  const { message } = error as Error;
  setFailed(message);
}
