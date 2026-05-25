/**
 * Sync root package.json version to all workspace packages.
 * Also replaces `workspace:*` references with the actual version
 * so npm publish works correctly.
 *
 * Called automatically by `bun run release` after changelogen bumps the root version.
 */
const rootPkg = await Bun.file("package.json").json();
const version = rootPkg.version as string;

const glob = new Bun.Glob("packages/*/package.json");
for await (const path of glob.scan({ cwd: "." })) {
  const file = Bun.file(path);
  const pkg = await file.json();
  pkg.version = version;

  // Replace workspace:* with actual version for internal deps
  for (const depType of ["dependencies", "devDependencies", "peerDependencies"] as const) {
    const deps = pkg[depType];
    if (!deps) continue;
    for (const [name, ver] of Object.entries(deps)) {
      if (ver === "workspace:*" && (name as string).startsWith("@xantiagoma/")) {
        deps[name] = `^${version}`;
      }
    }
  }

  await Bun.write(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`${pkg.name} → ${version}`);
}
