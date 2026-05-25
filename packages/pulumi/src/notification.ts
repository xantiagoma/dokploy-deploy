import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

// ---------------------------------------------------------------------------
// Shared notification event flags (common to all notification types)
// ---------------------------------------------------------------------------

interface NotificationEventFlagsBase {
  appBuildError: boolean;
  databaseBackup: boolean;
  dokployBackup: boolean;
  volumeBackup: boolean;
  dokployRestart: boolean;
  appDeploy: boolean;
  dockerCleanup: boolean;
}

interface NotificationEventFlags extends NotificationEventFlagsBase {
  serverThreshold: boolean;
}

// ---------------------------------------------------------------------------
// Slack
// ---------------------------------------------------------------------------

interface SlackProviderInputs extends NotificationEventFlags {
  name: string;
  webhookUrl: string;
  channel: string;
}

const slackProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: SlackProviderInputs) {
    const client = getClient();
    const result = await client.notification.createSlack({
      name: inputs.name,
      webhookUrl: inputs.webhookUrl,
      channel: inputs.channel,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, slackId: result.slackId },
    };
  },

  async read(id: string, props: SlackProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          webhookUrl: n.slack?.webhookUrl ?? props.webhookUrl,
          channel: n.slack?.channel ?? props.channel,
          notificationId: n.notificationId,
          slackId: n.slack?.slackId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: SlackProviderInputs) {
    const client = getClient();
    await client.notification.updateSlack({
      notificationId: id,
      slackId: olds["slackId"] as string,
      name: news.name,
      webhookUrl: news.webhookUrl,
      channel: news.channel,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, slackId: olds["slackId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface SlackNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Slack incoming webhook URL */
  webhookUrl: pulumi.Input<string>;
  /** Slack channel name (e.g. `"#alerts"`) */
  channel: pulumi.Input<string>;
}

/**
 * A Slack notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const slack = new dokploy.SlackNotification("alerts", {
 *   name: "Production Alerts",
 *   webhookUrl: "https://hooks.slack.com/services/...",
 *   channel: "#deployments",
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class SlackNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly slackId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly webhookUrl!: pulumi.Output<string>;
  public readonly channel!: pulumi.Output<string>;

  constructor(name: string, args: SlackNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(slackProvider, name, { notificationId: undefined, slackId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Telegram
// ---------------------------------------------------------------------------

interface TelegramProviderInputs extends NotificationEventFlags {
  name: string;
  botToken: string;
  chatId: string;
  messageThreadId: string;
}

const telegramProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: TelegramProviderInputs) {
    const client = getClient();
    const result = await client.notification.createTelegram({
      name: inputs.name,
      botToken: inputs.botToken,
      chatId: inputs.chatId,
      messageThreadId: inputs.messageThreadId,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, telegramId: result.telegramId },
    };
  },

  async read(id: string, props: TelegramProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          botToken: n.telegram?.botToken ?? props.botToken,
          chatId: n.telegram?.chatId ?? props.chatId,
          messageThreadId: n.telegram?.messageThreadId ?? props.messageThreadId,
          notificationId: n.notificationId,
          telegramId: n.telegram?.telegramId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: TelegramProviderInputs) {
    const client = getClient();
    await client.notification.updateTelegram({
      notificationId: id,
      telegramId: olds["telegramId"] as string,
      name: news.name,
      botToken: news.botToken,
      chatId: news.chatId,
      messageThreadId: news.messageThreadId,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, telegramId: olds["telegramId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface TelegramNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Telegram bot token */
  botToken: pulumi.Input<string>;
  /** Telegram chat ID */
  chatId: pulumi.Input<string>;
  /** Message thread ID (use `""` if not targeting a thread) */
  messageThreadId: pulumi.Input<string>;
}

/**
 * A Telegram notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const telegram = new dokploy.TelegramNotification("alerts", {
 *   name: "Production Alerts",
 *   botToken: "1234567890:ABC...",
 *   chatId: "-1001234567890",
 *   messageThreadId: "",
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class TelegramNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly telegramId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly botToken!: pulumi.Output<string>;
  public readonly chatId!: pulumi.Output<string>;
  public readonly messageThreadId!: pulumi.Output<string>;

  constructor(name: string, args: TelegramNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(telegramProvider, name, { notificationId: undefined, telegramId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Discord
// ---------------------------------------------------------------------------

interface DiscordProviderInputs extends NotificationEventFlags {
  name: string;
  webhookUrl: string;
  decoration: boolean;
}

const discordProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: DiscordProviderInputs) {
    const client = getClient();
    const result = await client.notification.createDiscord({
      name: inputs.name,
      webhookUrl: inputs.webhookUrl,
      decoration: inputs.decoration,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, discordId: result.discordId },
    };
  },

  async read(id: string, props: DiscordProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          webhookUrl: n.discord?.webhookUrl ?? props.webhookUrl,
          decoration: n.discord?.decoration ?? props.decoration,
          notificationId: n.notificationId,
          discordId: n.discord?.discordId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: DiscordProviderInputs) {
    const client = getClient();
    await client.notification.updateDiscord({
      notificationId: id,
      discordId: olds["discordId"] as string,
      name: news.name,
      webhookUrl: news.webhookUrl,
      decoration: news.decoration,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, discordId: olds["discordId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface DiscordNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Discord incoming webhook URL */
  webhookUrl: pulumi.Input<string>;
  /** Whether to use Discord message decorations (embeds) */
  decoration: pulumi.Input<boolean>;
}

/**
 * A Discord notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const discord = new dokploy.DiscordNotification("alerts", {
 *   name: "Production Alerts",
 *   webhookUrl: "https://discord.com/api/webhooks/...",
 *   decoration: true,
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class DiscordNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly discordId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly webhookUrl!: pulumi.Output<string>;
  public readonly decoration!: pulumi.Output<boolean>;

  constructor(name: string, args: DiscordNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(discordProvider, name, { notificationId: undefined, discordId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

interface EmailProviderInputs extends NotificationEventFlags {
  name: string;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  fromAddress: string;
  toAddresses: string[];
}

const emailProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: EmailProviderInputs) {
    const client = getClient();
    const result = await client.notification.createEmail({
      name: inputs.name,
      smtpServer: inputs.smtpServer,
      smtpPort: inputs.smtpPort,
      username: inputs.username,
      password: inputs.password,
      fromAddress: inputs.fromAddress,
      toAddresses: inputs.toAddresses,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, emailId: result.emailId },
    };
  },

  async read(id: string, props: EmailProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          smtpServer: n.email?.smtpServer ?? props.smtpServer,
          smtpPort: n.email?.smtpPort ?? props.smtpPort,
          username: n.email?.username ?? props.username,
          password: n.email?.password ?? props.password,
          fromAddress: n.email?.fromAddress ?? props.fromAddress,
          toAddresses: n.email?.toAddresses ?? props.toAddresses,
          notificationId: n.notificationId,
          emailId: n.email?.emailId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: EmailProviderInputs) {
    const client = getClient();
    await client.notification.updateEmail({
      notificationId: id,
      emailId: olds["emailId"] as string,
      name: news.name,
      smtpServer: news.smtpServer,
      smtpPort: news.smtpPort,
      username: news.username,
      password: news.password,
      fromAddress: news.fromAddress,
      toAddresses: news.toAddresses,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, emailId: olds["emailId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface EmailNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** SMTP server hostname */
  smtpServer: pulumi.Input<string>;
  /** SMTP server port */
  smtpPort: pulumi.Input<number>;
  /** SMTP authentication username */
  username: pulumi.Input<string>;
  /** SMTP authentication password */
  password: pulumi.Input<string>;
  /** Sender email address */
  fromAddress: pulumi.Input<string>;
  /** List of recipient email addresses */
  toAddresses: pulumi.Input<string[]>;
}

