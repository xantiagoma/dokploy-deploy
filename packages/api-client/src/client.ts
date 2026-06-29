/**
 * AUTO-GENERATED — do not edit manually.
 * Run: bun scripts/generate.ts
 */
import createClient from "openapi-fetch";
import type { paths } from "./generated.ts";
import { DokployClient } from "./generated-routers.ts";
import type { Transport } from "./generated-routers.ts";

export { DokployClient } from "./generated-routers.ts";

export interface DokployClientOptions {
    /** Dokploy instance URL (e.g. `https://dokploy.example.com`) */
    endpoint: string;
    /** API key from Dashboard > Settings > Profile > API/CLI */
    apiKey: string;
}

export class DokployApiError extends Error {
    constructor(public procedure: string, public status: number, public body: string) {
        super(`Dokploy API error [${procedure}] (${status}): ${body}`);
        this.name = "DokployApiError";
    }
}

class TrpcFetcher implements Transport {
    public readonly api: ReturnType<typeof createClient<paths>>;
    private baseUrl: string;

    constructor(endpoint: string, private apiKey: string) {
        this.baseUrl = endpoint.replace(/\/api\/?$/, "") + "/api";
        this.api = createClient<paths>({ baseUrl: this.baseUrl, headers: { "x-api-key": apiKey } });
    }

    async query<T>(procedure: string, input?: object): Promise<T> {
        let url = `${this.baseUrl}/trpc/${procedure}`;
        if (input) { const encoded = encodeURIComponent(JSON.stringify({ json: input })); url += `?input=${encoded}`; }

        const res = await fetch(url, { headers: { "x-api-key": this.apiKey, "Content-Type": "application/json" } });
        if (!res.ok) { const body = await res.text(); throw new DokployApiError(procedure, res.status, body); }

        const text = await res.text();
        if (!text) return undefined as T;
        const data = JSON.parse(text) as { result: { data: { json: T } } };
        return data.result.data.json;
    }

    async mutate<T>(procedure: string, input: object): Promise<T> {
        const url = `${this.baseUrl}/${procedure}`;
        const res = await fetch(url, { method: "POST", headers: { "x-api-key": this.apiKey, "Content-Type": "application/json" }, body: JSON.stringify(input) });
        if (!res.ok) { const body = await res.text(); throw new DokployApiError(procedure, res.status, body); }

        const text = await res.text();
        if (!text) return undefined as T;
        return JSON.parse(text) as T;
    }
}

export class DokployClientWithRaw extends DokployClient {
    public readonly raw: ReturnType<typeof createClient<paths>>;

    constructor(options: DokployClientOptions) {
        const transport = new TrpcFetcher(options.endpoint, options.apiKey);
        super(transport);
        this.raw = transport.api;
    }
}

export function createDokployClient(options: DokployClientOptions): DokployClientWithRaw {
    return new DokployClientWithRaw(options);
}
