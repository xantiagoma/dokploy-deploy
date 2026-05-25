import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type VolumeBackupServiceType = "application" | "postgres" | "mysql" | "mariadb" | "mongo" | "redis" | "compose" | "libsql";

interface VolumeBackupProviderInputs {
  name: string;
  volumeName: string;
  prefix: string;
  cronExpression: string;
  destinationId: string;
  serviceType?: VolumeBackupServiceType;
  appName?: string;
  serviceName?: string;
  turnOff?: boolean;
  keepLatestCount?: number;
  enabled?: boolean;
  applicationId?: string;
  postgresId?: string;
  mariadbId?: string;
  mongoId?: string;
  mysqlId?: string;
  redisId?: string;
  libsqlId?: string;
  composeId?: string;
}

const volumeBackupProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: VolumeBackupProviderInputs) {
    const client = getClient();

    const vb = await client.volumeBackups.create({
      name: inputs.name,
      volumeName: inputs.volumeName,
      prefix: inputs.prefix,
      cronExpression: inputs.cronExpression,
      destinationId: inputs.destinationId,
      serviceType: inputs.serviceType,
      appName: inputs.appName,
      serviceName: inputs.serviceName,
      turnOff: inputs.turnOff,
      keepLatestCount: inputs.keepLatestCount,
      enabled: inputs.enabled,
      applicationId: inputs.applicationId,
      postgresId: inputs.postgresId,
      mariadbId: inputs.mariadbId,
      mongoId: inputs.mongoId,
      mysqlId: inputs.mysqlId,
      redisId: inputs.redisId,
      libsqlId: inputs.libsqlId,
      composeId: inputs.composeId,
    });

    return {
      id: vb.volumeBackupId,
      outs: { ...inputs, volumeBackupId: vb.volumeBackupId },
    };
  },

  async read(id: string, props: VolumeBackupProviderInputs) {
    const client = getClient();
    try {
      const vb = await client.volumeBackups.one({ volumeBackupId: id });
      return {
        id,
        props: {
          name: vb.name,
          volumeName: vb.volumeName,
          prefix: vb.prefix,
          cronExpression: vb.cronExpression,
          destinationId: vb.destinationId,
          serviceType: vb.serviceType ?? undefined,
          appName: vb.appName ?? undefined,
          serviceName: vb.serviceName ?? undefined,
          turnOff: vb.turnOff ?? undefined,
          keepLatestCount: vb.keepLatestCount ?? undefined,
          enabled: vb.enabled ?? undefined,
          applicationId: vb.applicationId ?? undefined,
          postgresId: vb.postgresId ?? undefined,
          mariadbId: vb.mariadbId ?? undefined,
          mongoId: vb.mongoId ?? undefined,
          mysqlId: vb.mysqlId ?? undefined,
          redisId: vb.redisId ?? undefined,
          libsqlId: vb.libsqlId ?? undefined,
          composeId: vb.composeId ?? undefined,
          volumeBackupId: vb.volumeBackupId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: VolumeBackupProviderInputs, news: VolumeBackupProviderInputs) {
    const client = getClient();
    await client.volumeBackups.update({
      volumeBackupId: id,
      name: news.name,
      volumeName: news.volumeName,
      prefix: news.prefix,
      cronExpression: news.cronExpression,
      destinationId: news.destinationId,
      serviceType: news.serviceType,
      appName: news.appName,
      serviceName: news.serviceName,
      turnOff: news.turnOff,
      keepLatestCount: news.keepLatestCount,
      enabled: news.enabled,
      applicationId: news.applicationId,
      postgresId: news.postgresId,
      mariadbId: news.mariadbId,
      mongoId: news.mongoId,
      mysqlId: news.mysqlId,
      redisId: news.redisId,
      libsqlId: news.libsqlId,
      composeId: news.composeId,
    });

    return {
      outs: { ...news, volumeBackupId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.volumeBackups.delete({ volumeBackupId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["destinationId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link VolumeBackup} resource.
 *
 * @example
 * ```ts
 * const vb = new dokploy.VolumeBackup("app-volume-backup", {
 *   name: "app-volume-backup",
 *   volumeName: "app_data",
 *   prefix: "app-vol",
 *   cronExpression: "0 3 * * *",
 *   destinationId: destination.destinationId,
 *   applicationId: app.applicationId,
 *   keepLatestCount: 7,
 *   enabled: true,
 * });
 * ```
 */
export interface VolumeBackupArgs {
  /** Backup configuration name displayed in the dashboard */
  name: pulumi.Input<string>;
  /** Docker volume name to back up */
  volumeName: pulumi.Input<string>;
  /** Prefix for backup archive filenames */
  prefix: pulumi.Input<string>;
  /** Cron expression for the backup schedule (e.g. `"0 3 * * *"`) */
  cronExpression: pulumi.Input<string>;
  /** Storage destination ID (replacement trigger) */
  destinationId: pulumi.Input<string>;
  /** Service type (e.g. `"application"`, `"compose"`) */
  serviceType?: pulumi.Input<VolumeBackupServiceType>;
  /** Application name (for compose service volumes) */
  appName?: pulumi.Input<string>;
  /** Service name within a compose stack */
  serviceName?: pulumi.Input<string>;
  /** Whether to stop the service during backup */
  turnOff?: pulumi.Input<boolean>;
  /** Number of most-recent backups to retain */
  keepLatestCount?: pulumi.Input<number>;
  /** Whether backups are enabled */
  enabled?: pulumi.Input<boolean>;
  /** Application ID to associate this backup with */
  applicationId?: pulumi.Input<string>;
  /** PostgreSQL service ID to associate this backup with */
  postgresId?: pulumi.Input<string>;
  /** MariaDB service ID to associate this backup with */
  mariadbId?: pulumi.Input<string>;
  /** MongoDB service ID to associate this backup with */
  mongoId?: pulumi.Input<string>;
  /** MySQL service ID to associate this backup with */
  mysqlId?: pulumi.Input<string>;
  /** Redis service ID to associate this backup with */
  redisId?: pulumi.Input<string>;
  /** LibSQL service ID to associate this backup with */
  libsqlId?: pulumi.Input<string>;
  /** Compose service ID to associate this backup with */
  composeId?: pulumi.Input<string>;
}

/**
 * A volume backup configuration managed by Dokploy.
 *
 * Changing `destinationId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const vb = new dokploy.VolumeBackup("app-volume-backup", {
 *   name: "app-volume-backup",
 *   volumeName: "app_data",
 *   prefix: "app-vol",
 *   cronExpression: "0 3 * * *",
 *   destinationId: s3Destination.destinationId,
 *   applicationId: app.applicationId,
 *   keepLatestCount: 7,
 *   enabled: true,
 * });
 *
 * export const volumeBackupId = vb.volumeBackupId;
 * ```
 */
export class VolumeBackup extends pulumi.dynamic.Resource {
  /** The Dokploy volume backup configuration ID */
  public readonly volumeBackupId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly volumeName!: pulumi.Output<string>;
  public readonly prefix!: pulumi.Output<string>;
  public readonly cronExpression!: pulumi.Output<string>;
  public readonly destinationId!: pulumi.Output<string>;
  public readonly serviceType!: pulumi.Output<VolumeBackupServiceType | undefined>;
  public readonly appName!: pulumi.Output<string | undefined>;
  public readonly serviceName!: pulumi.Output<string | undefined>;
  public readonly turnOff!: pulumi.Output<boolean | undefined>;
  public readonly keepLatestCount!: pulumi.Output<number | undefined>;
  public readonly enabled!: pulumi.Output<boolean | undefined>;
  public readonly applicationId!: pulumi.Output<string | undefined>;
  public readonly postgresId!: pulumi.Output<string | undefined>;
  public readonly mariadbId!: pulumi.Output<string | undefined>;
  public readonly mongoId!: pulumi.Output<string | undefined>;
  public readonly mysqlId!: pulumi.Output<string | undefined>;
  public readonly redisId!: pulumi.Output<string | undefined>;
  public readonly libsqlId!: pulumi.Output<string | undefined>;
  public readonly composeId!: pulumi.Output<string | undefined>;

  constructor(name: string, args: VolumeBackupArgs, opts?: pulumi.CustomResourceOptions) {
    super(volumeBackupProvider, name, { volumeBackupId: undefined, ...args }, opts);
  }
}
