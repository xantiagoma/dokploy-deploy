import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/**
 * Arguments for the {@link DokployServer} component.
 *
 * @example
 * ```ts
 * const server = new DokployServer("build-server", {
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
export interface DokployServerArgs {
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
  serverType: pulumi.Input<"deploy" | "build">;
}

/**
 * High-level component that registers a remote server in Dokploy.
 *
 * Servers can be used to deploy services on remote machines (`"deploy"`)
 * or to offload image builds (`"build"`).
 *
 * @example
 * ```ts
 * import { DokployServer } from "@xantiagoma/dokploy-sst";
 *
 * const server = new DokployServer("build-server", {
 *   name: "build-server",
 *   description: "Dedicated build server",
 *   ipAddress: "192.168.1.10",
 *   port: 22,
 *   username: "root",
 *   sshKeyId: sshKey.sshKeyId,
 *   serverType: "build",
 * });
 *
 * export const serverId = server.serverId;
 * ```
 */
export class DokployServer extends pulumi.ComponentResource {
  /** The underlying Server resource */
  public readonly server: dokploy.Server;
  /** The Dokploy server ID */
  public readonly serverId: pulumi.Output<string>;

  constructor(name: string, args: DokployServerArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployServer", name, {}, opts);

    this.server = new dokploy.Server(
      `${name}-server`,
      {
        name: args.name,
        description: args.description,
        ipAddress: args.ipAddress,
        port: args.port,
        username: args.username,
        sshKeyId: args.sshKeyId,
        serverType: args.serverType,
      },
      { parent: this },
    );

    this.serverId = this.server.serverId;

    this.registerOutputs({ serverId: this.serverId });
  }
}
