"use strict";
/* eslint-disable @sparted/import/no-unused-modules -- entry point file */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const changelog_parser_1 = __importDefault(require("changelog-parser"));
/* eslint-disable @typescript-eslint/no-explicit-any -- wrong types */
const getChangelog = (octokit, branchReference, repo) => __awaiter(void 0, void 0, void 0, function* () {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const changelog = yield octokit.repos.getContent({
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
    return changelog_parser_1.default({ text });
    /* eslint-enable @typescript-eslint/no-explicit-any */
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = core.getInput('github-token');
        const repo = core.getInput('repo');
        const githubBaseReference = process.env.GITHUB_BASE_REF;
        const githubHeadReference = process.env.GITHUB_HEAD_REF;
        const octokit = github.getOctokit(token);
        try {
            const [oldChangelog, currentChangelog] = yield Promise.all([
                getChangelog(octokit, githubBaseReference, repo),
                getChangelog(octokit, githubHeadReference, repo),
            ]);
            const version = currentChangelog.versions[0].version;
            if (oldChangelog.versions[0].version !== version) {
                core.info(`New version added: ${version}`);
                return;
            }
            if (currentChangelog.versions[0].parsed._.length <= oldChangelog.versions[0].parsed._.length)
                throw new Error(`No new line added in CHANGELOG for version ${version}`);
            core.info(`New line correctly added in CHANGELOG for version ${version}`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
/* eslint-enable @sparted/import/no-unused-modules */
//# sourceMappingURL=index.js.map