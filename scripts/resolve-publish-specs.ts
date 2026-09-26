/**
 * Pre-publish: rewrite workspace-only dependency protocols in every
 * packages/*\/package.json so `npm publish` ships real semver ranges.
 *
 * - `workspace:*`  → `^<root version>` (sibling packages are released together)
 * - `catalog:`     → the root `workspaces.catalog` entry for that dependency
 *
 * npm doesn't understand either protocol; before this, `catalog:` leaked into
 * the published manifests (every release ≤0.0.13), which Bun ≥1.4 rejects when
 * installing the package ("@pulumi/pulumi@catalog: failed to resolve").
 * Fails loudly if a `catalog:` dependency has no catalog entry.
 */
import { Glob } from "bun";

const root = await Bun.file("package.json").json();
const version: string = root.version;
const catalog: Record<string, string> = root.workspaces?.catalog ?? {};
const FIELDS = ["dependencies", "peerDependencies", "optionalDependencies", "devDependencies"] as const;

for await (const path of new Glob("packages/*/package.json").scan(".")) {
  const pkg = await Bun.file(path).json();
  for (const field of FIELDS) {
    const deps: Record<string, string> | undefined = pkg[field];
    if (!deps) continue;
    for (const [name, spec] of Object.entries(deps)) {
      if (spec.startsWith("workspace:")) deps[name] = `^${version}`;
      else if (spec === "catalog:" || spec === "catalog:default") {
        const resolved = catalog[name];
        if (!resolved) throw new Error(`${path}: ${field}.${name} is catalog: but the root catalog has no entry`);
        deps[name] = resolved;
      }
    }
  }
  await Bun.write(path, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`resolved ${path}`);
}
