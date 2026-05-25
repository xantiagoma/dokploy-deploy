# @xantiagoma/dokploy-pulumi

[Pulumi](https://www.pulumi.com/) dynamic provider for [Dokploy](https://dokploy.com) — manage your self-hosted PaaS as infrastructure as code.

Pure TypeScript, no Terraform binary needed. 30 resources covering the full Dokploy surface area.

## Install

```bash
bun add @xantiagoma/dokploy-pulumi
```

## Environment Variables

Set these before running `pulumi up`:

| Variable | Description |
|----------|-------------|
| `DOKPLOY_URL` | Dokploy instance URL (e.g. `https://dokploy.example.com`) |
| `DOKPLOY_API_KEY` | API key from Dashboard > Settings > Profile > API/CLI |

## Resources

### Project

```ts
import * as dokploy from "@xantiagoma/dokploy-pulumi";

const project = new dokploy.Project("my-app", {
  name: "my-app",
  description: "Production infrastructure",
  env: "DATABASE_URL=postgres://...",
});

export const projectId = project.projectId;
export const envId = project.productionEnvironmentId;
```

### Compose

```ts
const server = new dokploy.Compose("server", {
  name: "server",
  environmentId: project.productionEnvironmentId,
  sourceType: "github",
  owner: "myorg",
  repository: "myrepo",
  branch: "main",
  composePath: "./docker-compose.yml",
  autoDeploy: true,
  env: "NODE_ENV=production\nPORT=3000",
});
```

### Application

Single-container service (as opposed to a Docker Compose stack). Changing `environmentId` triggers a replacement.

```ts
const app = new dokploy.Application("api", {
  name: "api",
  environmentId: project.productionEnvironmentId,
  description: "API service",
});
```

### Domain

Attach a Traefik routing rule to a compose service or application.

```ts
// Compose domain
new dokploy.Domain("api-domain", {
  host: "api.example.com",
  composeId: server.composeId,
  serviceName: "api",
  port: 3000,
  https: true,
  certificateType: "letsencrypt",
  domainType: "compose",
});

// Application domain
new dokploy.Domain("app-domain", {
  host: "app.example.com",
  applicationId: app.applicationId,
  port: 3000,
  https: true,
  certificateType: "letsencrypt",
  domainType: "application",
});
```

### Postgres

```ts
const db = new dokploy.Postgres("app-db", {
  name: "app-db",
  environmentId: project.productionEnvironmentId,
  databaseName: "appdb",
  databaseUser: "appuser",
  databasePassword: "supersecret",
  dockerImage: "postgres:16",
});

// appName is the Docker-internal hostname — use it in connection strings
export const host = db.appName;
// externalPort is the internet-facing port (null if not exposed in Dokploy settings)
export const port = db.externalPort;
```

All database resources (`Postgres`, `Mysql`, `Mariadb`, `Mongo`, `Redis`, `Libsql`) expose:
- `appName` — Docker internal hostname, stable across restarts; use in service-to-service connection strings
- `externalPort` — port exposed to the internet, `undefined` if not configured

### Backup

Schedule automatic database backups to an S3-compatible destination.

```ts
new dokploy.Backup("pg-backup", {
  schedule: "0 3 * * *",
  prefix: "prod-pg",
  destinationId: s3Dest.destinationId,
  database: db.postgresId,
  databaseType: "postgres",
  enabled: true,
  keepLatestCount: 14,
});
```

### Destination

S3-compatible storage target for backups.

```ts
const s3Dest = new dokploy.Destination("backups", {
  name: "backups",
  provider: "cloudflare",
  accessKey: "access-key-id",
  secretAccessKey: "secret-access-key",
  bucket: "my-backups",
  region: "auto",
  endpoint: "https://<account-id>.r2.cloudflarestorage.com",
  additionalFlags: [],
});
```

### Notification (Slack)

```ts
new dokploy.SlackNotification("deploy-alerts", {
  name: "deploy-alerts",
  webhookUrl: "https://hooks.slack.com/services/...",
  channel: "#deploys",
  appDeploy: true,
  appBuildError: true,
  databaseBackup: true,
  dokployRestart: true,
  dokployBackup: false,
  volumeBackup: false,
  dockerCleanup: false,
  serverThreshold: false,
});
```

## All 30 Resources

| Category | Resources |
|----------|-----------|
| **Project & Environments** | `Project`, `Environment` |
| **Services** | `Compose`, `Application` |
| **Routing** | `Domain`, `Port`, `Mount`, `Redirect`, `Security` |
| **Databases** | `Postgres`, `Mysql`, `Mariadb`, `Mongo`, `Redis`, `Libsql` |
| **Backups** | `Backup`, `VolumeBackup`, `Schedule`, `Destination` |
| **Infrastructure** | `Server`, `SshKey`, `Registry`, `Certificate` |
| **Tags** | `Tag` |
| **Notifications** | `SlackNotification`, `TelegramNotification`, `DiscordNotification`, `EmailNotification`, `GotifyNotification`, `NtfyNotification`, `MattermostNotification`, `CustomNotification`, `LarkNotification`, `TeamsNotification`, `PushoverNotification`, `ResendNotification` |

## Create Response Quirks

Some Dokploy API create endpoints return `void` or `true` instead of the created resource. The affected providers handle this transparently with a post-create lookup — no action required from callers:

| Resource | API quirk | How it's handled |
|----------|-----------|-----------------|
| `SshKey` | `sshKey.create` returns `void` | lists all keys → finds by name |
| `Redirect` | `redirects.create` returns `true` | reads parent application → finds in `redirects[]` |
| `Security` | `security.create` returns `true` | reads parent application → finds in `security[]` |

## Resource Lifecycle

Each resource implements full CRUD:

| Operation | Description |
|-----------|-------------|
| `create` | Creates the resource via Dokploy API |
| `read` | Fetches current state from Dokploy |
| `update` | Patches changed fields in-place |
| `delete` | Removes the resource from Dokploy |
| `diff` | Detects changes, marks replacements |

## Replacement Triggers

Some property changes require replacing the resource (delete + create):

| Resource | Replacement Properties |
|----------|----------------------|
| `Compose` | `environmentId` |
| `Application` | `environmentId` |
| `Postgres`, `Mysql`, `Mariadb`, `Mongo`, `Redis`, `Libsql` | `environmentId` |
| `Environment` | `projectId` |
| `Domain` | `applicationId`, `composeId` |
| `Port` | `applicationId` |
| `Redirect` | `applicationId` |
| `Security` | `applicationId` |
| `Schedule` | `applicationId`, `composeId`, `serverId` |

## License

[MIT](../../LICENSE)
