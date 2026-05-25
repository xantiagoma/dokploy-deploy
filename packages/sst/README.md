# @xantiagoma/dokploy-sst

High-level [Pulumi](https://www.pulumi.com/) components for [Dokploy](https://dokploy.com) — declarative Docker Compose deployments with sensible defaults.

Built on top of [`@xantiagoma/dokploy-pulumi`](../pulumi).

## Install

```bash
bun add @xantiagoma/dokploy-sst
```

## Usage

### DokployProject

Creates a Dokploy project with optional environment variables. Accepts env as an object or raw string.

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
  project: "my-app",
  projectId: project.projectId,
  environmentId: project.productionEnvironmentId,
  composePath: "./docker-compose-server.yml",
  github: {
    owner: "myorg",
    repo: "myrepo",
    branch: "main",
  },
  env: {
    NODE_ENV: "production",
    DATABASE_URL: "${{project.DATABASE_URL}}",
  },
  autoDeploy: true,
  domains: [
    { host: "api.example.com", serviceName: "server", port: 3000 },
    { host: "app.example.com", serviceName: "web", port: 5173 },
  ],
});
```

### Access Lower-Level Resources

The raw Pulumi resources are exposed for advanced use cases:

```ts
import { raw } from "@xantiagoma/dokploy-sst";

const project = new raw.Project("custom", { name: "custom" });
```

## Defaults

| Property | Default |
|----------|---------|
| `autoDeploy` | `false` |
| `branch` | `"main"` |
| `https` (domains) | `true` |
| `certificateType` (domains) | `"letsencrypt"` |
| `sourceType` | `"github"` if `github` is set, `"raw"` otherwise |

## License

[MIT](../../LICENSE)
