/**
 * Configuration options for creating a Dokploy API client.
 *
 * @example
 * ```ts
 * const client = createDokployClient({
 *   endpoint: "https://dokploy.example.com",
 *   apiKey: process.env.DOKPLOY_API_KEY!,
 * });
 * ```
 */
export interface DokployClientOptions {
  /** Dokploy instance URL (e.g. `https://dokploy.example.com` or `http://localhost:3000`) */
  endpoint: string;
  /** API key generated from Dokploy Dashboard → Settings → Profile → API/CLI */
  apiKey: string;
}

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

/** A Dokploy project — top-level container for environments and services. */
export interface Project {
  projectId: string;
  name: string;
  description: string | null;
  /** Newline-separated `KEY=value` env vars shared across the project */
  env: string | null;
  createdAt: string;
}

/** Input for {@link DokployClient.project.create}. */
export interface CreateProjectInput {
  name: string;
  description?: string;
  env?: string;
}

/** Input for {@link DokployClient.project.update}. */
export interface UpdateProjectInput {
  projectId: string;
  name?: string;
  description?: string;
  env?: string;
}

/**
 * Result of {@link DokployClient.project.create}.
 *
 * Dokploy auto-creates a production environment when a project is created.
 */
export interface CreateProjectResult {
  project: Project;
  environment: Environment;
}

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

/** A named environment within a project (e.g. "production", "staging"). */
export interface Environment {
  environmentId: string;
  name: string;
  projectId: string;
  description: string | null;
  createdAt: string;
}

/** Input for {@link DokployClient.environment.create}. */
export interface CreateEnvironmentInput {
  name: string;
  projectId: string;
  description?: string;
}

/** Input for {@link DokployClient.environment.update}. */
export interface UpdateEnvironmentInput {
  environmentId: string;
  name?: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Compose
// ---------------------------------------------------------------------------

/** Where the docker-compose file comes from. */
export type ComposeSourceType = "github" | "gitlab" | "bitbucket" | "raw" | "git";

/** A Docker Compose service managed by Dokploy. */
export interface Compose {
  composeId: string;
  name: string;
  description: string | null;
  /** Newline-separated `KEY=value` env vars injected into the service */
  env: string | null;
  /** Raw docker-compose YAML content (when `sourceType` is `"raw"`) */
  composeFile: string;
  /** Path to docker-compose file in the repo (when using a git source) */
  composePath: string;
  composeStatus: string;
  sourceType: ComposeSourceType;
  /** GitHub repository name */
  repository: string | null;
  /** GitHub repository owner */
  owner: string | null;
  /** Git branch to track */
  branch: string | null;
  /** Whether pushes to the tracked branch trigger automatic deploys */
  autoDeploy: boolean;
  /** Dokploy GitHub App installation ID */
  githubId: string | null;
  gitlabId: string | null;
  bitbucketId: string | null;
  projectId: string;
  environmentId: string | null;
  serverId: string | null;
  createdAt: string;
}

/** Input for {@link DokployClient.compose.create}. */
export interface CreateComposeInput {
  name: string;
  projectId?: string;
  environmentId?: string;
  description?: string;
}

/**
 * Input for {@link DokployClient.compose.update}.
 *
 * Only provided fields are updated — omitted fields are left unchanged.
 */
export interface UpdateComposeInput {
  composeId: string;
  name?: string;
  description?: string;
  env?: string;
  composeFile?: string;
  composePath?: string;
  sourceType?: ComposeSourceType;
  repository?: string;
  owner?: string;
  branch?: string;
  autoDeploy?: boolean;
  githubId?: string;
  gitlabId?: string;
  bitbucketId?: string;
  customGitUrl?: string;
  customGitBranch?: string;
  customGitSSHKeyId?: string;
}

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------

/** SSL certificate strategy for a domain. */
export type CertificateType = "letsencrypt" | "none";

/** A domain routing rule attached to an application or compose service. */
export interface Domain {
  domainId: string;
  /** Hostname (e.g. `"app.example.com"`) */
  host: string;
  /** URL path prefix (e.g. `"/"`) */
  path: string | null;
  /** Container port to route to */
  port: number | null;
  /** Whether HTTPS is enabled */
  https: boolean;
  certificateType: CertificateType;
  /** Docker Compose service name to route to (required for compose services) */
  serviceName: string | null;
  domainType: string | null;
  uniqueConfigKey: number;
  applicationId: string | null;
  composeId: string | null;
  createdAt: string;
}

/** Input for {@link DokployClient.domain.create}. */
export interface CreateDomainInput {
  host: string;
  path?: string;
  port?: number;
  https?: boolean;
  certificateType?: CertificateType;
  serviceName?: string;
  domainType?: string;
  applicationId?: string;
  composeId?: string;
}

/** Input for {@link DokployClient.domain.update}. */
export interface UpdateDomainInput {
  domainId: string;
  host?: string;
  path?: string;
  port?: number;
  https?: boolean;
  certificateType?: CertificateType;
  serviceName?: string;
  domainType?: string;
}
