import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface ProjectProviderInputs {
  name: string;
  description?: string;
  env?: string;
}

const projectProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ProjectProviderInputs) {
    const client = getClient();
    const result = await client.project.create({
      name: inputs.name,
      description: inputs.description,
      env: inputs.env,
    });

    return {
      id: result.project.projectId,
      outs: {
        ...inputs,
        projectId: result.project.projectId,
        productionEnvironmentId: result.environment.environmentId,
      },
    };
  },

  async read(id: string, props: ProjectProviderInputs) {
    const client = getClient();
    try {
      const project = await client.project.one({ projectId: id });
      const envs = await client.environment.byProjectId({ projectId: id });
      const productionEnv =
        envs.find((e) => e.name === "Production") ?? envs[0];

      return {
        id,
        props: {
          name: project.name,
          description: project.description ?? undefined,
          env: project.env ?? undefined,
          projectId: project.projectId,
          productionEnvironmentId: productionEnv?.environmentId ?? "",
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(
    id: string,
    _olds: ProjectProviderInputs,
    news: ProjectProviderInputs,
  ) {
    const client = getClient();
    await client.project.update({
      projectId: id,
      name: news.name,
      description: news.description,
      env: news.env,
    });

    const envs = await client.environment.byProjectId({ projectId: id });
    const productionEnv = envs.find((e) => e.name === "Production") ?? envs[0];

    return {
      outs: {
        ...news,
        projectId: id,
        productionEnvironmentId: productionEnv?.environmentId ?? "",
      },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.project.remove({ projectId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(
    _id: string,
    olds: Record<string, unknown>,
    news: Record<string, unknown>,
  ) {
    const { changes, replaces } = diffProps(olds, news);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Project} resource.
 *
 * @example
 * ```ts
 * const project = new dokploy.Project("my-project", {
 *   name: "my-app",
 *   description: "Production infrastructure",
 * });
 * ```
 */
export interface ProjectArgs {
  /** Project name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Optional project description */
  description?: pulumi.Input<string>;
  /** Newline-separated `KEY=value` env vars shared across all services */
  env?: pulumi.Input<string>;
}

/**
 * A Dokploy project — the top-level container for environments and services.
 *
 * Dokploy auto-creates a production environment when a project is created.
 * Access it via {@link productionEnvironmentId}.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const project = new dokploy.Project("demi", {
 *   name: "demi",
 *   description: "demi.casa infrastructure",
 * });
 *
 * // Use the auto-created production environment
 * const compose = new dokploy.Compose("server", {
 *   projectId: project.projectId,
 *   environmentId: project.productionEnvironmentId,
 *   name: "server",
 *   // ...
 * });
 * ```
 */
export class Project extends pulumi.dynamic.Resource {
  /** The Dokploy project ID */
  public readonly projectId!: pulumi.Output<string>;
  /** The auto-created production environment ID */
  public readonly productionEnvironmentId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly description!: pulumi.Output<string | undefined>;
  public readonly env!: pulumi.Output<string | undefined>;

  constructor(
    name: string,
    args: ProjectArgs,
    opts?: pulumi.CustomResourceOptions,
  ) {
    super(
      projectProvider,
      name,
      {
        projectId: undefined,
        productionEnvironmentId: undefined,
        ...args,
      },
      opts,
    );
  }
}