/**
 * An Email (SMTP) notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const email = new dokploy.EmailNotification("alerts", {
 *   name: "Production Alerts",
 *   smtpServer: "smtp.example.com",
 *   smtpPort: 587,
 *   username: "alerts@example.com",
 *   password: process.env.SMTP_PASSWORD!,
 *   fromAddress: "alerts@example.com",
 *   toAddresses: ["ops@example.com"],
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class EmailNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly emailId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly smtpServer!: pulumi.Output<string>;
  public readonly smtpPort!: pulumi.Output<number>;
  public readonly fromAddress!: pulumi.Output<string>;
  public readonly toAddresses!: pulumi.Output<string[]>;

  constructor(name: string, args: EmailNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(emailProvider, name, { notificationId: undefined, emailId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Gotify
// ---------------------------------------------------------------------------

interface GotifyProviderInputs extends NotificationEventFlagsBase {
  name: string;
  serverUrl: string;
  appToken: string;
  priority: number;
  decoration: boolean;
}

const gotifyProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: GotifyProviderInputs) {
    const client = getClient();
    const result = await client.notification.createGotify({
      name: inputs.name,
      serverUrl: inputs.serverUrl,
      appToken: inputs.appToken,
      priority: inputs.priority,
      decoration: inputs.decoration,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, gotifyId: result.gotifyId },
    };
  },

  async read(id: string, props: GotifyProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverUrl: n.gotify?.serverUrl ?? props.serverUrl,
          appToken: n.gotify?.appToken ?? props.appToken,
          priority: n.gotify?.priority ?? props.priority,
          decoration: n.gotify?.decoration ?? props.decoration,
          notificationId: n.notificationId,
          gotifyId: n.gotify?.gotifyId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: GotifyProviderInputs) {
    const client = getClient();
    await client.notification.updateGotify({
      notificationId: id,
      gotifyId: olds["gotifyId"] as string,
      name: news.name,
      serverUrl: news.serverUrl,
      appToken: news.appToken,
      priority: news.priority,
      decoration: news.decoration,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
    });

    return {
      outs: { ...news, notificationId: id, gotifyId: olds["gotifyId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface GotifyNotificationArgs extends NotificationEventFlagsBase {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Gotify server URL */
  serverUrl: pulumi.Input<string>;
  /** Gotify application token */
  appToken: pulumi.Input<string>;
  /** Message priority (minimum 1) */
  priority: pulumi.Input<number>;
  /** Whether to use message decorations */
  decoration: pulumi.Input<boolean>;
}

