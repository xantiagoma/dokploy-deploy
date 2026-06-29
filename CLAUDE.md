# dokploy-deploy

Instructions for AI assistants working on this project.

## Overview

Declarative IaC for [Dokploy](https://dokploy.com) — a self-hosted PaaS. Four packages:

- `packages/api-client` — `@xantiagoma/dokploy-api` — typed HTTP client (526 endpoints, codegen'd from OpenAPI)
- `packages/pulumi` — `@xantiagoma/dokploy-pulumi` — Pulumi Dynamic Provider (30 resources)
- `packages/sst` — `@xantiagoma/dokploy-sst` — high-level SST/Pulumi components (12 components)
- `packages/cli` — `@xantiagoma/dokploy` — CLI with `dokploy pull` to import existing infrastructure

## Tech Stack

- **Runtime**: Bun
- **Package Manager**: Bun workspaces with catalog versioning
- **Build**: tsdown
- **Type Checking**: tsc (TypeScript 5.x)
- **Testing**: bun test
- **CI/CD**: GitHub Actions + changelogen
- **Code Generation**: openapi-typescript + ts-morph

## Project Structure

```
dokploy-deploy/
├── packages/
│   ├── api-client/           # @xantiagoma/dokploy-api
│   │   ├── scripts/
│   │   │   └── generate.ts   # Single codegen script (openapi-typescript + ts-morph)
│   │   ├── src/
│   │   │   ├── response-map.ts     # ONLY hand-written file — known response shapes
│   │   │   ├── client.test.ts      # Integration tests (needs DOKPLOY_URL + DOKPLOY_API_KEY)
│   │   │   ├── generated.ts        # Auto-generated (openapi-typescript, 44K lines)
│   │   │   ├── generated-routers.ts # Auto-generated (ts-morph: 48 routers, 526 methods)
│   │   │   ├── client.ts           # Auto-generated (transport, error, factory)
│   │   │   └── index.ts            # Auto-generated (barrel exports)
│   │   ├── openapi.json            # OpenAPI spec (fetched from docs.dokploy.com)
│   │   └── tsdown.config.ts
│   ├── pulumi/               # @xantiagoma/dokploy-pulumi
│   │   └── src/              # 30 Pulumi Dynamic Provider resources
│   ├── sst/                  # @xantiagoma/dokploy-sst
│   │   └── src/              # 12 high-level SST components + helpers
│   └── cli/                  # @xantiagoma/dokploy
│       └── src/              # CLI with `dokploy pull` command (citty + ts-morph)
├── test-e2e/                 # Pulumi E2E test fixtures
├── scripts/
│   └── sync-versions.ts      # Sync root version to all packages (changelogen hook)
└── .github/workflows/        # CI + release workflows
```

## Critical Rules

### No `as` Type Casts

**NEVER use `as` to cast API responses or inputs.** This is the #1 source of bugs in this project. Instead:

- **Response types**: The ResponseMap + `ResponseOf<"op-id">` generics handle this automatically. If a response type is missing, add it to `response-map.ts` — don't cast.
- **Input types**: If TypeScript rejects your input, it means you're passing fields the API doesn't accept. Check the OpenAPI spec (`openapi.json` or `generated.ts`) for the actual input shape. **Don't pass fields that aren't in the API.**
- **Enum fields**: Use the correct union type (`"primary" | "replica"`, not `string`). Check the generated type.
- **`Record<string, unknown>`**: Don't use this for API payloads. Build a properly typed object.
- **`as Parameters<typeof client.X.Y>[0]`**: This is ALWAYS wrong. It masks type errors. Fix the underlying issue instead.

Allowed uses of `as`:
- `olds["field"] as string` — accessing Pulumi state (untyped by nature)
- `as ComposeSourceType` — narrowing a response field to a known enum (when the response type uses `string`)
- `as const` — const assertions

When in doubt, check the OpenAPI spec for what the endpoint actually accepts/returns.

### Code Generation

All files in `packages/api-client/src/` except `response-map.ts` and `client.test.ts` are **auto-generated**. Never edit them manually. Instead:

```bash
cd packages/api-client && bun run generate
```

This single script:
1. Fetches the OpenAPI spec from `https://docs.dokploy.com/openapi.json`
2. Runs `openapi-typescript` → `src/generated.ts`
3. Uses `ts-morph` to generate `src/generated-routers.ts`, `src/client.ts`, `src/index.ts`

To regenerate from a custom instance: `bun scripts/generate.ts https://my-instance.com`

### ResponseMap Pattern

Response types live in `src/response-map.ts`. The generated routers use `<T = ResponseOf<"operation-id">>` — if the operation ID is in `ResponseMap`, the return type is known; otherwise it falls back to `unknown`.

Coverage as of last update: **96.7% of Pulumi-used operations are fully typed** (real interfaces, not `unknown`). Only 4 operations remain as `unknown` — all `server-*` (create, one, update, remove) because the Server API response shape is complex and not yet verified.

#### Coverage scripts

```bash
cd packages/api-client
bun run coverage           # summary: Typed / Unknown / Missing across all 526 ops
bun run coverage:pulumi    # only operations actually called by pulumi providers (auto-detected)
bun run coverage:full      # summary + full list of every missing operation
```

Coverage output distinguishes three states:
- **Typed** — operation is in `ResponseMap` with a real interface (fully typed)
- **Unknown** — operation is in `ResponseMap` but mapped to `unknown` (e.g. `server-*`)
- **Missing** — operation is not in `ResponseMap` at all (falls back to `unknown`)

To add a new response type:
1. Verify the real shape by calling the endpoint against a live Dokploy instance
2. Add the interface to `response-map.ts`
3. Add the operation ID mapping to the `ResponseMap` interface
4. That's it — the routers auto-pick it up

#### void/true create response gotcha

Some create/delete endpoints **do not return the resource** — they return `void` or `true`. These providers must use a follow-up read to retrieve the ID:

| Operation | Actual return | Provider workaround |
|-----------|--------------|---------------------|
| `sshKey.create` | `void` | creates → `sshKey.all()` → finds by name |
| `redirects.create` | `true` | creates → `application.one()` → finds in `redirects[]` |
| `security.create` | `true` | creates → `application.one()` → finds in `security[]` |
| `schedule.delete` | `true` | no workaround needed (delete ignores return) |
| `tag.remove` | `{ success: true }` | no workaround needed |
| `volumeBackups.delete` | `void` | no workaround needed |

When adding a new provider, always check `ResponseMap` for the create operation — if it maps to `void` or `true`, you need the look-up pattern above.

### Dokploy API Quirks

- **Mutations**: `POST /api/<procedure>` with raw JSON body (NO `{"json":...}` wrapper)
- **Queries**: `GET /api/trpc/<procedure>?input=URL_ENCODED({"json":{...}})`
- **`project.create`** returns `{ project, environment }` — not just the project
- **`compose.create`** requires `environmentId` (not `projectId`)
- **`compose.delete`** requires `deleteVolumes: boolean`
- **`domain.update`** requires both `host` and `domainId`
- **DB `appName`** is the Docker internal hostname — used in connection strings (e.g. `postgres://user:pass@<appName>:5432/db`)
- **DB `externalPort`** is the port exposed to the internet (`null` if not configured)
- **`sshKey.create`** returns `void` — find the key afterwards via `sshKey.all()` filtered by name
- **`redirects.create`** returns `true` — find the redirect via `application.one()` in `redirects[]`
- **`security.create`** returns `true` — find the entry via `application.one()` in `security[]`
- **`schedule.delete`**, **`tag.remove`**, **`volumeBackups.delete`** also return non-resource values (see ResponseMap)
- **Swarm fields** are all null unless running in Docker Swarm mode
- **Response types** from OpenAPI spec are empty (`{}`) — tRPC-to-OpenAPI limitation. We verify shapes against the real API.

### Cloudflare + Dokploy Domains

When Dokploy runs behind Cloudflare (proxied DNS), domains must use:

```ts
domains: [{
  host: "app.example.com",
  serviceName: "app",
  port: 3000,
  https: false,           // Cloudflare terminates SSL
  certificateType: "none", // Don't generate letsencrypt certs
}]
```

**Why:** Cloudflare handles HTTPS and forwards HTTP to Traefik. If `https: true` or `certificateType: "letsencrypt"`, Traefik redirects to HTTPS → Cloudflare sends HTTP again → infinite redirect loop (`ERR_TOO_MANY_REDIRECTS`).

The SST component defaults are `https: true` + `certificateType: "letsencrypt"` — correct for non-Cloudflare setups, but must be overridden when Cloudflare proxies the domain.

### Pulumi Dynamic Provider Constraints

Pulumi serializes provider closures to state. This means:
- No classes with private fields (`#field`) in provider code
- No `ohash`, `WeakMap`, or non-serializable dependencies
- Keep provider implementations simple and serializable
- The `diffProps` utility uses `JSON.stringify` comparison (not deep equality libraries)
- **Class fields MUST use `declare`** — `public readonly field!: Output<T>` gets compiled by tsdown to `field;` which overwrites Pulumi's outputs with `undefined`. Use `declare public readonly field: Output<T>` instead.

#### diffProps must ignore `__provider` and unknown sentinels (replace-storm guard)

A version bump of `@xantiagoma/dokploy-pulumi` must be a safe in-place no-op on a live stack — NOT a destructive replace. `diffProps` enforces this by skipping two values:

- **`__provider`** — the runtime injects the serialized provider closure into every resource's prop bag under this key. It changes on every package version bump, so counting it as a diff would mark every resource for update.
- **`UNKNOWN_VALUE`** (`"04da6b54-80e4-46f7-96ec-b56ff0331ba9"`) — Pulumi's unknown-output sentinel. During `preview`, an input reading an upstream resource's not-yet-known output (e.g. `environmentId: project.productionEnvironmentId` when the project has a pending update) arrives as this sentinel. Treating `known => unknown` as a change on a **replace-trigger key** (`environmentId`, `composeId`, …) would cascade into a replace of every dependent compose/domain/database — **including DB data loss**. `diffProps` never reports a change or replace for an unknown value; Pulumi re-runs `diff()` with the resolved value at update time, so genuine changes are still caught.

The dynamic-provider host deserializes `diff()` from `news.__provider` (the *current program's* code, not old state), so this fix takes effect on the very upgrade that introduces it. Any new replace-trigger key passed to `diffProps` inherits this protection automatically — keep all replace logic flowing through `diffProps`, never hand-roll a `replaces` array. Regression tests live in `packages/pulumi/src/provider-utils.test.ts`.

### Database Connection Strings

SST database components expose `connectionString` and `host`:

```ts
const db = new DokployPostgres("db", { ... });
db.connectionString  // postgres://user:pass@appName:5432/dbname
db.host              // Docker internal hostname (appName)
```

Env var reference helpers:
```ts
import { projectRef, envRef } from "@xantiagoma/dokploy-sst";
projectRef("DATABASE_URL")  // → "${{project.DATABASE_URL}}"
envRef("API_URL")            // → "${{environment.API_URL}}"
```

### Building & Testing

```bash
bun install
bun run check-types      # tsc --noEmit across all packages
bun run build            # tsdown build all packages
bun test                 # integration tests (needs DOKPLOY_URL + DOKPLOY_API_KEY)
```

### Releasing

Two-stage flow. **You never run `npm publish` locally** — pushing a `v*` tag is what publishes.

**Stage 1 — local** (`bun run release` = `scripts/release.ts`):
1. `changelogen --bump --output` — bumps the **root** `package.json` version + writes CHANGELOG (auto-detects semver from conventional commits; force with `bun run release -- --patch` / `--minor`)
2. `scripts/sync-versions.ts` — copies the root version into all 4 `packages/*/package.json`
3. `git add -A` → commit `chore(release): vX.Y.Z` → annotated tag `vX.Y.Z` → `git push --follow-tags`

```bash
bun run release            # auto bump
bun run release -- --patch # force patch
```

**Stage 2 — CI** (`.github/workflows/release.yml`, triggered by the pushed `v*` tag):
- `bun install --frozen-lockfile` → `check-types` → `bun test` → `build`
- `changelogen gh release` creates the GitHub Release
- rewrites `"workspace:*"` → `"^<version>"` in each package.json (on the fresh checkout)
- `npm publish --access public --provenance` for all 4 packages in order: api-client → pulumi → sst → cli (each `|| true`, so one failure won't block the rest)
- Needs repo secrets: `NPM_TOKEN` (publish) + `GITHUB_TOKEN` (auto, for the release); `id-token: write` enables npm provenance.

**Why CI `bun test` doesn't fail without creds:** `client.test.ts` uses `describe.skipIf(!DOKPLOY_URL || !DOKPLOY_API_KEY)`, so the integration suite is skipped in CI (no Dokploy secrets there).

**CI on every push/PR to main** (`.github/workflows/ci.yml`): `check-types` → `build` → `test` (no publish).

After a release, verify with `gh run list` (look for the `Release` workflow on the tag) and `npm view @xantiagoma/dokploy-api version`.

### Pulumi Resources (30)

| Category | Resources |
|----------|-----------|
| Project & Environments | Project, Environment |
| Services | Compose, Application |
| Routing | Domain, Port, Mount, Redirect, Security |
| Databases | Postgres, Mysql, Mariadb, Mongo, Redis, Libsql |
| Backups | Backup, VolumeBackup, Schedule, Destination |
| Infrastructure | Server, SshKey, Registry, Certificate, Tag |
| Notifications | SlackNotification, TelegramNotification, DiscordNotification, EmailNotification, GotifyNotification, NtfyNotification, MattermostNotification, CustomNotification, LarkNotification, TeamsNotification, PushoverNotification, ResendNotification |

### SST Components (12)

DokployProject, DokployCompose, DokployApplication, DokployPostgres, DokployMysql, DokployMariadb, DokployMongo, DokployRedis, DokployDestination, DokployServer, DokployRegistry, DokployCertificate

### Testing Against Real Dokploy

The demi.casa Dokploy instance is at `http://watson:3000` (also `https://cloud.demi.casa`). Credentials are in `/Users/santi/Projects/demi.casa/.env` (`DOKPLOY_URL` + `DOKPLOY_API_KEY`).

Existing resources on demi.casa (project ID `3stqyguM5w5TjWtq87V-D`, env `VNBynH0RcKuQX9Kik7ATA`):
- 9 compose services, 1 postgres (`oQtrjeD5Gnl6gDiA9Nvbi`), 1 redis (`QQEnYORLIC7I_tqWENjkJ`)
- GitHub App ID: `c3F8eZ5ZSq53olUiAxKpE`

Use this instance to verify response shapes and test providers. Create test projects for experiments — always clean up after.

**Lessons learned from real API testing:**

- All `ResponseMap` interfaces were verified against this instance — the OpenAPI spec has empty `{}` response schemas for all tRPC endpoints so the spec alone cannot be trusted
- DB resources: `appName` is always populated on create; `externalPort` is `null` until you explicitly expose a port in Dokploy settings
- `sshKey.create`, `redirects.create`, `security.create` silently return non-resource values — the bug manifested as Pulumi providers crashing when trying to read `.sshKeyId` off `void`. Fixed by doing a post-create lookup.
- `schedule.delete` returning `true` and `volumeBackups.delete` returning `void` are fine — delete operations don't need to return the resource
- Run `bun run coverage:pulumi` from `packages/api-client` after adding a new provider to verify all its operations are in `ResponseMap`
