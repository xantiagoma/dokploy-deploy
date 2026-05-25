import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/** Backup configuration for a Redis service. */
export interface DokployRedisBackupArgs {
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
 * Arguments for the {@link DokployRedis} component.
 *
 * @example
 * ```ts
 * new DokployRedis("app-cache", {
 *   environmentId: project.productionEnvironmentId,
 *   databasePassword: "supersecret",
 *   backup: {
 *     schedule: "0 2 * * *",
 *     prefix: "prod-redis",
 *     destinationId: destination.destinationId,
 *     keepLatestCount: 7,
 *   },
 * });
 * ```
 */
export interface DokployRedisArgs {
  /** Environment ID (required — get from DokployProject.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Service name (defaults to the Pulumi resource name) */
  name?: pulumi.Input<string>;
  /** Redis password */
  databasePassword: pulumi.Input<string>;
  /** Service description */
  description?: pulumi.Input<string>;
  /** Docker image to use (default: redis:8) */
  dockerImage?: pulumi.Input<string>;
  /** Server public IP — enables `externalConnectionString` output */
  serverIp?: pulumi.Input<string>;
  /** Optional scheduled backup configuration */
  backup?: DokployRedisBackupArgs;
}

/**
 * High-level component that creates a Dokploy Redis instance with an optional
 * scheduled backup.
 *
 * Redis does not use a `databaseName` or `databaseUser` — only a password.
 *
 * Note: the Dokploy backup API does not include a `"redis"` database type.
 * If you provide a `backup`, it will use `"web-server"` as the `databaseType`,
 * which is the closest available value. Check Dokploy's support before relying
 * on Redis backups.
 *
 * @example
 * ```ts
 * import { DokployRedis } from "@xantiagoma/dokploy-sst";
 *
 * const cache = new DokployRedis("app-cache", {
 *   environmentId: project.productionEnvironmentId,
 *   databasePassword: "supersecret",
 *   backup: {
 *     schedule: "0 4 * * *",
 *     prefix: "prod-redis",
 *     destinationId: s3Destination.destinationId,
 *     keepLatestCount: 3,
 *   },
 * });
 *
 * export const redisId = cache.redisId;
 * ```
 */
export class DokployRedis extends pulumi.ComponentResource {
  /** The underlying Redis resource */
  public readonly redis: dokploy.Redis;
  /** The Dokploy Redis service ID */
  public readonly redisId: pulumi.Output<string>;
  /** Docker internal hostname (e.g. `redis-abc123`) */
  public readonly host: pulumi.Output<string>;
  /**
   * Full connection string: `redis://:pass@host:6379`
   *
   * Redis does not use a username — only `:password@`. Use this to wire caches to services:
   * ```ts
   * env: { REDIS_URL: cache.connectionString }
   * ```
   */
  public readonly connectionString: pulumi.Output<string>;
  /** External port exposed to the internet (undefined if not enabled) */
  public readonly externalPort: pulumi.Output<number | undefined>;
  /**
   * External connection string: `redis://:pass@serverIp:externalPort`
   *
   * Only available when `externalPort` is set. For access from outside the Docker network.
   * Requires `serverIp` to be passed in args.
   */
  public readonly externalConnectionString?: pulumi.Output<string>;
  /** The Backup resource, if backup was configured */
  public readonly backup?: dokploy.Backup;

  constructor(name: string, args: DokployRedisArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployRedis", name, {}, opts);

    this.redis = new dokploy.Redis(
      `${name}-redis`,
      {
        name: args.name ?? name,
        environmentId: args.environmentId,
        databasePassword: args.databasePassword,
        description: args.description,
        dockerImage: args.dockerImage,
      },
      { parent: this },
    );

    this.redisId = this.redis.redisId;
    this.host = this.redis.appName;
    this.externalPort = this.redis.externalPort;
    this.connectionString = pulumi.interpolate`redis://:${args.databasePassword}@${this.redis.appName}:6379`;

    if (args.serverIp) {
      this.externalConnectionString = pulumi.interpolate`redis://:${args.databasePassword}@${args.serverIp}:${this.redis.externalPort}`;
    }

    if (args.backup) {
      const b = args.backup;
      this.backup = new dokploy.Backup(
        `${name}-backup`,
        {
          schedule: b.schedule,
          prefix: b.prefix,
          destinationId: b.destinationId,
          database: this.redis.redisId,
          databaseType: "web-server",
          enabled: b.enabled ?? true,
          keepLatestCount: b.keepLatestCount,
        },
        { parent: this, dependsOn: [this.redis] },
      );
    }

    this.registerOutputs({
      redisId: this.redisId,
      host: this.host,
      connectionString: this.connectionString,
      externalPort: this.externalPort,
      externalConnectionString: this.externalConnectionString,
    });
  }
}
