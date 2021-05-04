/* eslint-disable @sparted/import/no-unused-modules -- entry point file */

import * as core from '@actions/core';
import github from '@actions/github';
import parseChangelog from 'changelog-parser';


async function run() {
  try {
    const token = core.getInput('github-token');
    const repo = core.getInput('repo');
    const githubBaseReference = core.getInput('github-base-ref');
    const githubHeadReference = core.getInput('github-head-ref');

    const octokit = github.getOctokit(token);

    const oldChangelog = await octokit.repos.getContent({
      owner: 'Sparted',
      repo,
      path: 'CHANGELOG.md',
      ref: githubBaseReference,
    });
    const currentChangelog = await octokit.repos.getContent({
      owner: 'Sparted',
      repo,
      path: 'CHANGELOG.md',
      ref: githubHeadReference,
    });

    const contentOldChangelog = 'content' in oldChangelog.data
      ? oldChangelog.data.content
      : '';
    const contentCurrentChangelog = 'content' in currentChangelog.data
      ? currentChangelog.data.content
      : '';

    const oldChangelogText = Buffer.from(contentOldChangelog, 'base64').toString('utf-8');
    const currentChangelogText = Buffer.from(contentCurrentChangelog, 'base64').toString('utf-8');

    /* eslint-disable @typescript-eslint/no-explicit-any -- wrong types */

    const parsedOldChangelog: any = await parseChangelog({ text: oldChangelogText } as any);
    const parsedCurrentChangelog: any = await parseChangelog({ text: currentChangelogText } as any);

    /* eslint-enable @typescript-eslint/no-explicit-any */

    if (parsedOldChangelog.versions[0].parsed._.length >= parsedCurrentChangelog.versions[0].parsed._.length)
      throw new Error('No new line added in CHANGELOG');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

/* eslint-enable @sparted/import/no-unused-modules */
