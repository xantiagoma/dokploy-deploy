import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type SqldNodeType = "primary" | "replica";

interface LibsqlProviderInputs {
  name: string;
  appName: string;
  dockerImage: string;
  environmentId: string;
  description: string;
  databaseUser: string;
  databasePassword: string;
  sqldNode: SqldNodeType;
  sqldPrimaryUrl: string;
  enableNamespaces: boolean;
  serverId: string;
}

const libsqlProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: LibsqlProviderInputs) {
    const client = getClient();

    const db = await client.libsql.create({
      name: inputs.name,
      appName: inputs.appName,
      dockerImage: inputs.dockerImage,
      environmentId: inputs.environmentId,
      description: inputs.description,
      databaseUser: inputs.databaseUser,
      databasePassword: inputs.databasePassword,
      sqldNode: inputs.sqldNode,
      sqldPrimaryUrl: inputs.sqldPrimaryUrl,
      enableNamespaces: inputs.enableNamespaces,
      serverId: inputs.serverId,
    });

    return {
      id: db.libsqlId,
      outs: { ...inputs, libsqlId: db.libsqlId },
    };
  },

  async read(id: string, props: LibsqlProviderInputs) {
    const client = getClient();
    try {
      const db = await client.libsql.one({ libsqlId: id });
      return {
        id,
        props: {
          name: db.name,
          appName: db.appName,
          dockerImage: db.dockerImage,
          environmentId: db.environmentId,
          description: db.description,
          databaseUser: db.databaseUser,
          // Preserve secret from state — API may not return it
          databasePassword: db.databasePassword ?? props.databasePassword,
          sqldNode: db.sqldNode,
          sqldPrimaryUrl: db.sqldPrimaryUrl,
          enableNamespaces: db.enableNamespaces,
          serverId: db.serverId,
          libsqlId: db.libsqlId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: LibsqlProviderInputs, news: LibsqlProviderInputs) {
    const client = getClient();
    await client.libsql.update({
      libsqlId: id,
      name: news.name,
      appName: news.appName,
      dockerImage: news.dockerImage,
      description: news.description,
      databaseUser: news.databaseUser,
      databasePassword: news.databasePassword,
      sqldNode: news.sqldNode,
      sqldPrimaryUrl: news.sqldPrimaryUrl,
      enableNamespaces: news.enableNamespaces,
    });

    return {
      outs: { ...news, libsqlId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.libsql.remove({ libsqlId: id });
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
 * Arguments for creating a {@link Libsql} resource.
 *
 * @example
 * ```ts
 * const db = new dokploy.Libsql("app-libsql", {
 *   name: "app-libsql",
 *   appName: "app-libsql",
 *   dockerImage: "ghcr.io/tursodatabase/libsql-server:latest",
 *   environmentId: project.productionEnvironmentId,
 *   description: "LibSQL database for app",
 *   databaseUser: "admin",
 *   databasePassword: "supersecret",
 *   sqldNode: "primary",
 *   sqldPrimaryUrl: "libsql://localhost:8080",
 *   enableNamespaces: true,
 *   serverId: server.serverId,
 * });
 * ```
 */
export interface LibsqlArgs {
  /** Service name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Application name used internally */
  appName: pulumi.Input<string>;
  /** Docker image for the LibSQL server */
  dockerImage: pulumi.Input<string>;
  /** Environment ID (required — get from project.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Service description */
  description: pulumi.Input<string>;
  /** Database user */
  databaseUser: pulumi.Input<string>;
  /** Database password (treated as secret) */
  databasePassword: pulumi.Input<string>;
  /** sqld node role (`"primary"` or `"replica"`) */
  sqldNode: pulumi.Input<SqldNodeType>;
  /** sqld primary URL */
  sqldPrimaryUrl: pulumi.Input<string>;
  /** Whether to enable namespace support */
  enableNamespaces: pulumi.Input<boolean>;
  /** Server ID to deploy the service on */
  serverId: pulumi.Input<string>;
}

/**
 * A LibSQL/Turso database managed by Dokploy.
 *
 * Changing `environmentId` triggers a replacement (delete + create).
 * `databasePassword` is treated as a secret and preserved from state on read.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const db = new dokploy.Libsql("app-libsql", {
 *   name: "app-libsql",
 *   appName: "app-libsql",
 *   dockerImage: "ghcr.io/tursodatabase/libsql-server:latest",
 *   environmentId: project.productionEnvironmentId,
 *   description: "LibSQL database for app",
 *   databaseUser: "admin",
 *   databasePassword: "supersecret",
 *   sqldNode: "primary",
 *   sqldPrimaryUrl: "libsql://localhost:8080",
 *   enableNamespaces: true,
 *   serverId: server.serverId,
 * });
 *
 * export const libsqlId = db.libsqlId;
 * ```
 */
export class Libsql extends pulumi.dynamic.Resource {
  /** The Dokploy LibSQL service ID */
  public readonly libsqlId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly appName!: pulumi.Output<string>;
  public readonly dockerImage!: pulumi.Output<string>;
  public readonly environmentId!: pulumi.Output<string>;
  public readonly description!: pulumi.Output<string>;
  public readonly databaseUser!: pulumi.Output<string>;
  public readonly databasePassword!: pulumi.Output<string>;
  public readonly sqldNode!: pulumi.Output<SqldNodeType>;
  public readonly sqldPrimaryUrl!: pulumi.Output<string>;
  public readonly enableNamespaces!: pulumi.Output<boolean>;
  public readonly serverId!: pulumi.Output<string>;

  constructor(name: string, args: LibsqlArgs, opts?: pulumi.CustomResourceOptions) {
    super(libsqlProvider, name, { libsqlId: undefined, ...args }, opts);
  }
}
