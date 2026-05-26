import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface MysqlProviderInputs {
  name: string;
  environmentId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  description?: string;
  dockerImage?: string;
  databaseRootPassword?: string;
}

const mysqlProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: MysqlProviderInputs) {
    const client = getClient();

    // Adopt existing mysql by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.mysql.find((p) => p.name === inputs.name);

    if (existing) {
      await client.mysql.update({
        mysqlId: existing.mysqlId,
        name: inputs.name,
        databaseName: inputs.databaseName,
        databaseUser: inputs.databaseUser,
        databasePassword: inputs.databasePassword,
        databaseRootPassword: inputs.databaseRootPassword,
        description: inputs.description,
        dockerImage: inputs.dockerImage,
      });

      return {
        id: existing.mysqlId,
        outs: { ...inputs, mysqlId: existing.mysqlId, appName: existing.appName, externalPort: existing.externalPort },
      };
    }

    const db = await client.mysql.create({
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
      id: db.mysqlId,
      outs: { ...inputs, mysqlId: db.mysqlId, appName: db.appName, externalPort: db.externalPort },
    };
  },

  async read(id: string, props: MysqlProviderInputs) {
    const client = getClient();
    try {
      const db = await client.mysql.one({ mysqlId: id });
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
          mysqlId: db.mysqlId,
          appName: db.appName,
          externalPort: db.externalPort ?? undefined,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: MysqlProviderInputs) {
    const client = getClient();
    await client.mysql.update({
      mysqlId: id,
      name: news.name,
      databaseName: news.databaseName,
      databaseUser: news.databaseUser,
      databasePassword: news.databasePassword,
      description: news.description,
      dockerImage: news.dockerImage,
      databaseRootPassword: news.databaseRootPassword,
    });

    await client.mysql.deploy({ mysqlId: id });

    return {
      outs: { ...news, mysqlId: id, appName: olds["appName"] as string, externalPort: olds["externalPort"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.mysql.remove({ mysqlId: id });
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
 * Arguments for creating a {@link Mysql} resource.
 *
 * @example
 * ```ts
 * const db = new dokploy.Mysql("app-db", {
 *   name: "app-db",
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 * ```
 */
export interface MysqlArgs {
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
  /** Docker image to use (default: mysql:8) */
  dockerImage?: pulumi.Input<string>;
  /** MySQL root password */
  databaseRootPassword?: pulumi.Input<string>;
}

/**
 * A MySQL database managed by Dokploy.
 *
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const db = new dokploy.Mysql("app-db", {
 *   name: "app-db",
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 *
 * export const mysqlId = db.mysqlId;
 * ```
 */
export class Mysql extends pulumi.dynamic.Resource {
  /** The Dokploy MySQL service ID */
  declare public readonly mysqlId: pulumi.Output<string>;
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

  constructor(name: string, args: MysqlArgs, opts?: pulumi.CustomResourceOptions) {
    super(mysqlProvider, name, { mysqlId: undefined, appName: undefined, externalPort: undefined, ...args }, opts);
  }
}
