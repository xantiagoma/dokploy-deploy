import * as pulumi from "@pulumi/pulumi";
import type { ComposeSourceType } from "@xantiagoma/dokploy-api";
import { getClient, diffProps } from "./provider-utils.ts";

type ComposeUpdateInput = Parameters<ReturnType<typeof getClient>["compose"]["update"]>[0];

interface ComposeProviderInputs {
  name: string;
  environmentId: string;
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
  customGitUrl?: string;
  customGitBranch?: string;
  customGitSSHKeyId?: string;
}

const UPDATE_FIELDS = [
  "env", "composeFile", "composePath", "sourceType",
  "repository", "owner", "branch", "autoDeploy", "githubId",
  "customGitUrl", "customGitBranch", "customGitSSHKeyId",
] as const;

function buildUpdatePayload(base: Pick<ComposeUpdateInput, "composeId" | "name" | "description">, inputs: ComposeProviderInputs): ComposeUpdateInput {
  const payload = { ...base } as ComposeUpdateInput;
  for (const field of UPDATE_FIELDS) {
    if (inputs[field] !== undefined) {
      (payload as Record<string, unknown>)[field] = inputs[field];
    }
  }
  return payload;
}

const composeProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ComposeProviderInputs) {
    const client = getClient();

    // Adopt existing compose service by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.compose.find((c) => c.name === inputs.name);

    if (existing) {
      const updatePayload = buildUpdatePayload({ composeId: existing.composeId, name: inputs.name, description: inputs.description }, inputs);
      await client.compose.update(updatePayload);

      return {
        id: existing.composeId,
        outs: { ...inputs, composeId: existing.composeId, appName: existing.appName },
      };
    }

    const compose = await client.compose.create({
      name: inputs.name,
      environmentId: inputs.environmentId,
      description: inputs.description,
    });

    // compose.create only accepts a few fields — apply the rest via update
    const updatePayload = buildUpdatePayload({ composeId: compose.composeId }, inputs);
    if (Object.keys(updatePayload).length > 1) {
      await client.compose.update(updatePayload);
    }

    return {
      id: compose.composeId,
      outs: { ...inputs, composeId: compose.composeId, appName: compose.appName },
    };
  },

  async read(id: string, props: ComposeProviderInputs) {
    const client = getClient();
    try {
      const c = await client.compose.one({ composeId: id });
      return {
        id,
        props: {
          name: c.name,
          environmentId: c.environmentId,
          description: c.description ?? undefined,
          env: c.env ?? undefined,
          composeFile: c.composeFile ?? undefined,
          composePath: c.composePath ?? undefined,
          sourceType: c.sourceType as ComposeSourceType,
          repository: c.repository ?? undefined,
          owner: c.owner ?? undefined,
          branch: c.branch ?? undefined,
          autoDeploy: c.autoDeploy,
          githubId: c.githubId ?? undefined,
          composeId: c.composeId,
          appName: c.appName,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: ComposeProviderInputs) {
    const client = getClient();
    const updatePayload = buildUpdatePayload({ composeId: id, name: news.name, description: news.description }, news);
    await client.compose.update(updatePayload);

    // Deploy to apply the changes (env, compose file, etc.)
    await client.compose.deploy({ composeId: id });

    return {
      outs: { ...news, composeId: id, appName: olds["appName"] as string },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.compose.delete({ composeId: id, deleteVolumes: false });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Compose} resource.
 *
 * @example
 * ```ts
 * const server = new dokploy.Compose("server", {
 *   name: "server",
 *   environmentId: project.productionEnvironmentId,
 *   sourceType: "github",
 *   owner: "myorg",
 *   repository: "myrepo",
 *   branch: "main",
 *   composePath: "./docker-compose.yml",
 *   autoDeploy: true,
 *   env: "NODE_ENV=production",
 * });
 * ```
 */
export interface ComposeArgs {
  /** Service name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Environment ID (required — get from project.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Optional service description */
  description?: pulumi.Input<string>;
  /** Newline-separated `KEY=value` env vars */
  env?: pulumi.Input<string>;
  /** Raw docker-compose YAML (for `sourceType: "raw"`) */
  composeFile?: pulumi.Input<string>;
  /** Path to docker-compose file in the repo */
  composePath?: pulumi.Input<string>;
  /** Source type: `"github"`, `"gitlab"`, `"bitbucket"`, `"gitea"`, `"raw"`, or `"git"` */
  sourceType?: pulumi.Input<ComposeSourceType>;
  /** GitHub repository name */
  repository?: pulumi.Input<string>;
  /** GitHub repository owner */
  owner?: pulumi.Input<string>;
  /** Git branch to track */
  branch?: pulumi.Input<string>;
  /** Auto-deploy on push to the tracked branch */
  autoDeploy?: pulumi.Input<boolean>;
  /** Dokploy GitHub App installation ID */
  githubId?: pulumi.Input<string>;
  /** Custom git clone URL */
  customGitUrl?: pulumi.Input<string>;
  /** Custom git branch */
  customGitBranch?: pulumi.Input<string>;
  /** SSH key ID for custom git auth */
  customGitSSHKeyId?: pulumi.Input<string>;
}

/**
 * A Docker Compose service managed by Dokploy.
 *
 * Supports GitHub, GitLab, Bitbucket, custom git, and raw compose file sources.
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const server = new dokploy.Compose("server", {
 *   name: "server",
 *   environmentId: project.productionEnvironmentId,
 *   sourceType: "github",
 *   owner: "xantiagoma",
 *   repository: "demi-casa",
 *   branch: "main",
 *   composePath: "./docker-compose-server.yml",
 *   autoDeploy: true,
 *   env: "NODE_ENV=production\nDATABASE_URL=${{project.DATABASE_URL}}",
 * });
 * ```
 */
export class Compose extends pulumi.dynamic.Resource {
  /** The Dokploy compose service ID */
  declare public readonly composeId: pulumi.Output<string>;
  /** Docker internal hostname for this service */
  declare public readonly appName: pulumi.Output<string>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly environmentId: pulumi.Output<string>;
  declare public readonly description: pulumi.Output<string | undefined>;
  declare public readonly env: pulumi.Output<string | undefined>;
  declare public readonly composeFile: pulumi.Output<string | undefined>;
  declare public readonly composePath: pulumi.Output<string | undefined>;
  declare public readonly sourceType: pulumi.Output<ComposeSourceType | undefined>;
  declare public readonly repository: pulumi.Output<string | undefined>;
  declare public readonly owner: pulumi.Output<string | undefined>;
  declare public readonly branch: pulumi.Output<string | undefined>;
  declare public readonly autoDeploy: pulumi.Output<boolean | undefined>;
  declare public readonly githubId: pulumi.Output<string | undefined>;

  constructor(name: string, args: ComposeArgs, opts?: pulumi.CustomResourceOptions) {
    super(composeProvider, name, { composeId: undefined, appName: undefined, ...args }, opts);
  }
}