/**
 * A Gotify notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const gotify = new dokploy.GotifyNotification("alerts", {
 *   name: "Production Alerts",
 *   serverUrl: "https://gotify.example.com",
 *   appToken: process.env.GOTIFY_TOKEN!,
 *   priority: 5,
 *   decoration: true,
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 * });
 * ```
 */
export class GotifyNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly gotifyId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly serverUrl!: pulumi.Output<string>;
  public readonly appToken!: pulumi.Output<string>;
  public readonly priority!: pulumi.Output<number>;
  public readonly decoration!: pulumi.Output<boolean>;

  constructor(name: string, args: GotifyNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(gotifyProvider, name, { notificationId: undefined, gotifyId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Ntfy
// ---------------------------------------------------------------------------

interface NtfyProviderInputs extends NotificationEventFlagsBase {
  name: string;
  serverUrl: string;
  topic: string;
  accessToken: string;
  priority: number;
}

const ntfyProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: NtfyProviderInputs) {
    const client = getClient();
    const result = await client.notification.createNtfy({
      name: inputs.name,
      serverUrl: inputs.serverUrl,
      topic: inputs.topic,
      accessToken: inputs.accessToken,
      priority: inputs.priority,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, ntfyId: result.ntfyId },
    };
  },

  async read(id: string, props: NtfyProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverUrl: n.ntfy?.serverUrl ?? props.serverUrl,
          topic: n.ntfy?.topic ?? props.topic,
          accessToken: n.ntfy?.accessToken ?? props.accessToken,
          priority: n.ntfy?.priority ?? props.priority,
          notificationId: n.notificationId,
          ntfyId: n.ntfy?.ntfyId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: NtfyProviderInputs) {
    const client = getClient();
    await client.notification.updateNtfy({
      notificationId: id,
      ntfyId: olds["ntfyId"] as string,
      name: news.name,
      serverUrl: news.serverUrl,
      topic: news.topic,
      accessToken: news.accessToken,
      priority: news.priority,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
    });

    return {
      outs: { ...news, notificationId: id, ntfyId: olds["ntfyId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface NtfyNotificationArgs extends NotificationEventFlagsBase {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Ntfy server URL */
  serverUrl: pulumi.Input<string>;
  /** Ntfy topic name */
  topic: pulumi.Input<string>;
  /** Ntfy access token (use `""` if not required) */
  accessToken: pulumi.Input<string>;
  /** Message priority (minimum 1) */
  priority: pulumi.Input<number>;
}

/**
 * An Ntfy notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const ntfy = new dokploy.NtfyNotification("alerts", {
 *   name: "Production Alerts",
 *   serverUrl: "https://ntfy.sh",
 *   topic: "my-deploy-alerts",
 *   accessToken: "",
 *   priority: 3,
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 * });
 * ```
 */
export class NtfyNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly ntfyId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly serverUrl!: pulumi.Output<string>;
  public readonly topic!: pulumi.Output<string>;
  public readonly accessToken!: pulumi.Output<string>;
  public readonly priority!: pulumi.Output<number>;

  constructor(name: string, args: NtfyNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(ntfyProvider, name, { notificationId: undefined, ntfyId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Mattermost
// ---------------------------------------------------------------------------

interface MattermostProviderInputs extends NotificationEventFlags {
  name: string;
  webhookUrl: string;
  channel: string;
  username: string;
}

const mattermostProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: MattermostProviderInputs) {
    const client = getClient();
    const result = await client.notification.createMattermost({
      name: inputs.name,
      webhookUrl: inputs.webhookUrl,
      channel: inputs.channel,
      username: inputs.username,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, mattermostId: result.mattermostId },
    };
  },

  async read(id: string, props: MattermostProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          webhookUrl: n.mattermost?.webhookUrl ?? props.webhookUrl,
          channel: n.mattermost?.channel ?? props.channel,
          username: n.mattermost?.username ?? props.username,
          notificationId: n.notificationId,
          mattermostId: n.mattermost?.mattermostId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: MattermostProviderInputs) {
    const client = getClient();
    await client.notification.updateMattermost({
      notificationId: id,
      mattermostId: olds["mattermostId"] as string,
      name: news.name,
      webhookUrl: news.webhookUrl,
      channel: news.channel,
      username: news.username,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, mattermostId: olds["mattermostId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface MattermostNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Mattermost incoming webhook URL */
  webhookUrl: pulumi.Input<string>;
  /** Mattermost channel name (e.g. `"town-square"`) */
  channel: pulumi.Input<string>;
  /** Mattermost username override (use `""` to use the webhook default) */
  username: pulumi.Input<string>;
}

/**
 * A Mattermost notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const mattermost = new dokploy.MattermostNotification("alerts", {
 *   name: "Production Alerts",
 *   webhookUrl: "https://mattermost.example.com/hooks/...",
 *   channel: "deployments",
 *   username: "Dokploy",
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class MattermostNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly mattermostId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly webhookUrl!: pulumi.Output<string>;
  public readonly channel!: pulumi.Output<string>;
  public readonly username!: pulumi.Output<string>;

  constructor(name: string, args: MattermostNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(mattermostProvider, name, { notificationId: undefined, mattermostId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Custom
// ---------------------------------------------------------------------------

interface CustomProviderInputs extends NotificationEventFlags {
  name: string;
  endpoint: string;
  headers: Record<string, string>;
}

const customProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: CustomProviderInputs) {
    const client = getClient();
    const result = await client.notification.createCustom({
      name: inputs.name,
      endpoint: inputs.endpoint,
      headers: inputs.headers,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, customId: result.customId },
    };
  },

  async read(id: string, props: CustomProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          endpoint: n.custom?.endpoint ?? props.endpoint,
          headers: n.custom?.headers ?? props.headers,
          notificationId: n.notificationId,
          customId: n.custom?.customId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: CustomProviderInputs) {
    const client = getClient();
    await client.notification.updateCustom({
      notificationId: id,
      customId: olds["customId"] as string,
      name: news.name,
      endpoint: news.endpoint,
      headers: news.headers,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, customId: olds["customId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface CustomNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Webhook endpoint URL */
  endpoint: pulumi.Input<string>;
  /** Optional HTTP headers to include in the request */
  headers?: pulumi.Input<Record<string, string>>;
}

/**
 * A Custom webhook notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const custom = new dokploy.CustomNotification("alerts", {
 *   name: "Production Alerts",
 *   endpoint: "https://example.com/webhook",
 *   headers: { Authorization: "Bearer secret" },
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class CustomNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly customId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly endpoint!: pulumi.Output<string>;
  public readonly headers!: pulumi.Output<Record<string, string>>;

  constructor(name: string, args: CustomNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(customProvider, name, { notificationId: undefined, customId: undefined, headers: {}, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Lark
// ---------------------------------------------------------------------------

interface LarkProviderInputs extends NotificationEventFlags {
  name: string;
  webhookUrl: string;
}

const larkProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: LarkProviderInputs) {
    const client = getClient();
    const result = await client.notification.createLark({
      name: inputs.name,
      webhookUrl: inputs.webhookUrl,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, larkId: result.larkId },
    };
  },

  async read(id: string, props: LarkProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          webhookUrl: n.lark?.webhookUrl ?? props.webhookUrl,
          notificationId: n.notificationId,
          larkId: n.lark?.larkId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: LarkProviderInputs) {
    const client = getClient();
    await client.notification.updateLark({
      notificationId: id,
      larkId: olds["larkId"] as string,
      name: news.name,
      webhookUrl: news.webhookUrl,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, larkId: olds["larkId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface LarkNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Lark (Feishu) incoming webhook URL */
  webhookUrl: pulumi.Input<string>;
}

/**
 * A Lark (Feishu) notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const lark = new dokploy.LarkNotification("alerts", {
 *   name: "Production Alerts",
 *   webhookUrl: "https://open.larksuite.com/open-apis/bot/v2/hook/...",
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class LarkNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly larkId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly webhookUrl!: pulumi.Output<string>;

  constructor(name: string, args: LarkNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(larkProvider, name, { notificationId: undefined, larkId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

interface TeamsProviderInputs extends NotificationEventFlags {
  name: string;
  webhookUrl: string;
}

const teamsProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: TeamsProviderInputs) {
    const client = getClient();
    const result = await client.notification.createTeams({
      name: inputs.name,
      webhookUrl: inputs.webhookUrl,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, teamsId: result.teamsId },
    };
  },

  async read(id: string, props: TeamsProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          webhookUrl: n.teams?.webhookUrl ?? props.webhookUrl,
          notificationId: n.notificationId,
          teamsId: n.teams?.teamsId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: TeamsProviderInputs) {
    const client = getClient();
    await client.notification.updateTeams({
      notificationId: id,
      teamsId: olds["teamsId"] as string,
      name: news.name,
      webhookUrl: news.webhookUrl,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, teamsId: olds["teamsId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface TeamsNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Microsoft Teams incoming webhook URL */
  webhookUrl: pulumi.Input<string>;
}

/**
 * A Microsoft Teams notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const teams = new dokploy.TeamsNotification("alerts", {
 *   name: "Production Alerts",
 *   webhookUrl: "https://outlook.office.com/webhook/...",
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class TeamsNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly teamsId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly webhookUrl!: pulumi.Output<string>;

  constructor(name: string, args: TeamsNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(teamsProvider, name, { notificationId: undefined, teamsId: undefined, ...args }, opts);
  }
}

// ---------------------------------------------------------------------------
// Pushover
// ---------------------------------------------------------------------------

interface PushoverProviderInputs extends NotificationEventFlags {
  name: string;
  userKey: string;
  apiToken: string;
  priority: number;
  retry: number | null;
  expire: number | null;
}

const pushoverProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: PushoverProviderInputs) {
    const client = getClient();
    const result = await client.notification.createPushover({
      name: inputs.name,
      userKey: inputs.userKey,
      apiToken: inputs.apiToken,
      priority: inputs.priority,
      retry: inputs.retry,
      expire: inputs.expire,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, pushoverId: result.pushoverId },
    };
  },

  async read(id: string, props: PushoverProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          userKey: n.pushover?.userKey ?? props.userKey,
          apiToken: n.pushover?.apiToken ?? props.apiToken,
          priority: n.pushover?.priority ?? props.priority,
          retry: n.pushover?.retry ?? props.retry,
          expire: n.pushover?.expire ?? props.expire,
          notificationId: n.notificationId,
          pushoverId: n.pushover?.pushoverId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: PushoverProviderInputs) {
    const client = getClient();
    await client.notification.updatePushover({
      notificationId: id,
      pushoverId: olds["pushoverId"] as string,
      name: news.name,
      userKey: news.userKey,
      apiToken: news.apiToken,
      priority: news.priority,
      retry: news.retry,
      expire: news.expire,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, pushoverId: olds["pushoverId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface PushoverNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Pushover user key */
  userKey: pulumi.Input<string>;
  /** Pushover application API token */
  apiToken: pulumi.Input<string>;
  /** Message priority (-2 to 2, default 0) */
  priority?: pulumi.Input<number>;
  /** Retry interval in seconds for emergency priority (>= 30, required when priority=2) */
  retry?: pulumi.Input<number | null>;
  /** Expiration time in seconds for emergency priority (1–10800, required when priority=2) */
  expire?: pulumi.Input<number | null>;
}

/**
 * A Pushover notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const pushover = new dokploy.PushoverNotification("alerts", {
 *   name: "Production Alerts",
 *   userKey: process.env.PUSHOVER_USER_KEY!,
 *   apiToken: process.env.PUSHOVER_API_TOKEN!,
 *   priority: 0,
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class PushoverNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly pushoverId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly userKey!: pulumi.Output<string>;
  public readonly apiToken!: pulumi.Output<string>;
  public readonly priority!: pulumi.Output<number>;
  public readonly retry!: pulumi.Output<number | null>;
  public readonly expire!: pulumi.Output<number | null>;

  constructor(name: string, args: PushoverNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(pushoverProvider, name, {
      notificationId: undefined,
      pushoverId: undefined,
      priority: 0,
      retry: null,
      expire: null,
      ...args,
    }, opts);
  }
}

// ---------------------------------------------------------------------------
// Resend
// ---------------------------------------------------------------------------

interface ResendProviderInputs extends NotificationEventFlags {
  name: string;
  apiKey: string;
  fromAddress: string;
  toAddresses: string[];
}

const resendProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ResendProviderInputs) {
    const client = getClient();
    const result = await client.notification.createResend({
      name: inputs.name,
      apiKey: inputs.apiKey,
      fromAddress: inputs.fromAddress,
      toAddresses: inputs.toAddresses,
      appBuildError: inputs.appBuildError,
      databaseBackup: inputs.databaseBackup,
      dokployBackup: inputs.dokployBackup,
      volumeBackup: inputs.volumeBackup,
      dokployRestart: inputs.dokployRestart,
      appDeploy: inputs.appDeploy,
      dockerCleanup: inputs.dockerCleanup,
      serverThreshold: inputs.serverThreshold,
    });

    return {
      id: result.notificationId,
      outs: { ...inputs, notificationId: result.notificationId, resendId: result.resendId },
    };
  },

  async read(id: string, props: ResendProviderInputs) {
    const client = getClient();
    try {
      const n = await client.notification.one({ notificationId: id });
      return {
        id,
        props: {
          name: n.name,
          appBuildError: n.appBuildError,
          databaseBackup: n.databaseBackup,
          dokployBackup: n.dokployBackup,
          volumeBackup: n.volumeBackup,
          dokployRestart: n.dokployRestart,
          appDeploy: n.appDeploy,
          dockerCleanup: n.dockerCleanup,
          serverThreshold: n.serverThreshold,
          apiKey: n.resend?.apiKey ?? props.apiKey,
          fromAddress: n.resend?.fromAddress ?? props.fromAddress,
          toAddresses: n.resend?.toAddresses ?? props.toAddresses,
          notificationId: n.notificationId,
          resendId: n.resend?.resendId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, olds: Record<string, unknown>, news: ResendProviderInputs) {
    const client = getClient();
    await client.notification.updateResend({
      notificationId: id,
      resendId: olds["resendId"] as string,
      name: news.name,
      apiKey: news.apiKey,
      fromAddress: news.fromAddress,
      toAddresses: news.toAddresses,
      appBuildError: news.appBuildError,
      databaseBackup: news.databaseBackup,
      dokployBackup: news.dokployBackup,
      volumeBackup: news.volumeBackup,
      dokployRestart: news.dokployRestart,
      appDeploy: news.appDeploy,
      dockerCleanup: news.dockerCleanup,
      serverThreshold: news.serverThreshold,
    });

    return {
      outs: { ...news, notificationId: id, resendId: olds["resendId"] },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.notification.remove({ notificationId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

export interface ResendNotificationArgs extends NotificationEventFlags {
  /** Display name for this notification */
  name: pulumi.Input<string>;
  /** Resend API key */
  apiKey: pulumi.Input<string>;
  /** Sender email address */
  fromAddress: pulumi.Input<string>;
  /** List of recipient email addresses */
  toAddresses: pulumi.Input<string[]>;
}

/**
 * A Resend email notification integration in Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const resend = new dokploy.ResendNotification("alerts", {
 *   name: "Production Alerts",
 *   apiKey: process.env.RESEND_API_KEY!,
 *   fromAddress: "alerts@example.com",
 *   toAddresses: ["ops@example.com"],
 *   appDeploy: true,
 *   appBuildError: true,
 *   databaseBackup: false,
 *   dokployBackup: false,
 *   volumeBackup: false,
 *   dokployRestart: true,
 *   dockerCleanup: false,
 *   serverThreshold: true,
 * });
 * ```
 */
export class ResendNotification extends pulumi.dynamic.Resource {
  public readonly notificationId!: pulumi.Output<string>;
  public readonly resendId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly apiKey!: pulumi.Output<string>;
  public readonly fromAddress!: pulumi.Output<string>;
  public readonly toAddresses!: pulumi.Output<string[]>;

  constructor(name: string, args: ResendNotificationArgs, opts?: pulumi.CustomResourceOptions) {
    super(resendProvider, name, { notificationId: undefined, resendId: undefined, ...args }, opts);
  }
}
