import { getOctokit } from '@actions/github';
import parseChangelog from 'changelog-parser';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

type Octokit = ReturnType<typeof getOctokit>;
type Changelog = UnPromisify<ReturnType<typeof parseChangelog>>;

export const getChangelog = async (
  octokit: Octokit,
  branchReference: string | undefined,
  repoName: string,
): Promise<Changelog> => {
  const [owner, repo] = repoName.split('/');

  const changelog = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: 'CHANGELOG.md',
    ref: branchReference,
  });

  const contentChangelog = 'content' in changelog.data
    ? changelog.data.content
    : '';

  const text = Buffer.from(contentChangelog, 'base64').toString('utf-8');

  return parseChangelog({ text });
};

export const isNewVersion = (
  oldChangelog: Changelog,
  newChangelog: Changelog,
): boolean => {
  const { version } = newChangelog.versions[0];

  return oldChangelog.versions[0].version !== version;
};

export const wasLineAdded = (
  oldChangelog: Changelog,
  newChangelog: Changelog,
): boolean => newChangelog.versions[0].parsed._.length >= oldChangelog.versions[0].parsed._.length;
