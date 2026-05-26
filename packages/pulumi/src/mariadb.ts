import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface MariadbProviderInputs {
  name: string;
  environmentId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  description?: string;
  dockerImage?: string;
  databaseRootPassword?: string;
}

const mariadbProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: MariadbProviderInputs) {
    const client = getClient();

    // Adopt existing mariadb by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.mariadb.find((p) => p.name === inputs.name);

    if (existing) {
      await client.mariadb.update({
        mariadbId: existing.mariadbId,
        name: inputs.name,
        databaseName: inputs.databaseName,
        databaseUser: inputs.databaseUser,
        databasePassword: inputs.databasePassword,
        databaseRootPassword: inputs.databaseRootPassword,
        description: inputs.description,
        dockerImage: inputs.dockerImage,
      });

      return {
        id: existing.mariadbId,
        outs: { ...inputs, mariadbId: existing.mariadbId, appName: existing.appName, externalPort: existing.externalPort },
      };
    }

    const db = await client.mariadb.create({
      name: inputs.name,
      environmentId: inputs.environmentId,
      databaseName: inputs.databaseName,
      databaseUser: inputs.databaseUser,
      databasePassword: inputs.databasePassword,
      description: inputs.description,
      dockerImage: inputs.dockerImage,
      databaseRootPassword: inputs.databaseRootPassword,
    });

    return {
      id: db.mariadbId,
      outs: { ...inputs, mariadbId: db.mariadbId, appName: db.appName, externalPort: db.externalPort },
    };
  },

  async read(id: string, props: MariadbProviderInputs) {
    const client = getClient();
    try {
      const db = await client.mariadb.one({ mariadbId: id });
      return {
        id,
        props: {
          name: db.name,
          environmentId: db.environmentId,
          databaseName: db.databaseName,
          databaseUser: db.databaseUser,
          databasePassword: db.databasePassword,
          description: db.description ?? undefined,
          dockerImage: db.dockerImage ?? undefined,
          databaseRootPassword: db.databaseRootPassword ?? undefined,
          mariadbId: db.mariadbId,
          appName: db.appName,
          externalPort: db.externalPort ?? undefined,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: MariadbProviderInputs) {
    const client = getClient();
    await client.mariadb.update({
      mariadbId: id,
      name: news.name,
      databaseName: news.databaseName,
      databaseUser: news.databaseUser,
      databasePassword: news.databasePassword,
      description: news.description,
      dockerImage: news.dockerImage,
      databaseRootPassword: news.databaseRootPassword,
    });

    await client.mariadb.deploy({ mariadbId: id });

    return {
      outs: { ...news, mariadbId: id, appName: olds["appName"] as string, externalPort: olds["externalPort"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.mariadb.remove({ mariadbId: id });
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
 * Arguments for creating a {@link Mariadb} resource.
 *
 * @example
 * ```ts
 * const db = new dokploy.Mariadb("app-db", {
 *   name: "app-db",
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 * ```
 */
export interface MariadbArgs {
  /** Service name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Environment ID (required — get from project.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Name of the database to create */
  databaseName: pulumi.Input<string>;
  /** Database user */
  databaseUser: pulumi.Input<string>;
  /** Database password */
  databasePassword: pulumi.Input<string>;
  /** Optional service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: mariadb:6) */
  dockerImage?: pulumi.Input<string>;
  /** MariaDB root password */
  databaseRootPassword?: pulumi.Input<string>;
}

/**
 * A MariaDB database managed by Dokploy.
 *
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const db = new dokploy.Mariadb("app-db", {
 *   name: "app-db",
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 *
 * export const mariadbId = db.mariadbId;
 * ```
 */
export class Mariadb extends pulumi.dynamic.Resource {
  /** The Dokploy MariaDB service ID */
  declare public readonly mariadbId: pulumi.Output<string>;
  /** Docker internal hostname for this service */
  declare public readonly appName: pulumi.Output<string>;
  /** External port exposed to the internet (null if not enabled) */
  declare public readonly externalPort: pulumi.Output<number | undefined>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly environmentId: pulumi.Output<string>;
  declare public readonly databaseName: pulumi.Output<string>;
  declare public readonly databaseUser: pulumi.Output<string>;
  declare public readonly databasePassword: pulumi.Output<string>;
  declare public readonly description: pulumi.Output<string | undefined>;
  declare public readonly dockerImage: pulumi.Output<string | undefined>;
  declare public readonly databaseRootPassword: pulumi.Output<string | undefined>;

  constructor(name: string, args: MariadbArgs, opts?: pulumi.CustomResourceOptions) {
    super(mariadbProvider, name, { mariadbId: undefined, appName: undefined, externalPort: undefined, ...args }, opts);
  }
}
