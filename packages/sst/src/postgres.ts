import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/** Backup configuration for a Postgres service. */
export interface DokployPostgresBackupArgs {
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
 * Arguments for the {@link DokployPostgres} component.
 *
 * @example
 * ```ts
 * new DokployPostgres("app-db", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   backup: {
 *     schedule: "0 2 * * *",
 *     prefix: "prod-pg",
 *     destinationId: destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 * ```
 */
export interface DokployPostgresArgs {
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
  /** Service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: postgres:18) */
  dockerImage?: pulumi.Input<string>;
  /** Server public IP — enables `externalConnectionString` output */
  serverIp?: pulumi.Input<string>;
  /** Optional scheduled backup configuration */
  backup?: DokployPostgresBackupArgs;
}

/**
 * High-level component that creates a Dokploy PostgreSQL database with an optional
 * scheduled backup.
 *
 * @example
 * ```ts
 * import { DokployPostgres } from "@xantiagoma/dokploy-sst";
 *
 * const db = new DokployPostgres("app-db", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseName: "appdb",
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   backup: {
 *     schedule: "0 3 * * *",
 *     prefix: "prod-pg",
 *     destinationId: s3Destination.destinationId,
 *     keepLatestCount: 14,
 *   },
 * });
 *
 * export const postgresId = db.postgresId;
 * ```
 */
export class DokployPostgres extends pulumi.ComponentResource {
  /** The underlying Postgres resource */
  public readonly postgres: dokploy.Postgres;
  /** The Dokploy PostgreSQL service ID */
  public readonly postgresId: pulumi.Output<string>;
  /** Docker internal hostname (e.g. `postgres-abc123`) */
  public readonly host: pulumi.Output<string>;
  /**
   * Internal connection string: `postgres://user:pass@host:5432/dbname`
   *
   * Uses the Docker internal hostname. For services running in the same Dokploy instance:
   * ```ts
   * env: { DATABASE_URL: db.connectionString }
   * ```
   */
  public readonly connectionString: pulumi.Output<string>;
  /** External port exposed to the internet (undefined if not enabled) */
  public readonly externalPort: pulumi.Output<number | undefined>;
  /**
   * External connection string: `postgres://user:pass@serverIp:externalPort/dbname`
   *
   * Only available when `externalPort` is set. For access from outside the Docker network.
   * Requires `serverIp` to be passed in args.
   */
  public readonly externalConnectionString?: pulumi.Output<string>;
  /** The Backup resource, if backup was configured */
  public readonly backup?: dokploy.Backup;

  constructor(name: string, args: DokployPostgresArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployPostgres", name, {}, opts);

    this.postgres = new dokploy.Postgres(
      `${name}-postgres`,
      {
        name: args.name ?? name,
        environmentId: args.environmentId,
        databaseName: args.databaseName,
        databaseUser: args.databaseUser,
        databasePassword: args.databasePassword,
        description: args.description,
        dockerImage: args.dockerImage,
      },
      { parent: this },
    );

    this.postgresId = this.postgres.postgresId;
    this.host = this.postgres.appName;
    this.externalPort = this.postgres.externalPort;
    this.connectionString = pulumi.interpolate`postgres://${args.databaseUser}:${args.databasePassword}@${this.postgres.appName}:5432/${args.databaseName}`;

    if (args.serverIp) {
      this.externalConnectionString = pulumi.interpolate`postgres://${args.databaseUser}:${args.databasePassword}@${args.serverIp}:${this.postgres.externalPort}/${args.databaseName}`;
    }

    if (args.backup) {
      const b = args.backup;
      this.backup = new dokploy.Backup(
        `${name}-backup`,
        {
          schedule: b.schedule,
          prefix: b.prefix,
          destinationId: b.destinationId,
          database: this.postgres.postgresId,
          databaseType: "postgres",
          enabled: b.enabled ?? true,
          keepLatestCount: b.keepLatestCount,
        },
        { parent: this, dependsOn: [this.postgres] },
      );
    }

    this.registerOutputs({
      postgresId: this.postgresId,
      host: this.host,
      connectionString: this.connectionString,
    });
  }
}
