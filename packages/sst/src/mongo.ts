import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/** Backup configuration for a MongoDB service. */
export interface DokployMongoBackupArgs {
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
 * Arguments for the {@link DokployMongo} component.
 *
 * @example
 * ```ts
 * new DokployMongo("app-mongo", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   backup: {
 *     schedule: "0 2 * * *",
 *     prefix: "prod-mongo",
 *     destinationId: destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 * ```
 */
export interface DokployMongoArgs {
  /** Environment ID (required — get from DokployProject.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Service name (defaults to the Pulumi resource name) */
  name?: pulumi.Input<string>;
  /** Database user */
  databaseUser: pulumi.Input<string>;
  /** Database password */
  databasePassword: pulumi.Input<string>;
  /** Service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: mongo:15) */
  dockerImage?: pulumi.Input<string>;
  /** Enable MongoDB replica sets */
  replicaSets?: pulumi.Input<boolean>;
  /** Server public IP — enables `externalConnectionString` output */
  serverIp?: pulumi.Input<string>;
  /** Optional scheduled backup configuration */
  backup?: DokployMongoBackupArgs;
}

/**
 * High-level component that creates a Dokploy MongoDB database with an optional
 * scheduled backup.
 *
 * Unlike SQL databases, MongoDB does not require a `databaseName` at creation time.
 *
 * @example
 * ```ts
 * import { DokployMongo } from "@xantiagoma/dokploy-sst";
 *
 * const db = new DokployMongo("app-mongo", {
 *   environmentId: project.productionEnvironmentId,
 *   databaseUser: "appuser",
 *   databasePassword: "supersecret",
 *   backup: {
 *     schedule: "0 3 * * *",
 *     prefix: "prod-mongo",
 *     destinationId: s3Destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 *
 * export const mongoId = db.mongoId;
 * ```
 */
export class DokployMongo extends pulumi.ComponentResource {
  /** The underlying Mongo resource */
  public readonly mongo: dokploy.Mongo;
  /** The Dokploy MongoDB service ID */
  public readonly mongoId: pulumi.Output<string>;
  /** Docker internal hostname (e.g. `mongo-abc123`) */
  public readonly host: pulumi.Output<string>;
  /**
   * Full connection string: `mongodb://user:pass@host:27017`
   *
   * No database name is included — MongoDB does not require one at the connection level.
   * Use this to wire databases to services:
   * ```ts
   * env: { DATABASE_URL: db.connectionString }
   * ```
   */
  public readonly connectionString: pulumi.Output<string>;
  /** External port exposed to the internet (undefined if not enabled) */
  public readonly externalPort: pulumi.Output<number | undefined>;
  /**
   * External connection string: `mongodb://user:pass@serverIp:externalPort`
   *
   * Only available when `externalPort` is set. For access from outside the Docker network.
   * Requires `serverIp` to be passed in args.
   */
  public readonly externalConnectionString?: pulumi.Output<string>;
  /** The Backup resource, if backup was configured */
  public readonly backup?: dokploy.Backup;

  constructor(name: string, args: DokployMongoArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployMongo", name, {}, opts);

    this.mongo = new dokploy.Mongo(
      `${name}-mongo`,
      {
        name: args.name ?? name,
        environmentId: args.environmentId,
        databaseUser: args.databaseUser,
        databasePassword: args.databasePassword,
        description: args.description,
        dockerImage: args.dockerImage,
        replicaSets: args.replicaSets,
      },
      { parent: this },
    );

    this.mongoId = this.mongo.mongoId;
    this.host = this.mongo.appName;
    this.externalPort = this.mongo.externalPort;
    this.connectionString = pulumi.interpolate`mongodb://${args.databaseUser}:${args.databasePassword}@${this.mongo.appName}:27017`;

    if (args.serverIp) {
      this.externalConnectionString = pulumi.interpolate`mongodb://${args.databaseUser}:${args.databasePassword}@${args.serverIp}:${this.mongo.externalPort}`;
    }

    if (args.backup) {
      const b = args.backup;
      this.backup = new dokploy.Backup(
        `${name}-backup`,
        {
          schedule: b.schedule,
          prefix: b.prefix,
          destinationId: b.destinationId,
          database: this.mongo.mongoId,
          databaseType: "mongo",
          enabled: b.enabled ?? true,
          keepLatestCount: b.keepLatestCount,
        },
        { parent: this, dependsOn: [this.mongo] },
      );
    }

    this.registerOutputs({
      mongoId: this.mongoId,
      host: this.host,
      connectionString: this.connectionString,
      externalPort: this.externalPort,
      externalConnectionString: this.externalConnectionString,
    });
  }
}
