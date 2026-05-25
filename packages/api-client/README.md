# @xantiagoma/dokploy-api

Typed HTTP client for the [Dokploy](https://dokploy.com) tRPC API.

Fully codegen'd from the official OpenAPI spec — 526 endpoints across 48 routers. Run `bun run generate` to regenerate from the latest spec.

## Install

```bash
bun add @xantiagoma/dokploy-api
```

## Usage

```ts
import { createDokployClient } from "@xantiagoma/dokploy-api";

const client = createDokployClient({
  endpoint: "https://dokploy.example.com",
  apiKey: process.env.DOKPLOY_API_KEY!,
});
```

### Projects

```ts
// List all projects
const projects = await client.project.all();

// Create a project (auto-creates a production environment)
const { project, environment } = await client.project.create({
  name: "my-app",
  description: "My application",
});

// Update project-level env vars
await client.project.update({
  projectId: project.projectId,
  env: "DATABASE_URL=postgres://...\nREDIS_URL=redis://...",
});

// Delete a project
await client.project.remove({ projectId: project.projectId });
```

### Compose Services

```ts
// Create a compose service
const compose = await client.compose.create({
  name: "server",
  projectId: project.projectId,
  environmentId: environment.environmentId,
});

// Configure GitHub source + auto-deploy
await client.compose.update({
  composeId: compose.composeId,
  sourceType: "github",
  owner: "myorg",
  repository: "myrepo",
  branch: "main",
  composePath: "./docker-compose.yml",
  autoDeploy: true,
  env: "NODE_ENV=production",
});

// Deploy / Stop / Start / Redeploy
await client.compose.deploy({ composeId: compose.composeId });
await client.compose.stop({ composeId: compose.composeId });
await client.compose.start({ composeId: compose.composeId });
await client.compose.redeploy({ composeId: compose.composeId });
```

### Domains

```ts
// Add a domain to a compose service
const domain = await client.domain.create({
  host: "api.example.com",
  composeId: compose.composeId,
  serviceName: "api",
  port: 3000,
  https: true,
  certificateType: "letsencrypt",
});

// List domains for a compose service
const domains = await client.domain.byComposeId({
  composeId: compose.composeId,
});

// Update domain
await client.domain.update({ domainId: domain.domainId, port: 8080 });
```

### Environments

```ts
// List environments in a project
const envs = await client.environment.byProjectId({
  projectId: project.projectId,
});

// Create a staging environment
const staging = await client.environment.create({
  name: "staging",
  projectId: project.projectId,
});
```

### Databases

```ts
// Postgres
const pg = await client.postgres.create({
  name: "app-db",
  environmentId: environment.environmentId,
  databaseName: "appdb",
  databaseUser: "appuser",
  databasePassword: "supersecret",
});

// MySQL / MariaDB / MongoDB / Redis — same pattern
await client.mysql.create({ ... });
await client.mariadb.create({ ... });
await client.mongo.create({ ... });
await client.redis.create({ ... });
```

### Backups

```ts
await client.backup.create({
  schedule: "0 2 * * *",
  prefix: "prod-pg",
  destinationId: destination.destinationId,
  database: pg.postgresId,
  databaseType: "postgres",
  keepLatestCount: 7,
});

// Trigger a manual backup
await client.backup.manualBackupPostgres({ backupId: backup.backupId });
```

### Error Handling

```ts
import { DokployApiError } from "@xantiagoma/dokploy-api";

try {
  await client.project.one({ projectId: "invalid-id" });
} catch (err) {
  if (err instanceof DokployApiError) {
    console.error(err.procedure); // "project.one"
    console.error(err.status);    // 404
    console.error(err.body);      // raw response body
  }
}
```

### `client.raw` — Advanced Usage

The client exposes the underlying `openapi-fetch` instance for endpoints not yet covered by the typed routers:

```ts
const { data, error } = await client.raw.GET("/api/trpc/some.procedure", {
  params: { query: { input: JSON.stringify({ json: { id: "..." } }) } },
});
```

## API Coverage

526 endpoints across 48 routers, grouped by category:

| Category | Routers |
|----------|---------|
| **Services** | `application`, `compose`, `domain`, `port`, `mounts`, `redirects`, `security` |
| **Databases** | `postgres`, `mysql`, `mariadb`, `mongo`, `redis`, `libsql` |
| **Infrastructure** | `project`, `environment`, `server`, `destination`, `registry`, `sshKey` |
| **Deployments** | `deployment`, `previewDeployment`, `rollback`, `schedule`, `backup`, `volumeBackups` |
| **Git Providers** | `github`, `gitlab`, `bitbucket`, `gitea`, `gitProvider` |
| **Notifications** | `notification` |
| **Platform** | `admin`, `ai`, `auditLog`, `certificates`, `cluster`, `customRole`, `docker`, `licenseKey`, `organization`, `patch`, `settings`, `sso`, `stripe`, `swarm`, `tag`, `user`, `whitelabeling` |

All routers are accessible as properties on the client (e.g., `client.postgres`, `client.notification`).

## `ResponseMap` Pattern

Common response shapes are defined in `response-map.ts` and wired into the generated routers. The client is fully typed for the most common operations. Unknown operations fall back to `unknown` — cast the result or add an entry to `ResponseMap`.

```ts
// Fully typed — ResponseMap covers these (no annotation needed)
const projects = await client.project.all();       // ProjectResponse[]
const pg = await client.postgres.one({ postgresId: "..." }); // PostgresResponse

// For uncovered operations, use the generic parameter — never `as`
const result = await client.docker.getConfig<{ containers: number }>();
```

Coverage of Pulumi-used operations: **96.7% typed** (real interfaces). Only `server-*` operations remain as `unknown`. All other Pulumi provider operations have verified response types.

### Checking coverage

```bash
bun run coverage           # summary across all 526 operations
bun run coverage:pulumi    # only operations used by pulumi providers
bun run coverage:full      # full list of every untyped operation
```

Coverage output categories:
- **Typed** — real interface in `ResponseMap` (fully typed)
- **Unknown** — in `ResponseMap` but mapped to `unknown` (shape not yet verified)
- **Missing** — not in `ResponseMap` at all (falls back to `unknown`)

### void/true create responses

Some endpoints **don't return the created resource**. These are documented in `ResponseMap`:

| Operation | Returns |
|-----------|---------|
| `sshKey.create` | `void` |
| `redirects.create` | `true` |
| `security.create` | `true` |
| `schedule.delete` | `true` |
| `tag.remove` | `{ success: true }` |
| `volumeBackups.delete` | `void` |

When using these operations programmatically, fetch the resource by a secondary lookup (list + filter by name, or read the parent resource).

## Regenerating

```bash
bun run generate  # fetches latest OpenAPI spec and regenerates generated.ts + generated-routers.ts
```

## License

[MIT](../../LICENSE)
