import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";
import type { ComposeSourceType } from "@xantiagoma/dokploy-api";

interface ComposeProviderInputs {
  name: string;
  projectId: string;
  environmentId?: string;
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

const composeProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ComposeProviderInputs) {
    const client = getClient();

    const compose = await client.compose.create({
      name: inputs.name,
      projectId: inputs.projectId,
      environmentId: inputs.environmentId,
      description: inputs.description,
    });

    const updatePayload: Record<string, unknown> = {
      composeId: compose.composeId,
    };

    const updateFields = [
      "env",
      "composeFile",
      "composePath",
      "sourceType",
      "repository",
      "owner",
      "branch",
      "autoDeploy",
      "githubId",
      "customGitUrl",
      "customGitBranch",
      "customGitSSHKeyId",
    ] as const;

    for (const field of updateFields) {
      if (inputs[field] !== undefined) {
        updatePayload[field] = inputs[field];
      }
    }

    if (Object.keys(updatePayload).length > 1) {
      await client.compose.update(
        updatePayload as unknown as Parameters<typeof client.compose.update>[0],
      );
    }

    return {
      id: compose.composeId,
      outs: {
        ...inputs,
        composeId: compose.composeId,
      },
    };
  },

  async read(id: string, props: ComposeProviderInputs) {
    const client = getClient();
    try {
      const compose = await client.compose.one({ composeId: id });
      return {
        id,
        props: {
          name: compose.name,
          projectId: compose.projectId,
          environmentId: compose.environmentId ?? undefined,
          description: compose.description ?? undefined,
          env: compose.env ?? undefined,
          composeFile: compose.composeFile ?? undefined,
          composePath: compose.composePath ?? undefined,
          sourceType: compose.sourceType,
          repository: compose.repository ?? undefined,
          owner: compose.owner ?? undefined,
          branch: compose.branch ?? undefined,
          autoDeploy: compose.autoDeploy,
          githubId: compose.githubId ?? undefined,
          composeId: compose.composeId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(
    id: string,
    _olds: ComposeProviderInputs,
    news: ComposeProviderInputs,
  ) {
    const client = getClient();

    const updatePayload: Record<string, unknown> = { composeId: id };

    const updateFields = [
      "name",
      "description",
      "env",
      "composeFile",
      "composePath",
      "sourceType",
      "repository",
      "owner",
      "branch",
      "autoDeploy",
      "githubId",
      "customGitUrl",
      "customGitBranch",
      "customGitSSHKeyId",
    ] as const;

    for (const field of updateFields) {
      if (news[field] !== undefined) {
        updatePayload[field] = news[field];
      }
    }

    await client.compose.update(
      updatePayload as unknown as Parameters<typeof client.compose.update>[0],
    );

    return {
      outs: {
        ...news,
        composeId: id,
      },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.compose.delete({ composeId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(
    _id: string,
    olds: Record<string, unknown>,
    news: Record<string, unknown>,
  ) {
    const { changes, replaces } = diffProps(olds, news, [
      "projectId",
      "environmentId",
    ]);
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
 *   projectId: project.projectId,
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
  /** Project ID this service belongs to */
  projectId: pulumi.Input<string>;
  /** Environment ID (defaults to the project's production environment) */
  environmentId?: pulumi.Input<string>;
  /** Optional service description */
  description?: pulumi.Input<string>;
  /** Newline-separated `KEY=value` env vars */
  env?: pulumi.Input<string>;
  /** Raw docker-compose YAML (for `sourceType: "raw"`) */
  composeFile?: pulumi.Input<string>;
  /** Path to docker-compose file in the repo */
  composePath?: pulumi.Input<string>;
  /** Source type: `"github"`, `"gitlab"`, `"bitbucket"`, `"raw"`, or `"git"` */
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
 * Changing `projectId` or `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const server = new dokploy.Compose("server", {
 *   name: "server",
 *   projectId: project.projectId,
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
  public readonly composeId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly projectId!: pulumi.Output<string>;
  public readonly environmentId!: pulumi.Output<string | undefined>;
  public readonly description!: pulumi.Output<string | undefined>;
  public readonly env!: pulumi.Output<string | undefined>;
  public readonly composeFile!: pulumi.Output<string | undefined>;
  public readonly composePath!: pulumi.Output<string | undefined>;
  public readonly sourceType!: pulumi.Output<ComposeSourceType | undefined>;
  public readonly repository!: pulumi.Output<string | undefined>;
  public readonly owner!: pulumi.Output<string | undefined>;
  public readonly branch!: pulumi.Output<string | undefined>;
  public readonly autoDeploy!: pulumi.Output<boolean | undefined>;
  public readonly githubId!: pulumi.Output<string | undefined>;

  constructor(
    name: string,
    args: ComposeArgs,
    opts?: pulumi.CustomResourceOptions,
  ) {
    super(
      composeProvider,
      name,
      {
        composeId: undefined,
        ...args,
      },
      opts,
    );
  }
}
