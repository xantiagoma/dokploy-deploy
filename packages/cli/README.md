# @xantiagoma/dokploy

CLI for [Dokploy](https://dokploy.com) infrastructure as code.

## Install

```bash
# Run directly (no install)
npx @xantiagoma/dokploy pull --url https://dokploy.example.com --key YOUR_KEY

# Or install globally
bun add -g @xantiagoma/dokploy
```

## Commands

### `dokploy pull`

Pull existing Dokploy infrastructure into IaC code. Reads all projects, environments, services, databases, and domains, then outputs TypeScript code.

```bash
# SST format (default)
npx @xantiagoma/dokploy pull --url https://dokploy.example.com --key YOUR_KEY

# Pulumi format
npx @xantiagoma/dokploy pull --url https://dokploy.example.com --key YOUR_KEY --format pulumi

# Write to file
npx @xantiagoma/dokploy pull --url https://dokploy.example.com --key YOUR_KEY -o infra.ts

# Using environment variables
DOKPLOY_URL=https://dokploy.example.com DOKPLOY_API_KEY=YOUR_KEY npx @xantiagoma/dokploy pull
```

#### Options

| Option | Description |
|--------|-------------|
| `--url` | Dokploy instance URL (or `DOKPLOY_URL` env var) |
| `--key` | API key (or `DOKPLOY_API_KEY` env var) |
| `--format` | `sst` (default) or `pulumi` |
| `-o, --output` | Write to file instead of stdout |

#### What it generates

- Projects with env vars
- Postgres, MySQL, MariaDB, MongoDB, Redis databases
- Compose services with GitHub/Git source, env vars, and domains
- Applications with domains
- Auto-detects `${{project.VAR}}` references and converts to `projectRef("VAR")`

## License

[MIT](../../LICENSE)
