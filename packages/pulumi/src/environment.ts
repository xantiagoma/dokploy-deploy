import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface EnvironmentProviderInputs {
  name: string;
  projectId: string;
  description?: string;
}

const environmentProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: EnvironmentProviderInputs) {
    const client = getClient();

    const result = await client.environment.create({
      name: inputs.name,
      projectId: inputs.projectId,
      description: inputs.description,
    });

    return {
      id: result.environmentId,
      outs: { ...inputs, environmentId: result.environmentId },
    };
  },

  async read(id: string, props: EnvironmentProviderInputs) {
    const client = getClient();
    try {
      const e = await client.environment.one({ environmentId: id });
      return {
        id,
        props: {
          name: e.name,
          projectId: e.projectId,
          description: e.description ?? undefined,
          environmentId: e.environmentId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: EnvironmentProviderInputs, news: EnvironmentProviderInputs) {
    const client = getClient();
    await client.environment.update({
      environmentId: id,
      name: news.name,
      description: news.description,
    });

    return {
      outs: { ...news, environmentId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.environment.remove({ environmentId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["projectId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating an {@link Environment} resource.
 *
 * @example
 * ```ts
 * const env = new dokploy.Environment("staging", {
 *   name: "staging",
 *   projectId: project.projectId,
 *   description: "Staging environment",
 * });
 * ```
 */
export interface EnvironmentArgs {
  /** Environment name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Project ID this environment belongs to (replacement trigger) */
  projectId: pulumi.Input<string>;
  /** Optional environment description */
  description?: pulumi.Input<string>;
}

/**
 * A Dokploy environment within a project.
 *
 * Environments group services together (e.g. staging, production).
 * Changing `projectId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const staging = new dokploy.Environment("staging", {
 *   name: "staging",
 *   projectId: project.projectId,
 *   description: "Staging environment",
 * });
 *
 * const compose = new dokploy.Compose("server-staging", {
 *   name: "server",
 *   environmentId: staging.environmentId,
 * });
 * ```
 */
export class Environment extends pulumi.dynamic.Resource {
  /** The Dokploy environment ID */
  public readonly environmentId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly projectId!: pulumi.Output<string>;
  public readonly description!: pulumi.Output<string | undefined>;

  constructor(name: string, args: EnvironmentArgs, opts?: pulumi.CustomResourceOptions) {
    super(environmentProvider, name, { environmentId: undefined, ...args }, opts);
  }
}
