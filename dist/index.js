"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const parseChangelog = require("changelog-parser");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('github-token');
            const octokit = github.getOctokit(token);
            const oldChangelog = yield octokit.repos.getContent({
                owner: 'Sparted',
                repo: 'mobile-app',
                path: 'CHANGELOG.md',
                ref: process.env.GITHUB_BASE_REF,
            });
            const currentChangelog = yield octokit.repos.getContent({
                owner: 'Sparted',
                repo: 'mobile-app',
                path: 'CHANGELOG.md',
                ref: process.env.GITHUB_HEAD_REF,
            });
            const test = currentChangelog.data;
            const { content: contentOldChangelog } = oldChangelog.data;
            const { content: contentCurrentChangelog } = currentChangelog.data;
            const oldChangelogText = Buffer.from(contentOldChangelog, 'base64').toString('utf-8');
            const currentChangelogText = Buffer.from(contentCurrentChangelog, 'base64').toString('utf-8');
            const parsedOldChangelog = yield parseChangelog({ text: oldChangelogText });
            const parsedCurrentChangelog = yield parseChangelog({ text: currentChangelogText });
            if (parsedOldChangelog.versions[0].parsed._.length >= parsedCurrentChangelog.versions[0].parsed._.length)
                throw new Error('No new line added in CHANGELOG');
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=index.js.map