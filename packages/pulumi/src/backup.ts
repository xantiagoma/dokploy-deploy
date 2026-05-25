import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type DatabaseType = "postgres" | "mariadb" | "mysql" | "mongo" | "web-server" | "libsql";

interface BackupProviderInputs {
  schedule: string;
  prefix: string;
  destinationId: string;
  database: string;
  databaseType: DatabaseType;
  enabled?: boolean | null;
  keepLatestCount?: number | null;
  serviceName?: string | null;
  metadata?: unknown;
}

const backupProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: BackupProviderInputs) {
    const client = getClient();

    const backup = await client.backup.create({
      schedule: inputs.schedule,
      prefix: inputs.prefix,
      destinationId: inputs.destinationId,
      database: inputs.database,
      databaseType: inputs.databaseType,
      enabled: inputs.enabled,
      keepLatestCount: inputs.keepLatestCount,
      serviceName: inputs.serviceName,
      metadata: inputs.metadata,
    });

    return {
      id: backup.backupId,
      outs: { ...inputs, backupId: backup.backupId },
    };
  },

  async read(id: string, props: BackupProviderInputs) {
    const client = getClient();
    try {
      const b = await client.backup.one({ backupId: id });
      return {
        id,
        props: {
          schedule: b.schedule,
          prefix: b.prefix,
          destinationId: b.destinationId,
          database: b.database,
          databaseType: b.databaseType,
          enabled: b.enabled ?? undefined,
          keepLatestCount: b.keepLatestCount ?? undefined,
          serviceName: b.serviceName ?? undefined,
          metadata: b.metadata ?? undefined,
          backupId: b.backupId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: BackupProviderInputs, news: BackupProviderInputs) {
    const client = getClient();
    await client.backup.update({
      backupId: id,
      schedule: news.schedule,
      enabled: news.enabled ?? null,
      prefix: news.prefix,
      destinationId: news.destinationId,
      database: news.database,
      keepLatestCount: news.keepLatestCount ?? null,
      serviceName: news.serviceName ?? null,
      metadata: news.metadata ?? null,
      databaseType: news.databaseType,
    });

    return {
      outs: { ...news, backupId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.backup.remove({ backupId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["destinationId", "databaseType"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Backup} resource.
 *
 * @example
 * ```ts
 * const backup = new dokploy.Backup("db-backup", {
 *   schedule: "0 2 * * *",
 *   prefix: "myapp",
 *   destinationId: destination.destinationId,
 *   database: "mydb",
 *   databaseType: "postgres",
 *   keepLatestCount: 7,
 * });
 * ```
 */
export interface BackupArgs {
  /** Cron expression for the backup schedule (e.g. `"0 2 * * *"`) */
  schedule: pulumi.Input<string>;
  /** Prefix for backup file names */
  prefix: pulumi.Input<string>;
  /** Storage destination ID */
  destinationId: pulumi.Input<string>;
  /** Database name to back up */
  database: pulumi.Input<string>;
  /** Database engine type */
  databaseType: pulumi.Input<DatabaseType>;
  /** Whether backups are enabled */
  enabled?: pulumi.Input<boolean | null>;
  /** Number of most-recent backups to retain */
  keepLatestCount?: pulumi.Input<number | null>;
  /** Service name (for compose-based database services) */
  serviceName?: pulumi.Input<string | null>;
  /** Additional metadata */
  metadata?: pulumi.Input<unknown>;
}

/**
 * A scheduled backup configuration for a Dokploy database service.
 *
 * Changing `destinationId` or `databaseType` triggers a replacement.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const pgBackup = new dokploy.Backup("postgres-daily", {
 *   schedule: "0 3 * * *",
 *   prefix: "prod-pg",
 *   destinationId: s3Destination.destinationId,
 *   database: "appdb",
 *   databaseType: "postgres",
 *   keepLatestCount: 14,
 *   enabled: true,
 * });
 * ```
 */
export class Backup extends pulumi.dynamic.Resource {
  /** The Dokploy backup ID */
  public readonly backupId!: pulumi.Output<string>;
  public readonly schedule!: pulumi.Output<string>;
  public readonly prefix!: pulumi.Output<string>;
  public readonly destinationId!: pulumi.Output<string>;
  public readonly database!: pulumi.Output<string>;
  public readonly databaseType!: pulumi.Output<DatabaseType>;
  public readonly enabled!: pulumi.Output<boolean | null | undefined>;
  public readonly keepLatestCount!: pulumi.Output<number | null | undefined>;
  public readonly serviceName!: pulumi.Output<string | null | undefined>;

  constructor(name: string, args: BackupArgs, opts?: pulumi.CustomResourceOptions) {
    super(backupProvider, name, { backupId: undefined, ...args }, opts);
  }
}
