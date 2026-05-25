import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface MongoProviderInputs {
  name: string;
  environmentId: string;
  databaseUser: string;
  databasePassword: string;
  description?: string;
  dockerImage?: string;
  replicaSets?: boolean;
}

const mongoProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: MongoProviderInputs) {
    const client = getClient();

    // Adopt existing mongo by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.mongo.find((p) => p.name === inputs.name);

    if (existing) {
      await client.mongo.update({
        mongoId: existing.mongoId,
        name: inputs.name,
        databaseUser: inputs.databaseUser,
        databasePassword: inputs.databasePassword,
        description: inputs.description,
        dockerImage: inputs.dockerImage,
      });

      return {
        id: existing.mongoId,
        outs: { ...inputs, mongoId: existing.mongoId, appName: existing.appName, externalPort: existing.externalPort },
      };
    }

    const db = await client.mongo.create({
      name: inputs.name,
      environmentId: inputs.environmentId,
      databaseUser: inputs.databaseUser,
      databasePassword: inputs.databasePassword,
      description: inputs.description,
      dockerImage: inputs.dockerImage,
      replicaSets: inputs.replicaSets,
    });

    return {
      id: db.mongoId,
      outs: { ...inputs, mongoId: db.mongoId, appName: db.appName, externalPort: db.externalPort },
    };
  },

  async read(id: string, props: MongoProviderInputs) {
    const client = getClient();
    try {
      const db = await client.mongo.one({ mongoId: id });
      return {
        id,
        props: {
          name: db.name,
          environmentId: db.environmentId,
          databaseUser: db.databaseUser,
          databasePassword: db.databasePassword,
          description: db.description ?? undefined,
          dockerImage: db.dockerImage ?? undefined,
          replicaSets: db.replicaSets ?? undefined,
          mongoId: db.mongoId,
          appName: db.appName,
          externalPort: db.externalPort ?? undefined,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: MongoProviderInputs) {
    const client = getClient();
    await client.mongo.update({
      mongoId: id,
      name: news.name,
      databaseUser: news.databaseUser,
      databasePassword: news.databasePassword,
      description: news.description,
      dockerImage: news.dockerImage,
    });

    return {
      outs: { ...news, mongoId: id, appName: olds["appName"] as string, externalPort: olds["externalPort"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.mongo.remove({ mongoId: id });
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
 * Arguments for creating a {@link Mongo} resource.
 *
 * @example
 * ```ts
 * const db = new dokploy.Mongo("app-mongo", {
 *   name: "app-mongo",
 *   environmentId: project.productionEnvironmentId,
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 * ```
 */
export interface MongoArgs {
  /** Service name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Environment ID (required — get from project.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Database user */
  databaseUser: pulumi.Input<string>;
  /** Database password */
  databasePassword: pulumi.Input<string>;
  /** Optional service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: mongo:15) */
  dockerImage?: pulumi.Input<string>;
  /** Enable MongoDB replica sets */
  replicaSets?: pulumi.Input<boolean>;
}

/**
 * A MongoDB database managed by Dokploy.
 *
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const db = new dokploy.Mongo("app-mongo", {
 *   name: "app-mongo",
 *   environmentId: project.productionEnvironmentId,
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 *
 * export const mongoId = db.mongoId;
 * ```
 */
export class Mongo extends pulumi.dynamic.Resource {
  /** The Dokploy MongoDB service ID */
  declare public readonly mongoId: pulumi.Output<string>;
  /** Docker internal hostname for this service */
  declare public readonly appName: pulumi.Output<string>;
  /** External port exposed to the internet (null if not enabled) */
  declare public readonly externalPort: pulumi.Output<number | undefined>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly environmentId: pulumi.Output<string>;
  declare public readonly databaseUser: pulumi.Output<string>;
  declare public readonly databasePassword: pulumi.Output<string>;
  declare public readonly description: pulumi.Output<string | undefined>;
  declare public readonly dockerImage: pulumi.Output<string | undefined>;
  declare public readonly replicaSets: pulumi.Output<boolean | undefined>;

  constructor(name: string, args: MongoArgs, opts?: pulumi.CustomResourceOptions) {
    super(mongoProvider, name, { mongoId: undefined, appName: undefined, externalPort: undefined, ...args }, opts);
  }
}
