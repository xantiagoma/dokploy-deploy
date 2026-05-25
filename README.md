# dokploy-deploy

Declarative Infrastructure as Code for [Dokploy](https://dokploy.com) — manage your self-hosted PaaS with TypeScript.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`@xantiagoma/dokploy-api`](./packages/api-client) | Typed HTTP client for the Dokploy tRPC API | [![npm](https://img.shields.io/npm/v/@xantiagoma/dokploy-api)](https://www.npmjs.com/package/@xantiagoma/dokploy-api) |
| [`@xantiagoma/dokploy-pulumi`](./packages/pulumi) | Pulumi dynamic provider (Project, Compose, Domain) | [![npm](https://img.shields.io/npm/v/@xantiagoma/dokploy-pulumi)](https://www.npmjs.com/package/@xantiagoma/dokploy-pulumi) |
| [`@xantiagoma/dokploy-sst`](./packages/sst) | High-level SST/Pulumi components | [![npm](https://img.shields.io/npm/v/@xantiagoma/dokploy-sst)](https://www.npmjs.com/package/@xantiagoma/dokploy-sst) |

## Why?

Dokploy is a great self-hosted PaaS, but it lacks a proper IaC story. The existing Terraform providers are immature (no GitHub auto-deploy, missing resources). This project builds directly on the Dokploy tRPC API using Pulumi Dynamic Providers — TypeScript all the way down, no Go/Terraform binary needed.

## Quick Start

```bash
bun add @xantiagoma/dokploy-api
# or for IaC:
bun add @xantiagoma/dokploy-pulumi
```

### API Client

```ts
import { createDokployClient } from "@xantiagoma/dokploy-api";

const client = createDokployClient({
  endpoint: "https://dokploy.example.com",
  apiKey: process.env.DOKPLOY_API_KEY!,
});

const projects = await client.project.all();
await client.compose.deploy({ composeId: "..." });
```

### Pulumi Provider

```ts
import * as dokploy from "@xantiagoma/dokploy-pulumi";

const project = new dokploy.Project("my-app", {
  name: "my-app",
  description: "Production infrastructure",
});

const server = new dokploy.Compose("server", {
  name: "server",
  projectId: project.projectId,
  environmentId: project.productionEnvironmentId,
  sourceType: "github",
  owner: "myorg",
  repository: "myrepo",
  branch: "main",
  composePath: "./docker-compose.yml",
  autoDeploy: true,
  env: "NODE_ENV=production",
});

new dokploy.Domain("api", {
  host: "api.example.com",
  composeId: server.composeId,
  serviceName: "api",
  port: 3000,
  https: true,
  certificateType: "letsencrypt",
});
```

### SST Components

```ts
import { DokployProject, DokployCompose } from "@xantiagoma/dokploy-sst";

const project = new DokployProject("my-app", {
  env: { DATABASE_URL: "postgres://..." },
});

new DokployCompose("server", {
  project: "my-app",
  projectId: project.projectId,
  environmentId: project.productionEnvironmentId,
  composePath: "./docker-compose.yml",
  github: { owner: "myorg", repo: "myrepo" },
  env: { NODE_ENV: "production" },
  autoDeploy: true,
  domains: [
    { host: "api.example.com", serviceName: "api", port: 3000 },
  ],
});
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DOKPLOY_URL` | Dokploy instance URL (e.g. `https://dokploy.example.com`) |
| `DOKPLOY_API_KEY` | API key from Dashboard > Settings > Profile > API/CLI |

## Architecture

```
@xantiagoma/dokploy-api    <- typed HTTP client for Dokploy tRPC API
  ^
@xantiagoma/dokploy-pulumi <- Pulumi dynamic provider (create/read/update/delete)
  ^
@xantiagoma/dokploy-sst    <- high-level SST components
```

## Development

```bash
bun install
bun run check-types   # type check all packages
bun test              # run tests (needs DOKPLOY_URL + DOKPLOY_API_KEY for integration tests)
```

## Releasing

Uses [changelogen](https://github.com/unjs/changelogen) with conventional commits:

```bash
bun run release       # bump version, update CHANGELOG.md, commit, tag, push
```

CI automatically creates a GitHub Release and publishes to npm on tag push.

## License

[MIT](./LICENSE) - Santiago Montoya
