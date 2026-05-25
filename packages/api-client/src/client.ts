import type {
  DokployClientOptions,
  Project,
  CreateProjectInput,
  CreateProjectResult,
  UpdateProjectInput,
  Environment,
  CreateEnvironmentInput,
  UpdateEnvironmentInput,
  Compose,
  CreateComposeInput,
  UpdateComposeInput,
  Domain,
  CreateDomainInput,
  UpdateDomainInput,
} from "./types.ts";

/**
 * Low-level tRPC transport. Handles the two Dokploy API formats:
 * - **Queries** (GET): `/api/trpc/<procedure>?input=URL_ENCODED({"json":{...}})`
 * - **Mutations** (POST): `/api/<procedure>` with raw JSON body
 */
class TrpcClient {
  constructor(
    private endpoint: string,
    private apiKey: string,
  ) {}

  private get headers(): Record<string, string> {
    return {
      "x-api-key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  private get baseUrl(): string {
    const base = this.endpoint.replace(/\/api\/?$/, "");
    return `${base}/api`;
  }

  async query<T>(procedure: string, input?: object): Promise<T> {
    let url = `${this.baseUrl}/trpc/${procedure}`;
    if (input) {
      const encoded = encodeURIComponent(JSON.stringify({ json: input }));
      url += `?input=${encoded}`;
    }

    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      const body = await res.text();
      throw new DokployApiError(procedure, res.status, body);
    }

    const data = (await res.json()) as { result: { data: { json: T } } };
    return data.result.data.json;
  }

  async mutate<T>(procedure: string, input: object): Promise<T> {
    const url = `${this.baseUrl}/${procedure}`;

    const res = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new DokployApiError(procedure, res.status, body);
    }

    return (await res.json()) as T;
  }
}

/**
 * Error thrown when a Dokploy API call fails.
 *
 * @example
 * ```ts
 * try {
 *   await client.project.one({ projectId: "invalid" });
 * } catch (err) {
 *   if (err instanceof DokployApiError) {
 *     console.error(err.procedure, err.status, err.body);
 *   }
 * }
 * ```
 */
export class DokployApiError extends Error {
  constructor(
    /** The tRPC procedure that failed (e.g. `"project.one"`) */
    public procedure: string,
    /** HTTP status code */
    public status: number,
    /** Raw response body */
    public body: string,
  ) {
    super(`Dokploy API error [${procedure}] (${status}): ${body}`);
    this.name = "DokployApiError";
  }
}

// ---------------------------------------------------------------------------
// Router implementations
// ---------------------------------------------------------------------------

/** CRUD operations for Dokploy projects. */
class ProjectRouter {
  constructor(private trpc: TrpcClient) {}

  /** List all projects. */
  async all(): Promise<Project[]> {
    return this.trpc.query<Project[]>("project.all");
  }

  /** Get a single project by ID. */
  async one(input: { projectId: string }): Promise<Project> {
    return this.trpc.query<Project>("project.one", input);
  }

  /**
   * Create a new project. Dokploy auto-creates a production environment.
   *
   * @returns The created project and its auto-generated production environment.
   *
   * @example
   * ```ts
   * const { project, environment } = await client.project.create({
   *   name: "my-app",
   *   description: "My application",
   * });
   * console.log(project.projectId, environment.environmentId);
   * ```
   */
  async create(input: CreateProjectInput): Promise<CreateProjectResult> {
    return this.trpc.mutate<CreateProjectResult>("project.create", input);
  }

  /** Update a project's name, description, or environment variables. */
  async update(input: UpdateProjectInput): Promise<Project> {
    return this.trpc.mutate<Project>("project.update", input);
  }

  /** Delete a project and all its environments and services. */
  async remove(input: { projectId: string }): Promise<void> {
    await this.trpc.mutate<void>("project.remove", input);
  }
}

/** CRUD operations for project environments. */
class EnvironmentRouter {
  constructor(private trpc: TrpcClient) {}

  /** List all environments in a project. */
  async byProjectId(input: { projectId: string }): Promise<Environment[]> {
    return this.trpc.query<Environment[]>("environment.byProjectId", input);
  }

  /** Get a single environment by ID. */
  async one(input: { environmentId: string }): Promise<Environment> {
    return this.trpc.query<Environment>("environment.one", input);
  }

  /** Create a new environment in a project. */
  async create(input: CreateEnvironmentInput): Promise<Environment> {
    return this.trpc.mutate<Environment>("environment.create", input);
  }

  /** Update an environment's name or description. */
  async update(input: UpdateEnvironmentInput): Promise<Environment> {
    return this.trpc.mutate<Environment>("environment.update", input);
  }

  /** Delete an environment and all its services. */
  async remove(input: { environmentId: string }): Promise<void> {
    await this.trpc.mutate<void>("environment.remove", input);
  }
}

/** CRUD + lifecycle operations for Docker Compose services. */
class ComposeRouter {
  constructor(private trpc: TrpcClient) {}

  /** Get a single compose service by ID. */
  async one(input: { composeId: string }): Promise<Compose> {
    return this.trpc.query<Compose>("compose.one", input);
  }

