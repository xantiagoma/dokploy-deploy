# @xantiagoma/dokploy-pulumi

[Pulumi](https://www.pulumi.com/) dynamic provider for [Dokploy](https://dokploy.com) — manage your self-hosted PaaS as infrastructure as code.

Pure TypeScript, no Terraform binary needed.

## Install

```bash
bun add @xantiagoma/dokploy-pulumi
```

## Resources

### Project

```ts
import * as dokploy from "@xantiagoma/dokploy-pulumi";

const project = new dokploy.Project("my-app", {
  name: "my-app",
  description: "Production infrastructure",
  env: "DATABASE_URL=postgres://...",
});

// Outputs
export const projectId = project.projectId;
export const envId = project.productionEnvironmentId;
```

### Compose

```ts
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
  env: "NODE_ENV=production\nPORT=3000",
});
```

### Domain

```ts
const domain = new dokploy.Domain("api", {
  host: "api.example.com",
  composeId: server.composeId,
  serviceName: "api",
  port: 3000,
  https: true,
  certificateType: "letsencrypt",
});
```

## Environment Variables

Set these before running `pulumi up`:

| Variable | Description |
|----------|-------------|
| `DOKPLOY_URL` | Dokploy instance URL |
| `DOKPLOY_API_KEY` | API key from Dashboard > Settings > Profile |

## Resource Lifecycle

Each resource implements full CRUD:

| Operation | Description |
|-----------|-------------|
| `create` | Creates the resource via Dokploy API |
| `read` | Fetches current state from Dokploy |
| `update` | Patches changed fields in-place |
| `delete` | Removes the resource from Dokploy |
| `diff` | Detects changes, marks replacements |

### Replacement Triggers

Some property changes require replacing the resource (delete + create):

- **Compose**: `projectId`, `environmentId`
- **Domain**: `applicationId`, `composeId`

## License

[MIT](../../LICENSE)
