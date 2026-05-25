import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type ServerType = "deploy" | "build";

interface ServerProviderInputs {
  name: string;
  description: string;
  ipAddress: string;
  port: number;
  username: string;
  sshKeyId: string;
  serverType: ServerType;
}

const serverProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: ServerProviderInputs) {
    const client = getClient();

    const result = await client.server.create({
      name: inputs.name,
      description: inputs.description,
      ipAddress: inputs.ipAddress,
      port: inputs.port,
      username: inputs.username,
      sshKeyId: inputs.sshKeyId,
      serverType: inputs.serverType,
    });

    return {
      id: result.serverId,
      outs: { ...inputs, serverId: result.serverId },
    };
  },

  async read(id: string, props: ServerProviderInputs) {
    const client = getClient();
    try {
      const s = await client.server.one({ serverId: id });
      return {
        id,
        props: {
          name: s.name,
          description: s.description ?? "",
          ipAddress: s.ipAddress,
          port: s.port,
          username: s.username,
          sshKeyId: s.sshKeyId ?? "",
          serverType: s.serverType as ServerType,
          serverId: s.serverId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: ServerProviderInputs, news: ServerProviderInputs) {
    const client = getClient();
    await client.server.update({
      serverId: id,
      name: news.name,
      description: news.description,
      ipAddress: news.ipAddress,
      port: news.port,
      username: news.username,
      sshKeyId: news.sshKeyId,
      serverType: news.serverType,
    });

    return {
      outs: { ...news, serverId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.server.remove({ serverId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Server} resource.
 *
 * @example
 * ```ts
 * const server = new dokploy.Server("build-server", {
 *   name: "build-server",
 *   description: "Dedicated build server",
 *   ipAddress: "192.168.1.10",
 *   port: 22,
 *   username: "root",
 *   sshKeyId: sshKey.sshKeyId,
 *   serverType: "build",
 * });
 * ```
 */
export interface ServerArgs {
  /** Server name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Server description */
  description: pulumi.Input<string>;
  /** Server IP address */
  ipAddress: pulumi.Input<string>;
  /** SSH port (usually 22) */
  port: pulumi.Input<number>;
  /** SSH username */
  username: pulumi.Input<string>;
  /** SSH key ID used to authenticate */
  sshKeyId: pulumi.Input<string>;
  /** Server role: `"deploy"` or `"build"` */
  serverType: pulumi.Input<ServerType>;
}

/**
 * A remote server registered in Dokploy.
 *
 * Servers can be used to deploy services on remote machines (`"deploy"`)
 * or to offload image builds (`"build"`).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const server = new dokploy.Server("build-server", {
 *   name: "build-server",
 *   description: "Dedicated build server",
 *   ipAddress: "192.168.1.10",
 *   port: 22,
 *   username: "root",
 *   sshKeyId: sshKey.sshKeyId,
 *   serverType: "build",
 * });
 * ```
 */
export class Server extends pulumi.dynamic.Resource {
  /** The Dokploy server ID */
  declare public readonly serverId: pulumi.Output<string>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly description: pulumi.Output<string>;
  declare public readonly ipAddress: pulumi.Output<string>;
  declare public readonly port: pulumi.Output<number>;
  declare public readonly username: pulumi.Output<string>;
  declare public readonly sshKeyId: pulumi.Output<string>;
  declare public readonly serverType: pulumi.Output<ServerType>;

  constructor(name: string, args: ServerArgs, opts?: pulumi.CustomResourceOptions) {
    super(serverProvider, name, { serverId: undefined, ...args }, opts);
  }
}
