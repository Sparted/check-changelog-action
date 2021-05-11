/* eslint-disable @sparted/import/no-unused-modules -- entry point file */

import * as core from '@actions/core';
import github from '@actions/github';
import parseChangelog from 'changelog-parser';

/* eslint-disable @typescript-eslint/no-explicit-any -- wrong types */
const getChangelog = async (token: string, branchReference: string, repo: string): Promise<any> => {
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const octokit = github.getOctokit(token);
  const changelog = await octokit.repos.getContent({
    owner: 'Sparted',
    repo,
    path: 'CHANGELOG.md',
    ref: branchReference,
  });

  const contentChangelog = 'content' in changelog.data
    ? changelog.data.content
    : '';

  const text = Buffer.from(contentChangelog, 'base64').toString('utf-8');

  /* eslint-disable @typescript-eslint/no-explicit-any -- wrong types */

  return parseChangelog({ text } as any);

  /* eslint-enable @typescript-eslint/no-explicit-any */
};

async function run() {
  const token = core.getInput('github-token');
  const repo = core.getInput('repo');
  const githubBaseReference = core.getInput('github-base-ref');
  const githubHeadReference = core.getInput('github-head-ref');

  try {
    const [oldChangelog, currentChangelog] = await Promise.all([
      getChangelog(token, githubBaseReference, repo),
      getChangelog(token, githubHeadReference, repo),
    ]);

    const version = currentChangelog.versions[0].version;

    if (oldChangelog.versions[0].version !== version) {
      core.info(`New version added: ${version}`);

      return;
    }

    if (currentChangelog.versions[0].parsed._.length <= oldChangelog.versions[0].parsed._.length)
      throw new Error(`No new line added in CHANGELOG for version ${version}`);

    core.info(`New line correctly added in CHANGELOG for version ${version}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

/* eslint-enable @sparted/import/no-unused-modules */
