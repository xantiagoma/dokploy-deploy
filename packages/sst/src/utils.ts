import * as pulumi from "@pulumi/pulumi";
import { createDokployClient } from "@xantiagoma/dokploy-api";

export function envToString(env: Record<string, string> | string): string {
  if (typeof env === "string") return env;
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
}

/**
 * Reference a project-level environment variable.
 * Dokploy resolves this at deploy time.
 *
 * @example
 * ```ts
 * env: {
 *   DATABASE_URL: projectRef("DATABASE_URL"),
 *   // → "DATABASE_URL=${{project.DATABASE_URL}}"
 * }
 * ```
 */
export function projectRef(name: string): string {
  return `\${{project.${name}}}`;
}

/**
 * Reference an environment-level variable (production, staging, etc.).
 * Dokploy resolves this at deploy time.
 *
 * @example
 * ```ts
 * env: {
 *   API_URL: envRef("API_URL"),
 *   // → "API_URL=${{environment.API_URL}}"
 * }
 * ```
 */
export function envRef(name: string): string {
  return `\${{environment.${name}}}`;
}

// ---------------------------------------------------------------------------
// Git provider lookup
// ---------------------------------------------------------------------------

function getClient() {
  const endpoint = process.env["DOKPLOY_URL"];
  const apiKey = process.env["DOKPLOY_API_KEY"];
  if (!endpoint || !apiKey) {
    throw new Error("DOKPLOY_URL and DOKPLOY_API_KEY are required for gitProvider()");
  }
  return createDokployClient({ endpoint, apiKey });
}

/**
 * Look up a Git provider by name and return its ID.
 *
 * Calls the Dokploy API to resolve the provider name (e.g. `"Watson-Dokploy"`)
 * to its internal `githubId`. Use this instead of hardcoding provider IDs.
 *
 * @example
 * ```ts
 * import { DokployCompose, gitProvider } from "@xantiagoma/dokploy-sst";
 *
 * const github = gitProvider("Watson-Dokploy");
 *
 * new DokployCompose("server", {
 *   environmentId: project.productionEnvironmentId,
 *   github: { owner: "xantiagoma", repo: "demi-casa", githubId: github },
 *   composePath: "./docker-compose-server.yml",
 * });
 * ```
 */
export function gitProvider(name: string): pulumi.Output<string> {
  return pulumi.output(
    (async () => {
      const client = getClient();
      const providers = await client.github.githubProviders();
      const match = providers.find((p) => p.gitProvider.name === name);
      if (!match) {
        const available = providers.map((p) => p.gitProvider.name).join(", ");
        throw new Error(`Git provider "${name}" not found. Available: ${available || "none"}`);
      }
      return match.githubId;
    })(),
  );
}
