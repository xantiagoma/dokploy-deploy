import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/** Backup configuration for a MySQL service. */
export interface DokployMysqlBackupArgs {
  /** Cron expression for the backup schedule (e.g. `"0 2 * * *"`) */
  schedule: pulumi.Input<string>;
  /** Prefix for backup file names */
  prefix: pulumi.Input<string>;
  /** Storage destination ID */
  destinationId: pulumi.Input<string>;
  /** Whether backups are enabled (default: `true`) */
  enabled?: pulumi.Input<boolean>;
  /** Number of most-recent backups to retain */
  keepLatestCount?: pulumi.Input<number>;
}

/**
 * Arguments for the {@link DokployMysql} component.
 *
 * @example
 * ```ts
 * new DokployMysql("app-db", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   databaseRootPassword: "rootsecret",
 *   backup: {
 *     schedule: "0 2 * * *",
 *     prefix: "prod-mysql",
 *     destinationId: destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 * ```
 */
export interface DokployMysqlArgs {
  /** Environment ID (required — get from DokployProject.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Service name (defaults to the Pulumi resource name) */
  name?: pulumi.Input<string>;
  /** Name of the database to create */
  databaseName: pulumi.Input<string>;
  /** Database user */
  databaseUser: pulumi.Input<string>;
  /** Database password */
  databasePassword: pulumi.Input<string>;
  /** MySQL root password */
  databaseRootPassword?: pulumi.Input<string>;
  /** Service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: mysql:8) */
  dockerImage?: pulumi.Input<string>;
  /** Server public IP — enables `externalConnectionString` output */
  serverIp?: pulumi.Input<string>;
  /** Optional scheduled backup configuration */
  backup?: DokployMysqlBackupArgs;
}

/**
 * High-level component that creates a Dokploy MySQL database with an optional
 * scheduled backup.
 *
 * @example
 * ```ts
 * import { DokployMysql } from "@xantiagoma/dokploy-sst";
 *
 * const db = new DokployMysql("app-db", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   databaseRootPassword: "rootsecret",
 *   backup: {
 *     schedule: "0 3 * * *",
 *     prefix: "prod-mysql",
 *     destinationId: s3Destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 *
 * export const mysqlId = db.mysqlId;
 * ```
 */
export class DokployMysql extends pulumi.ComponentResource {
  /** The underlying Mysql resource */
  public readonly mysql: dokploy.Mysql;
  /** The Dokploy MySQL service ID */
  public readonly mysqlId: pulumi.Output<string>;
  /** Docker internal hostname (e.g. `mysql-abc123`) */
  public readonly host: pulumi.Output<string>;
  /**
   * Full connection string: `mysql://user:pass@host:3306/dbname`
   *
   * Use this to wire databases to services:
   * ```ts
   * env: { DATABASE_URL: db.connectionString }
   * ```
   */
  public readonly connectionString: pulumi.Output<string>;
  /** External port exposed to the internet (undefined if not enabled) */
  public readonly externalPort: pulumi.Output<number | undefined>;
  /**
   * External connection string: `mysql://user:pass@serverIp:externalPort/dbname`
   *
   * Only available when `externalPort` is set. For access from outside the Docker network.
   * Requires `serverIp` to be passed in args.
   */
  public readonly externalConnectionString?: pulumi.Output<string>;
  /** The Backup resource, if backup was configured */
  public readonly backup?: dokploy.Backup;

  constructor(name: string, args: DokployMysqlArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployMysql", name, {}, opts);

    this.mysql = new dokploy.Mysql(
      `${name}-mysql`,
      {
        name: args.name ?? name,
        environmentId: args.environmentId,
        databaseName: args.databaseName,
        databaseUser: args.databaseUser,
        databasePassword: args.databasePassword,
        databaseRootPassword: args.databaseRootPassword,
        description: args.description,
        dockerImage: args.dockerImage,
      },
      { parent: this },
    );

    this.mysqlId = this.mysql.mysqlId;
    this.host = this.mysql.appName;
    this.externalPort = this.mysql.externalPort;
    this.connectionString = pulumi.interpolate`mysql://${args.databaseUser}:${args.databasePassword}@${this.mysql.appName}:3306/${args.databaseName}`;

    if (args.serverIp) {
      this.externalConnectionString = pulumi.interpolate`mysql://${args.databaseUser}:${args.databasePassword}@${args.serverIp}:${this.mysql.externalPort}/${args.databaseName}`;
    }

    if (args.backup) {
      const b = args.backup;
      this.backup = new dokploy.Backup(
        `${name}-backup`,
        {
          schedule: b.schedule,
          prefix: b.prefix,
          destinationId: b.destinationId,
          database: this.mysql.mysqlId,
          databaseType: "mysql",
          enabled: b.enabled ?? true,
          keepLatestCount: b.keepLatestCount,
        },
        { parent: this, dependsOn: [this.mysql] },
      );
    }

    this.registerOutputs({
      mysqlId: this.mysqlId,
      host: this.host,
      connectionString: this.connectionString,
      externalPort: this.externalPort,
      externalConnectionString: this.externalConnectionString,
    });
  }
}
