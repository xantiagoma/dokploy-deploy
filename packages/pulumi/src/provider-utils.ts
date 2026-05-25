import { createDokployClient } from "@xantiagoma/dokploy-api";
import type { DokployClient } from "@xantiagoma/dokploy-api";

let cachedClient: DokployClient | undefined;

export function getClient(): DokployClient {
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

export function diffProps(
  olds: Record<string, unknown>,
  news: Record<string, unknown>,
  replaceKeys: string[] = [],
): { changes: boolean; replaces: string[] } {
  const replaces: string[] = [];
  let changes = false;

  for (const key of Object.keys(news)) {
    if (olds[key] !== news[key]) {
      changes = true;
      if (replaceKeys.includes(key)) {
        replaces.push(key);
      }
    }
  }

  return { changes, replaces };
}
