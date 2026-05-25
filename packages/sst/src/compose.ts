import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";
import type { ComposeSourceType, CertificateType } from "@xantiagoma/dokploy-api";
import { envToString } from "./utils.ts";

/**
 * Arguments for the {@link DokployCompose} component.
 *
 * @example
 * ```ts
 * new DokployCompose("server", {
 *   environmentId: project.productionEnvironmentId,
 *   composePath: "./docker-compose-server.yml",
 *   github: { owner: "xantiagoma", repo: "demi-casa" },
 *   env: { NODE_ENV: "production", DATABASE_URL: "${{project.DATABASE_URL}}" },
 *   autoDeploy: true,
 *   domains: [{ host: "api.demi.casa", serviceName: "server", port: 3000 }],
 * });
 * ```
 */
export interface DokployComposeArgs {
  /** Environment ID (required — get from DokployProject.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Compose service name (defaults to the Pulumi resource name) */
  composeName?: pulumi.Input<string>;
  /** Service description */
  description?: pulumi.Input<string>;
  /** Environment variables — accepts an object `{ KEY: "value" }` or a raw `"KEY=value"` string */
  env?: pulumi.Input<Record<string, string>> | pulumi.Input<string>;
  /** Path to docker-compose file in the repo (for GitHub source) */
  composePath?: pulumi.Input<string>;
  /** Raw docker-compose YAML content (for raw source) */
  composeFile?: pulumi.Input<string>;
  /** GitHub repository configuration — automatically sets `sourceType` to `"github"` */
  github?: {
    owner: pulumi.Input<string>;
    repo: pulumi.Input<string>;
    branch?: pulumi.Input<string>;
    githubId?: pulumi.Input<string>;
  };
  /** Custom git URL (sets `sourceType` to `"git"`) */
  customGitUrl?: pulumi.Input<string>;
  /** Custom git branch (for custom git source) */
  customGitBranch?: pulumi.Input<string>;
  /** SSH key ID for custom git auth */
  customGitSSHKeyId?: pulumi.Input<string>;
  /** Auto-deploy on push to the tracked branch */
  autoDeploy?: pulumi.Input<boolean>;
  /** Domain routing rules to attach to this service */
  domains?: DokployComposeDomainArgs[];
}

/** Domain configuration for a compose service. */
export interface DokployComposeDomainArgs {
  /** Hostname (e.g. `"app.example.com"`) */
  host: pulumi.Input<string>;
  /** Docker Compose service name to route to */
  serviceName?: pulumi.Input<string>;
  /** Container port */
  port?: pulumi.Input<number>;
  /** Enable HTTPS (default: `true`) */
  https?: pulumi.Input<boolean>;
  /** URL path prefix */
  path?: pulumi.Input<string>;
  /** SSL strategy (default: `"letsencrypt"`) */
  certificateType?: pulumi.Input<CertificateType>;
}

function detectSourceType(args: DokployComposeArgs): ComposeSourceType {
  if (args.github) return "github";
  if (args.customGitUrl) return "git";
  return "raw";
}

/**
 * High-level component that creates a Dokploy Compose service with optional domains.
 *
 * Automatically detects the source type from the provided configuration:
 * - `github` → `"github"`
 * - `customGitUrl` → `"git"`
 * - neither → `"raw"`
 *
 * @example
 * ```ts
 * import { DokployCompose } from "@xantiagoma/dokploy-sst";
 *
 * new DokployCompose("server", {
 *   environmentId: project.productionEnvironmentId,
 *   composePath: "./docker-compose-server.yml",
 *   github: { owner: "xantiagoma", repo: "demi-casa", branch: "main" },
 *   env: { NODE_ENV: "production" },
 *   autoDeploy: true,
 *   domains: [
 *     { host: "api.demi.casa", serviceName: "server", port: 3000 },
 *   ],
 * });
 * ```
 */
export class DokployCompose extends pulumi.ComponentResource {
  /** The underlying Compose resource */
  public readonly compose: dokploy.Compose;
  /** Domain resources attached to this service */
  public readonly domains: dokploy.Domain[];
  /** The Dokploy compose service ID */
  public readonly composeId: pulumi.Output<string>;

  constructor(name: string, args: DokployComposeArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployCompose", name, {}, opts);

    const sourceType = detectSourceType(args);

    const envStr = args.env
      ? pulumi.output(args.env).apply((e) => envToString(e))
      : undefined;

    this.compose = new dokploy.Compose(
      `${name}-compose`,
      {
        name: args.composeName ?? name,
        environmentId: args.environmentId,
        description: args.description,
        env: envStr,
        composePath: args.composePath,
        composeFile: args.composeFile,
        sourceType,
        owner: args.github?.owner,
        repository: args.github?.repo,
        branch: args.github?.branch ?? "main",
        autoDeploy: args.autoDeploy ?? false,
        githubId: args.github?.githubId,
        customGitUrl: args.customGitUrl,
        customGitBranch: args.customGitBranch,
        customGitSSHKeyId: args.customGitSSHKeyId,
      },
      { parent: this },
    );

    this.composeId = this.compose.composeId;

    this.domains = (args.domains ?? []).map(
      (d, i) =>
        new dokploy.Domain(
          `${name}-domain-${i}`,
          {
            host: d.host,
            serviceName: d.serviceName,
            port: d.port,
            https: d.https ?? true,
            path: d.path,
            certificateType: d.certificateType ?? "letsencrypt",
            domainType: "compose",
            composeId: this.compose.composeId,
          },
          { parent: this, dependsOn: [this.compose] },
        ),
    );

    this.registerOutputs({ composeId: this.composeId });
  }
}
