/**
 * Sync root package.json version to all workspace packages.
 * Called automatically by `bun run release` after changelogen bumps the root version.
 */
const rootPkg = await Bun.file("package.json").json();
const version = rootPkg.version as string;

const glob = new Bun.Glob("packages/*/package.json");
for await (const path of glob.scan({ cwd: "." })) {
  const file = Bun.file(path);
  const pkg = await file.json();
  pkg.version = version;
  await Bun.write(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`${pkg.name} → ${version}`);
}
