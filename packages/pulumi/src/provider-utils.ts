import { createDokployClient } from "@xantiagoma/dokploy-api";
import type { DokployClientWithRaw, EnvironmentWithServicesResponse } from "@xantiagoma/dokploy-api";

let cachedClient: DokployClientWithRaw | undefined;

export function getClient(): DokployClientWithRaw {
  if (cachedClient) return cachedClient;

  const endpoint = process.env["DOKPLOY_URL"];
  const apiKey = process.env["DOKPLOY_API_KEY"];

  if (!endpoint || !apiKey) {
    throw new Error(
      "DOKPLOY_URL and DOKPLOY_API_KEY environment variables are required",
    );
  }

  cachedClient = createDokployClient({ endpoint, apiKey });
  return cachedClient;
}

/**
 * Compare old and new property bags for Pulumi diff.
 *
 * Note: Pulumi Dynamic Providers serialize provider closures to state,
 * so this must use only serializable code (no classes with private fields).
 * Libraries like ohash can't be used here.
 */
export function diffProps(
  olds: Record<string, unknown>,
  news: Record<string, unknown>,
  replaceKeys: string[] = [],
): { changes: boolean; replaces: string[] } {
  const replaces: string[] = [];
  let changes = false;

  for (const key of Object.keys(news)) {
    if (JSON.stringify(olds[key]) !== JSON.stringify(news[key])) {
      changes = true;
      if (replaceKeys.includes(key)) {
        replaces.push(key);
      }
    }
  }

  return { changes, replaces };
}

/**
 * Fetch an environment with all nested services (compose, postgres, redis, etc.)
 * using environment.byProjectId which returns EnvironmentWithServicesResponse[].
 *
 * environment.one only returns the bare EnvironmentResponse without services,
 * so we use this lookup pattern instead.
 */
export async function getEnvironmentWithServices(environmentId: string): Promise<EnvironmentWithServicesResponse | undefined> {
  const client = getClient();
  // We need the projectId first — get it from the bare environment
  const env = await client.environment.one({ environmentId });
  const envs = await client.environment.byProjectId({ projectId: env.projectId });
  return envs.find((e) => e.environmentId === environmentId);
}
