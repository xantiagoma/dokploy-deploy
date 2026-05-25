/**
 * Release script — bumps version, syncs to all packages, commits, tags, pushes.
 *
 * Usage:
 *   bun run release              # auto-detect semver bump from commits
 *   bun run release -- --patch   # force patch bump
 *   bun run release -- --minor   # force minor bump
 */

import { execSync } from "node:child_process";

const args = process.argv.slice(2).join(" ");

function run(cmd: string) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

// 1. Bump version + update CHANGELOG (no commit, no tag, no push)
run(`bunx changelogen --bump --output ${args}`);

// 2. Sync version to all workspace packages + replace workspace:* with ^version
run(`bun scripts/sync-versions.ts`);

// 3. Stage everything, commit, tag, push
const rootPkg = JSON.parse(await Bun.file("package.json").text());
const version = rootPkg.version;

run(`git add -A`);
run(`git commit -m "chore(release): v${version}"`);
run(`git tag -a v${version} -m "v${version}"`);
run(`git push --follow-tags`);

console.log(`\nReleased v${version}`);
