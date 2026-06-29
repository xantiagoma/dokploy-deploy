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
 * Pulumi's sentinel for an output value that is not yet known — it stands in for
 * any input that depends on an upstream resource's outputs while those outputs
 * are still being computed (i.e. during `pulumi preview`).
 * @see {@link https://github.com/pulumi/pulumi/blob/master/sdk/nodejs/runtime/rpc.ts}
 */
export const UNKNOWN_VALUE = "04da6b54-80e4-46f7-96ec-b56ff0331ba9";

/**
 * Property the dynamic-provider runtime injects into every resource's prop bag,
 * holding the serialized provider closure. Its value changes whenever this
 * package's code changes (e.g. a version bump), so it must never be treated as a
 * meaningful diff.
 */
const PROVIDER_KEY = "__provider";

/**
 * Compare old and new property bags for Pulumi diff.
 *
 * Two values are deliberately ignored so that bumping this package's version is a
 * safe, in-place no-op rather than a destructive replace storm:
 *
 * 1. **`__provider`** — the serialized provider closure changes on every package
 *    version bump. Counting it as a diff would mark every resource for update.
 * 2. **Unknown sentinels** — during preview, an input that reads an upstream
 *    resource's not-yet-known output (e.g. `environmentId:
 *    project.productionEnvironmentId` when the project itself has a pending
 *    update) arrives as {@link UNKNOWN_VALUE}. We cannot know whether it actually
 *    changed, so we never report a change or — critically — a replace for it.
 *    Pulumi re-runs `diff()` with the resolved value at update time, so genuine
 *    changes are still caught; we only suppress the spurious preview-time
 *    `known => unknown` diff that would otherwise cascade into a replace of every
 *    dependent resource (composes, domains, databases — including data loss).
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
    if (key === PROVIDER_KEY) continue;
    if (news[key] === UNKNOWN_VALUE) continue;

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
  try {
    // environment.one actually returns the full EnvironmentWithServicesResponse
    // (compose, postgres, redis, etc.) despite the type saying otherwise
    const env = await client.environment.one({ environmentId });
    const envWithServices = env as unknown as EnvironmentWithServicesResponse;
    if (envWithServices.compose) return envWithServices;

    // Fallback: use byProjectId which is properly typed
    const envs = await client.environment.byProjectId({ projectId: env.projectId });
    return envs.find((e) => e.environmentId === environmentId);
  } catch (err) {
    // Pulumi Dynamic Providers need Error instances for proper serialization
    if (err instanceof Error) throw err;
    throw new Error(`getEnvironmentWithServices failed: ${String(err)}`);
  }
}
