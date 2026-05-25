import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/** Backup configuration for a MariaDB service. */
export interface DokployMariadbBackupArgs {
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
 * Arguments for the {@link DokployMariadb} component.
 *
 * @example
 * ```ts
 * new DokployMariadb("app-db", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   databaseRootPassword: "rootsecret",
 *   backup: {
 *     schedule: "0 2 * * *",
 *     prefix: "prod-mariadb",
 *     destinationId: destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 * ```
 */
export interface DokployMariadbArgs {
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
  /** MariaDB root password */
  databaseRootPassword?: pulumi.Input<string>;
  /** Service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: mariadb:6) */
  dockerImage?: pulumi.Input<string>;
  /** Server public IP — enables `externalConnectionString` output */
  serverIp?: pulumi.Input<string>;
  /** Optional scheduled backup configuration */
  backup?: DokployMariadbBackupArgs;
}

/**
 * High-level component that creates a Dokploy MariaDB database with an optional
 * scheduled backup.
 *
 * @example
 * ```ts
 * import { DokployMariadb } from "@xantiagoma/dokploy-sst";
 *
 * const db = new DokployMariadb("app-db", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   databaseRootPassword: "rootsecret",
 *   backup: {
 *     schedule: "0 3 * * *",
 *     prefix: "prod-mariadb",
 *     destinationId: s3Destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 *
 * export const mariadbId = db.mariadbId;
 * ```
 */
export class DokployMariadb extends pulumi.ComponentResource {
  /** The underlying Mariadb resource */
  public readonly mariadb: dokploy.Mariadb;
  /** The Dokploy MariaDB service ID */
  public readonly mariadbId: pulumi.Output<string>;
  /** Docker internal hostname (e.g. `mariadb-abc123`) */
  public readonly host: pulumi.Output<string>;
  /**
   * Full connection string: `mysql://user:pass@host:3306/dbname`
   *
   * MariaDB uses the mysql protocol. Use this to wire databases to services:
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
   * MariaDB uses the mysql protocol. Only available when `externalPort` is set.
   * For access from outside the Docker network. Requires `serverIp` to be passed in args.
   */
  public readonly externalConnectionString?: pulumi.Output<string>;
  /** The Backup resource, if backup was configured */
  public readonly backup?: dokploy.Backup;

  constructor(name: string, args: DokployMariadbArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployMariadb", name, {}, opts);

    this.mariadb = new dokploy.Mariadb(
      `${name}-mariadb`,
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

    this.mariadbId = this.mariadb.mariadbId;
    this.host = this.mariadb.appName;
    this.externalPort = this.mariadb.externalPort;
    this.connectionString = pulumi.interpolate`mysql://${args.databaseUser}:${args.databasePassword}@${this.mariadb.appName}:3306/${args.databaseName}`;

    if (args.serverIp) {
      this.externalConnectionString = pulumi.interpolate`mysql://${args.databaseUser}:${args.databasePassword}@${args.serverIp}:${this.mariadb.externalPort}/${args.databaseName}`;
    }

    if (args.backup) {
      const b = args.backup;
      this.backup = new dokploy.Backup(
        `${name}-backup`,
        {
          schedule: b.schedule,
          prefix: b.prefix,
          destinationId: b.destinationId,
          database: this.mariadb.mariadbId,
          databaseType: "mariadb",
          enabled: b.enabled ?? true,
          keepLatestCount: b.keepLatestCount,
        },
        { parent: this, dependsOn: [this.mariadb] },
      );
    }

    this.registerOutputs({
      mariadbId: this.mariadbId,
      host: this.host,
      connectionString: this.connectionString,
      externalPort: this.externalPort,
      externalConnectionString: this.externalConnectionString,
    });
  }
}
