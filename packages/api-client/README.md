# @xantiagoma/dokploy-api

Typed HTTP client for the [Dokploy](https://dokploy.com) tRPC API.

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

// Deploy
await client.compose.deploy({ composeId: compose.composeId });

// Stop / Start / Redeploy
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
await client.domain.update({
  domainId: domain.domainId,
  port: 8080,
});
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

## API Coverage

| Router | Methods |
|--------|---------|
| `client.project` | `all`, `one`, `create`, `update`, `remove` |
| `client.environment` | `byProjectId`, `one`, `create`, `update`, `remove` |
| `client.compose` | `one`, `create`, `update`, `deploy`, `stop`, `start`, `delete`, `redeploy`, `fetchSourceType` |
| `client.domain` | `one`, `byComposeId`, `byApplicationId`, `create`, `update`, `delete` |

## License

[MIT](../../LICENSE)
