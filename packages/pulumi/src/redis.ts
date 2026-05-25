import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface RedisProviderInputs {
  name: string;
  environmentId: string;
  databasePassword: string;
  description?: string;
  dockerImage?: string;
}

const redisProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: RedisProviderInputs) {
    const client = getClient();

    // Adopt existing redis by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.redis.find((r) => r.name === inputs.name);

    if (existing) {
      await client.redis.update({
        redisId: existing.redisId,
        name: inputs.name,
        databasePassword: inputs.databasePassword,
        description: inputs.description,
        dockerImage: inputs.dockerImage,
      });

      return {
        id: existing.redisId,
        outs: { ...inputs, redisId: existing.redisId, appName: existing.appName, externalPort: existing.externalPort },
      };
    }

    const db = await client.redis.create({
      name: inputs.name,
      environmentId: inputs.environmentId,
      databasePassword: inputs.databasePassword,
      description: inputs.description,
      dockerImage: inputs.dockerImage,
    });

    return {
      id: db.redisId,
      outs: { ...inputs, redisId: db.redisId, appName: db.appName, externalPort: db.externalPort },
    };
  },

  async read(id: string, props: RedisProviderInputs) {
    const client = getClient();
    try {
      const db = await client.redis.one({ redisId: id });
      return {
        id,
        props: {
          name: db.name,
          environmentId: db.environmentId,
          databasePassword: db.databasePassword,
          description: db.description ?? undefined,
          dockerImage: db.dockerImage ?? undefined,
          redisId: db.redisId,
          appName: db.appName,
          externalPort: db.externalPort ?? undefined,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: RedisProviderInputs) {
    const client = getClient();
    await client.redis.update({
      redisId: id,
      name: news.name,
      databasePassword: news.databasePassword,
      description: news.description,
      dockerImage: news.dockerImage,
    });

    return {
      outs: { ...news, redisId: id, appName: olds["appName"] as string, externalPort: olds["externalPort"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.redis.remove({ redisId: id });
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
 * Arguments for creating a {@link Redis} resource.
 *
 * @example
 * ```ts
 * const cache = new dokploy.Redis("app-cache", {
 *   name: "app-cache",
 *   environmentId: project.productionEnvironmentId,
 *   databasePassword: "supersecret",
 * });
 * ```
 */
export interface RedisArgs {
  /** Service name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Environment ID (required — get from project.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Redis password */
  databasePassword: pulumi.Input<string>;
  /** Optional service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: redis:8) */
  dockerImage?: pulumi.Input<string>;
}

/**
 * A Redis instance managed by Dokploy.
 *
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const cache = new dokploy.Redis("app-cache", {
 *   name: "app-cache",
 *   environmentId: project.productionEnvironmentId,
 *   databasePassword: "supersecret",
 * });
 *
 * export const redisId = cache.redisId;
 * ```
 */
export class Redis extends pulumi.dynamic.Resource {
  /** The Dokploy Redis service ID */
  declare public readonly redisId: pulumi.Output<string>;
  /** Docker internal hostname for this service */
  declare public readonly appName: pulumi.Output<string>;
  /** External port exposed to the internet (null if not enabled) */
  declare public readonly externalPort: pulumi.Output<number | undefined>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly environmentId: pulumi.Output<string>;
  declare public readonly databasePassword: pulumi.Output<string>;
  declare public readonly description: pulumi.Output<string | undefined>;
  declare public readonly dockerImage: pulumi.Output<string | undefined>;

  constructor(name: string, args: RedisArgs, opts?: pulumi.CustomResourceOptions) {
    super(redisProvider, name, { redisId: undefined, appName: undefined, externalPort: undefined, ...args }, opts);
  }
}
