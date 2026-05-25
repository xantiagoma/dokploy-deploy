/**
 * Reports ResponseMap coverage — which operations have typed responses
 * and which still return `unknown`.
 *
 * Usage:
 *   bun scripts/coverage.ts           # summary
 *   bun scripts/coverage.ts --full    # list all missing operations
 *   bun scripts/coverage.ts --pulumi  # only operations used by pulumi providers (auto-detected)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Parse ResponseMap keys and detect which map to `unknown`
const responseMap = readFileSync("src/response-map.ts", "utf-8");
const mapped = new Set([...responseMap.matchAll(/"([a-zA-Z]+-[a-zA-Z]+)":/g)].map((m) => m[1]!));

// Detect entries that map to `unknown` (e.g. `"server-one": unknown;`)
const unknownMapped = new Set<string>();
for (const match of responseMap.matchAll(/"([a-zA-Z]+-[a-zA-Z]+)":\s*unknown\b/g)) {
  unknownMapped.add(match[1]!);
}
const typedMapped = new Set([...mapped].filter((op) => !unknownMapped.has(op)));

// Parse all OpenAPI operations
interface OpenAPIDoc {
  paths: Record<string, Record<string, { operationId: string }>>;
}
const doc: OpenAPIDoc = JSON.parse(readFileSync("openapi.json", "utf-8"));

const allOps = new Map<string, string>();
for (const [path, methods] of Object.entries(doc.paths)) {
  for (const data of Object.values(methods)) {
    if (data.operationId) {
      allOps.set(data.operationId, path.replace(/^\//, ""));
    }
  }
}

/**
 * Auto-detect which API operations the Pulumi providers call
 * by scanning the source files for `client.<router>.<method>(` patterns.
 */
function detectPulumiOps(): Set<string> {
  const ops = new Set<string>();
  const pulumiSrc = join(import.meta.dir, "..", "..", "pulumi", "src");

  let files: string[];
  try {
    files = readdirSync(pulumiSrc).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  } catch {
    console.warn("Could not read pulumi/src — run with --full instead");
    return ops;
  }

  for (const file of files) {
    const content = readFileSync(join(pulumiSrc, file), "utf-8");
    // Match: client.router.method( or client.router.method<
    const calls = content.matchAll(/client\.(\w+)\.(\w+)\s*[(<]/g);
    for (const match of calls) {
      const router = match[1]!;
      const method = match[2]!;
      const opId = `${router}-${method}`;
      if (allOps.has(opId)) {
        ops.add(opId);
      }
    }
  }

  return ops;
}

const mode = process.argv[2];

if (mode === "--pulumi") {
  const pulumiOps = detectPulumiOps();

  if (pulumiOps.size === 0) {
    console.log("No Pulumi operations detected. Make sure packages/pulumi/src exists.");
    process.exit(1);
  }

  const missing = [...pulumiOps].filter((op) => !mapped.has(op));
  const typed = [...pulumiOps].filter((op) => typedMapped.has(op));
  const unknown = [...pulumiOps].filter((op) => unknownMapped.has(op));

  console.log(`Pulumi provider operations: ${pulumiOps.size}`);
  console.log(`  Typed:   ${typed.length} (${((typed.length / pulumiOps.size) * 100).toFixed(1)}%)`);
  console.log(`  Unknown: ${unknown.length} (mapped but response is \`unknown\`)`);
  console.log(`  Missing: ${missing.length} (not in ResponseMap at all)`);

  if (unknown.length > 0) {
    console.log("\nUnknown (need to verify response shape against real API):");
    const byRouter = new Map<string, string[]>();
    for (const op of unknown.sort()) {
      const router = op.split("-")[0]!;
      if (!byRouter.has(router)) byRouter.set(router, []);
      byRouter.get(router)!.push(op);
    }
    for (const [router, ops] of [...byRouter.entries()].sort()) {
      console.log(`  ${router}: ${ops.join(", ")}`);
    }
  }

  if (missing.length > 0) {
    console.log("\nMissing (not in ResponseMap at all):");
    const byRouter = new Map<string, string[]>();
    for (const op of missing.sort()) {
      const router = op.split("-")[0]!;
      if (!byRouter.has(router)) byRouter.set(router, []);
      byRouter.get(router)!.push(op);
    }
    for (const [router, ops] of [...byRouter.entries()].sort()) {
      console.log(`  ${router}: ${ops.join(", ")}`);
    }
  }
} else {
  const totalOps = allOps.size;
  const typedAll = [...allOps.keys()].filter((op) => typedMapped.has(op));
  const unknownAll = [...allOps.keys()].filter((op) => unknownMapped.has(op));
  const missingAll = [...allOps.keys()].filter((op) => !mapped.has(op));

  console.log(`Total API operations: ${totalOps}`);
  console.log(`  Typed:   ${typedAll.length} (${((typedAll.length / totalOps) * 100).toFixed(1)}%)`);
  console.log(`  Unknown: ${unknownAll.length} (mapped but \`unknown\`)`);
  console.log(`  Missing: ${missingAll.length} (not mapped)`);

  if (mode === "--full") {
    console.log("\nAll missing operations:");
    const byRouter = new Map<string, string[]>();
    for (const op of missingAll.sort()) {
      const router = op.split("-")[0]!;
      if (!byRouter.has(router)) byRouter.set(router, []);
      byRouter.get(router)!.push(op);
    }
    for (const [router, ops] of [...byRouter.entries()].sort()) {
      console.log(`  ${router} (${ops.length}): ${ops.join(", ")}`);
    }
  }
}
