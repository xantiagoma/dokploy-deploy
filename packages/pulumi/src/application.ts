import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface ApplicationProviderInputs {
  name: string;
  environmentId: string;
  description?: string;
  appName?: string;
  serverId?: string;
}

const applicationProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ApplicationProviderInputs) {
    const client = getClient();

    // Adopt existing application by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.applications.find((a) => a.name === inputs.name);

    if (existing) {
      await client.application.update({
        applicationId: existing.applicationId,
        name: inputs.name,
        description: inputs.description ?? null,
      });

      return {
        id: existing.applicationId,
        outs: { ...inputs, applicationId: existing.applicationId, appName: existing.appName },
      };
    }

    const result = await client.application.create({
      name: inputs.name,
      environmentId: inputs.environmentId,
      description: inputs.description ?? null,
      appName: inputs.appName,
      serverId: inputs.serverId ?? null,
    });

    return {
      id: result.applicationId,
      outs: { ...inputs, applicationId: result.applicationId, appName: result.appName },
    };
  },

  async read(id: string, props: ApplicationProviderInputs) {
    const client = getClient();
    try {
      const a = await client.application.one({ applicationId: id });
      return {
        id,
        props: {
          name: a.name,
          environmentId: a.environmentId,
          description: a.description ?? undefined,
          appName: a.appName ?? undefined,
          serverId: a.serverId ?? undefined,
          applicationId: a.applicationId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: ApplicationProviderInputs, news: ApplicationProviderInputs) {
    const client = getClient();
    await client.application.update({
      applicationId: id,
      name: news.name,
      description: news.description ?? null,
      appName: news.appName,
    });

    return {
      outs: { ...news, applicationId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.application.delete({ applicationId: id });
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
 * Arguments for creating an {@link Application} resource.
 *
 * @example
 * ```ts
 * const app = new dokploy.Application("api", {
 *   name: "api",
 *   environmentId: project.productionEnvironmentId,
 *   description: "API service",
 * });
 * ```
 */
export interface ApplicationArgs {
  /** Application name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Environment ID (replacement trigger) */
  environmentId: pulumi.Input<string>;
  /** Optional application description */
  description?: pulumi.Input<string>;
  /** Optional custom app name (used for container naming) */
  appName?: pulumi.Input<string>;
  /** Optional server ID to deploy on a specific server */
  serverId?: pulumi.Input<string>;
}

/**
 * A Dokploy application service.
 *
 * Applications are single-container services (as opposed to Docker Compose stacks).
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const app = new dokploy.Application("api", {
 *   name: "api",
 *   environmentId: project.productionEnvironmentId,
 *   description: "API service",
 * });
 *
 * const domain = new dokploy.Domain("api-domain", {
 *   host: "api.example.com",
 *   applicationId: app.applicationId,
 *   port: 3000,
 *   https: true,
 *   certificateType: "letsencrypt",
 * });
 * ```
 */
export class Application extends pulumi.dynamic.Resource {
  /** The Dokploy application ID */
  public readonly applicationId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly environmentId!: pulumi.Output<string>;
  public readonly description!: pulumi.Output<string | undefined>;
  public readonly appName!: pulumi.Output<string | undefined>;
  public readonly serverId!: pulumi.Output<string | undefined>;

  constructor(name: string, args: ApplicationArgs, opts?: pulumi.CustomResourceOptions) {
    super(applicationProvider, name, { applicationId: undefined, ...args }, opts);
  }
}
