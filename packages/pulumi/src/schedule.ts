import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type ScheduleType = "application" | "compose" | "server" | "dokploy-server";

interface ScheduleProviderInputs {
  name: string;
  cronExpression: string;
  command: string;
  applicationId?: string | null;
  composeId?: string | null;
  serverId?: string | null;
  scheduleType?: ScheduleType;
  enabled?: boolean;
}

const scheduleProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ScheduleProviderInputs) {
    const client = getClient();

    const schedule = await client.schedule.create({
      name: inputs.name,
      cronExpression: inputs.cronExpression,
      command: inputs.command,
      applicationId: inputs.applicationId,
      composeId: inputs.composeId,
      serverId: inputs.serverId,
      scheduleType: inputs.scheduleType,
      enabled: inputs.enabled,
    });

    return {
      id: schedule.scheduleId,
      outs: { ...inputs, scheduleId: schedule.scheduleId },
    };
  },

  async read(id: string, props: ScheduleProviderInputs) {
    const client = getClient();
    try {
      const s = await client.schedule.one({ scheduleId: id });
      return {
        id,
        props: {
          name: s.name,
          cronExpression: s.cronExpression,
          command: s.command,
          applicationId: s.applicationId ?? undefined,
          composeId: s.composeId ?? undefined,
          serverId: s.serverId ?? undefined,
          scheduleType: s.scheduleType ?? undefined,
          enabled: s.enabled ?? undefined,
          scheduleId: s.scheduleId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: ScheduleProviderInputs, news: ScheduleProviderInputs) {
    const client = getClient();
    await client.schedule.update({
      scheduleId: id,
      name: news.name,
      cronExpression: news.cronExpression,
      command: news.command,
      applicationId: news.applicationId,
      composeId: news.composeId,
      serverId: news.serverId,
      scheduleType: news.scheduleType,
      enabled: news.enabled,
    });

    return {
      outs: { ...news, scheduleId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.schedule.delete({ scheduleId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["applicationId", "composeId", "serverId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Schedule} resource.
 *
 * @example
 * ```ts
 * const schedule = new dokploy.Schedule("cleanup-job", {
 *   name: "Daily Cleanup",
 *   cronExpression: "0 4 * * *",
 *   command: "node scripts/cleanup.js",
 *   composeId: server.composeId,
 *   scheduleType: "compose",
 * });
 * ```
 */
export interface ScheduleArgs {
  /** Display name for the scheduled task */
  name: pulumi.Input<string>;
  /** Cron expression (e.g. `"0 4 * * *"`) */
  cronExpression: pulumi.Input<string>;
  /** Shell command to execute */
  command: pulumi.Input<string>;
  /** Application ID (for `scheduleType: "application"`) */
  applicationId?: pulumi.Input<string | null>;
  /** Compose service ID (for `scheduleType: "compose"`) */
  composeId?: pulumi.Input<string | null>;
  /** Server ID (for `scheduleType: "server"`) */
  serverId?: pulumi.Input<string | null>;
  /** Schedule target type */
  scheduleType?: pulumi.Input<ScheduleType>;
  /** Whether the schedule is active */
  enabled?: pulumi.Input<boolean>;
}

/**
 * A scheduled (cron) task in Dokploy.
 *
 * Changing `applicationId`, `composeId`, or `serverId` triggers a replacement.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const nightly = new dokploy.Schedule("nightly-cleanup", {
 *   name: "Nightly Cleanup",
 *   cronExpression: "0 2 * * *",
 *   command: "bun run scripts/cleanup.ts",
 *   composeId: server.composeId,
 *   scheduleType: "compose",
 *   enabled: true,
 * });
 * ```
 */
export class Schedule extends pulumi.dynamic.Resource {
  /** The Dokploy schedule ID */
  declare public readonly scheduleId: pulumi.Output<string>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly cronExpression: pulumi.Output<string>;
  declare public readonly command: pulumi.Output<string>;
  declare public readonly applicationId: pulumi.Output<string | null | undefined>;
  declare public readonly composeId: pulumi.Output<string | null | undefined>;
  declare public readonly serverId: pulumi.Output<string | null | undefined>;
  declare public readonly scheduleType: pulumi.Output<ScheduleType | undefined>;
  declare public readonly enabled: pulumi.Output<boolean | undefined>;

  constructor(name: string, args: ScheduleArgs, opts?: pulumi.CustomResourceOptions) {
    super(scheduleProvider, name, { scheduleId: undefined, ...args }, opts);
  }
}
