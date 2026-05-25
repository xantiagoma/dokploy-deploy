# @xantiagoma/dokploy-sst

High-level [Pulumi](https://www.pulumi.com/) components for [Dokploy](https://dokploy.com) — declarative Docker Compose deployments with sensible defaults.

Built on top of [`@xantiagoma/dokploy-pulumi`](../pulumi). 12 components that compose the lower-level primitives into ergonomic, opinionated building blocks.

## Install

```bash
bun add @xantiagoma/dokploy-sst
```

## Components

### DokployProject

Creates a Dokploy project with optional environment variables. Accepts env as an object or raw string. Exposes the auto-created production environment ID.

```ts
import { DokployProject } from "@xantiagoma/dokploy-sst";

const project = new DokployProject("my-app", {
  description: "Production infrastructure",
  env: {
    DATABASE_URL: "postgres://...",
    REDIS_URL: "redis://...",
  },
});

export const projectId = project.projectId;
export const envId = project.productionEnvironmentId;
```

### DokployCompose

Creates a compose service with domains in a single declaration. Automatically detects source type from the provided configuration.

```ts
import { DokployCompose } from "@xantiagoma/dokploy-sst";

new DokployCompose("server", {
  environmentId: project.productionEnvironmentId,
  composePath: "./docker-compose-server.yml",
  github: {
    owner: "myorg",
    repo: "myrepo",
    branch: "main",
  },
  env: {
    NODE_ENV: "production",
    DATABASE_URL: projectRef("DATABASE_URL"),
  },
  autoDeploy: true,
  domains: [
    { host: "api.example.com", serviceName: "server", port: 3000 },
    { host: "app.example.com", serviceName: "web", port: 5173 },
  ],
});
```

### DokployApplication

Creates a single-container application with optional domains, port mappings, and volume mounts.

```ts
import { DokployApplication } from "@xantiagoma/dokploy-sst";

const api = new DokployApplication("api", {
  environmentId: project.productionEnvironmentId,
  description: "REST API service",
  env: { NODE_ENV: "production", PORT: "3000" },
  domains: [
    { host: "api.example.com", port: 3000, https: true },
  ],
  ports: [
    { publishedPort: 3000, targetPort: 3000 },
  ],
  mounts: [
    { type: "volume", mountPath: "/data", volumeName: "api_data" },
  ],
});

export const applicationId = api.applicationId;
```

### DokployPostgres

Creates a PostgreSQL database with an optional scheduled backup.

```ts
import { DokployPostgres, DokployDestination } from "@xantiagoma/dokploy-sst";

const destination = new DokployDestination("backups", {
  name: "backups",
  provider: "cloudflare",
  accessKey: "access-key-id",
  secretAccessKey: config.requireSecret("r2SecretKey"),
  bucket: "my-backups",
  region: "auto",
  endpoint: "https://<account-id>.r2.cloudflarestorage.com",
  additionalFlags: [],
});

const db = new DokployPostgres("app-db", {
  environmentId: project.productionEnvironmentId,
  databaseName: "appdb",
  databaseUser: "appuser",
  databasePassword: config.requireSecret("dbPassword"),
  backup: {
    schedule: "0 3 * * *",
    prefix: "prod-pg",
    destinationId: destination.destinationId,
    keepLatestCount: 14,
  },
});

export const postgresId = db.postgresId;
// Docker-internal hostname — use in connection strings
export const dbHost = db.host;
// Full connection string: postgres://user:pass@host:5432/dbname
export const dbUrl = db.connectionString;
```

Database components expose two computed outputs built from `appName`:

| Output | Description | Example |
|--------|-------------|---------|
| `host` | Docker internal hostname (`appName`) | `"pg-app-db"` |
| `connectionString` | Full DSN ready for use | `"postgres://appuser:secret@pg-app-db:5432/appdb"` |

These are Pulumi `Output<string>` — use them directly in `env` objects:

```ts
new DokployCompose("server", {
  env: {
    DATABASE_URL: db.connectionString,
    DB_HOST: db.host,
  },
});
```

### DokployMysql / DokployMariadb / DokployMongo / DokployRedis

Same pattern as `DokployPostgres` — each accepts an optional `backup` configuration.

```ts
const cache = new DokployRedis("cache", {
  environmentId: project.productionEnvironmentId,
  databasePassword: config.requireSecret("redisPassword"),
});
```

### DokployDestination

Registers an S3-compatible backup storage destination.

```ts
const dest = new DokployDestination("backups", {
  name: "backups",
  provider: "aws",
  accessKey: config.requireSecret("awsAccessKey"),
  secretAccessKey: config.requireSecret("awsSecretKey"),
  bucket: "my-backups",
  region: "us-east-1",
  endpoint: "https://s3.amazonaws.com",
  additionalFlags: [],
});
```

### DokployServer

Registers a remote server in Dokploy for deployment or build offloading.

```ts
const buildServer = new DokployServer("build-server", {
  name: "build-server",
  description: "Dedicated build server",
  ipAddress: "192.168.1.10",
  port: 22,
  username: "root",
  sshKeyId: sshKey.sshKeyId,
  serverType: "build",
});
```

### DokployRegistry

Configures a Docker registry for pulling private images.

```ts
const registry = new DokployRegistry("ghcr", {
  registryName: "GitHub Container Registry",
  username: "myorg",
  password: config.requireSecret("ghcrToken"),
  registryUrl: "ghcr.io",
  registryType: "cloud",
  imagePrefix: "myorg",
});
```

### DokployCertificate

Registers a custom SSL certificate (TLS secrets are write-only, preserved from Pulumi state).

```ts
const cert = new DokployCertificate("my-cert", {
  name: "my-cert",
  certificateData: config.requireSecret("certData"),
  privateKey: config.requireSecret("certPrivateKey"),
  organizationId: "org-id",
  autoRenew: true,
});
```

## All 12 Components

| Component | Description |
|-----------|-------------|
| `DokployProject` | Project + production environment |
| `DokployCompose` | Docker Compose service + domains |
| `DokployApplication` | Single-container service + domains + ports + mounts |
| `DokployPostgres` | PostgreSQL + optional scheduled backup |
| `DokployMysql` | MySQL + optional scheduled backup |
| `DokployMariadb` | MariaDB + optional scheduled backup |
| `DokployMongo` | MongoDB + optional scheduled backup |
| `DokployRedis` | Redis + optional scheduled backup |
| `DokployDestination` | S3-compatible backup storage target |
| `DokployServer` | Remote server registration |
| `DokployRegistry` | Docker registry for private images |
| `DokployCertificate` | Custom SSL certificate |

## `projectRef()` and `envRef()` Helpers

Generate Dokploy variable references for use in env objects. Dokploy resolves these at deploy time.

```ts
import { projectRef, envRef } from "@xantiagoma/dokploy-sst";

new DokployCompose("server", {
  env: {
    DATABASE_URL: projectRef("DATABASE_URL"),
    // → "${{project.DATABASE_URL}}"
    API_URL: envRef("API_URL"),
    // → "${{environment.API_URL}}"
  },
});
```

## Access Lower-Level Resources

The raw Pulumi resources are re-exported for advanced use:

```ts
import { raw } from "@xantiagoma/dokploy-sst";

const tag = new raw.Tag("beta", { name: "beta", color: "#f59e0b" });
const sshKey = new raw.SshKey("deploy-key", { name: "deploy-key", privateKey: "..." });
```

## Defaults

| Property | Default |
|----------|---------|
| `autoDeploy` | `false` |
| `branch` | `"main"` |
| `https` (domains) | `true` |
| `certificateType` (domains) | `"letsencrypt"` |
| `sourceType` | `"github"` if `github` is set, `"git"` if `customGitUrl` is set, `"raw"` otherwise |
| `backup.enabled` | `true` |
| `ports[].protocol` | `"tcp"` |
| `ports[].publishMode` | `"ingress"` |

## License

[MIT](../../LICENSE)
