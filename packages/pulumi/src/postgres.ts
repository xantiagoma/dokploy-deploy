import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface PostgresProviderInputs {
  name: string;
  environmentId: string;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  description?: string;
  dockerImage?: string;
}

const postgresProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: PostgresProviderInputs) {
    const client = getClient();

    // Adopt existing postgres by name within the same environment
    const envData = await client.environment.one({ environmentId: inputs.environmentId });
    const envs = await client.environment.byProjectId({ projectId: envData.projectId });
    const env = envs.find((e) => e.environmentId === inputs.environmentId);
    const existing = env?.postgres.find((p) => p.name === inputs.name);

    if (existing) {
      await client.postgres.update({
        postgresId: existing.postgresId,
        name: inputs.name,
        databaseName: inputs.databaseName,
        databaseUser: inputs.databaseUser,
        databasePassword: inputs.databasePassword,
        description: inputs.description,
        dockerImage: inputs.dockerImage,
      });

      await client.postgres.deploy({ postgresId: existing.postgresId });

      return {
        id: existing.postgresId,
        outs: { ...inputs, postgresId: existing.postgresId, appName: existing.appName, externalPort: existing.externalPort },
      };
    }

    const pg = await client.postgres.create({
      name: inputs.name,
      environmentId: inputs.environmentId,
      databaseName: inputs.databaseName,
      databaseUser: inputs.databaseUser,
      databasePassword: inputs.databasePassword,
      description: inputs.description,
      dockerImage: inputs.dockerImage,
    });

    return {
      id: pg.postgresId,
      outs: { ...inputs, postgresId: pg.postgresId, appName: pg.appName, externalPort: pg.externalPort },
    };
  },

  async read(id: string, props: PostgresProviderInputs) {
    const client = getClient();
    try {
      const pg = await client.postgres.one({ postgresId: id });
      return {
        id,
        props: {
          name: pg.name,
          environmentId: pg.environmentId,
          databaseName: pg.databaseName,
          databaseUser: pg.databaseUser,
          databasePassword: pg.databasePassword,
          description: pg.description ?? undefined,
          dockerImage: pg.dockerImage ?? undefined,
          postgresId: pg.postgresId,
          appName: pg.appName,
          externalPort: pg.externalPort ?? undefined,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: PostgresProviderInputs) {
    const client = getClient();
    await client.postgres.update({
      postgresId: id,
      name: news.name,
      databaseName: news.databaseName,
      databaseUser: news.databaseUser,
      databasePassword: news.databasePassword,
      description: news.description,
      dockerImage: news.dockerImage,
    });

    await client.postgres.deploy({ postgresId: id });

    return {
      outs: { ...news, postgresId: id, appName: olds["appName"] as string, externalPort: olds["externalPort"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.postgres.remove({ postgresId: id });
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
 * Arguments for creating a {@link Postgres} resource.
 *
 * @example
 * ```ts
 * const db = new dokploy.Postgres("app-db", {
 *   name: "app-db",
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 * ```
 */
export interface PostgresArgs {
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
  /** Docker image to use (e.g. `"postgres:16"`) */
  dockerImage?: pulumi.Input<string>;
}

/**
 * A PostgreSQL database managed by Dokploy.
 *
 * Changing `environmentId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const db = new dokploy.Postgres("app-db", {
 *   name: "app-db",
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 * });
 *
 * // Use appName as the Docker internal hostname
 * // e.g. postgres://appuser:supersecret@<appName>:5432/appdb
 * export const host = db.appName;
 * ```
 */
export class Postgres extends pulumi.dynamic.Resource {
  /** The Dokploy PostgreSQL service ID */
  declare public readonly postgresId: pulumi.Output<string>;
  /** Docker internal hostname — use this in connection strings */
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

  constructor(name: string, args: PostgresArgs, opts?: pulumi.CustomResourceOptions) {
    super(postgresProvider, name, { postgresId: undefined, appName: undefined, externalPort: undefined, ...args }, opts);
  }
}