  /**
   * Create a new compose service.
   *
   * @example
   * ```ts
   * const compose = await client.compose.create({
   *   name: "web",
   *   projectId: "proj_123",
   *   environmentId: "env_456",
   * });
   * ```
   */
  async create(input: CreateComposeInput): Promise<Compose> {
    return this.trpc.mutate<Compose>("compose.create", input);
  }

  /**
   * Update a compose service's configuration.
   *
   * @example
   * ```ts
   * await client.compose.update({
   *   composeId: "comp_789",
   *   sourceType: "github",
   *   owner: "myorg",
   *   repository: "myrepo",
   *   branch: "main",
   *   composePath: "./docker-compose.yml",
   *   autoDeploy: true,
   * });
   * ```
   */
  async update(input: UpdateComposeInput): Promise<Compose> {
    return this.trpc.mutate<Compose>("compose.update", input);
  }

  /** Trigger a deployment of the compose service. */
  async deploy(input: { composeId: string }): Promise<void> {
    await this.trpc.mutate<void>("compose.deploy", input);
  }

  /** Stop all containers in the compose service. */
  async stop(input: { composeId: string }): Promise<void> {
    await this.trpc.mutate<void>("compose.stop", input);
  }

  /** Start all containers in the compose service. */
  async start(input: { composeId: string }): Promise<void> {
    await this.trpc.mutate<void>("compose.start", input);
  }

  /** Delete the compose service entirely. */
  async delete(input: { composeId: string }): Promise<void> {
    await this.trpc.mutate<void>("compose.delete", input);
  }

  /** Redeploy the compose service (stop + deploy). */
  async redeploy(input: { composeId: string }): Promise<void> {
    await this.trpc.mutate<void>("compose.redeploy", input);
  }

  /** Fetch the resolved source type configuration. */
  async fetchSourceType(input: { composeId: string }): Promise<unknown> {
    return this.trpc.query<unknown>("compose.fetchSourceType", input);
  }
}

/** CRUD operations for domain routing rules. */
class DomainRouter {
  constructor(private trpc: TrpcClient) {}

  /** Get a single domain by ID. */
  async one(input: { domainId: string }): Promise<Domain> {
    return this.trpc.query<Domain>("domain.one", input);
  }

  /** List all domains attached to a compose service. */
  async byComposeId(input: { composeId: string }): Promise<Domain[]> {
    return this.trpc.query<Domain[]>("domain.byComposeId", input);
  }

  /** List all domains attached to an application. */
  async byApplicationId(input: { applicationId: string }): Promise<Domain[]> {
    return this.trpc.query<Domain[]>("domain.byApplicationId", input);
  }

  /**
   * Create a new domain routing rule.
   *
   * @example
   * ```ts
   * await client.domain.create({
   *   host: "app.example.com",
   *   composeId: "comp_789",
   *   serviceName: "web",
   *   port: 3000,
   *   https: true,
   *   certificateType: "letsencrypt",
   * });
   * ```
   */
  async create(input: CreateDomainInput): Promise<Domain> {
    return this.trpc.mutate<Domain>("domain.create", input);
  }

  /** Update a domain's host, port, SSL, or routing configuration. */
  async update(input: UpdateDomainInput): Promise<Domain> {
    return this.trpc.mutate<Domain>("domain.update", input);
  }

  /** Delete a domain routing rule. */
  async delete(input: { domainId: string }): Promise<void> {
    await this.trpc.mutate<void>("domain.delete", input);
  }
}

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

/**
 * Typed HTTP client for the Dokploy tRPC API.
 *
 * Provides access to project, environment, compose, and domain operations
 * through namespaced routers.
 *
 * @example
 * ```ts
 * import { createDokployClient } from "@xantiagoma/dokploy-api";
 *
 * const client = createDokployClient({
 *   endpoint: "https://dokploy.example.com",
 *   apiKey: process.env.DOKPLOY_API_KEY!,
 * });
 *
 * // List all projects
 * const projects = await client.project.all();
 *
 * // Deploy a compose service
 * await client.compose.deploy({ composeId: "comp_789" });
 * ```
 */
export class DokployClient {
  /** Project CRUD operations */
  public readonly project: ProjectRouter;
  /** Environment CRUD operations */
  public readonly environment: EnvironmentRouter;
  /** Compose service CRUD + lifecycle operations */
  public readonly compose: ComposeRouter;
  /** Domain routing CRUD operations */
  public readonly domain: DomainRouter;

  constructor(options: DokployClientOptions) {
    const trpc = new TrpcClient(options.endpoint, options.apiKey);
    this.project = new ProjectRouter(trpc);
    this.environment = new EnvironmentRouter(trpc);
    this.compose = new ComposeRouter(trpc);
    this.domain = new DomainRouter(trpc);
  }
}

/**
 * Create a new Dokploy API client.
 *
 * @example
 * ```ts
 * const client = createDokployClient({
 *   endpoint: "https://dokploy.example.com",
 *   apiKey: process.env.DOKPLOY_API_KEY!,
 * });
 * ```
 */
export function createDokployClient(options: DokployClientOptions): DokployClient {
  return new DokployClient(options);
}
