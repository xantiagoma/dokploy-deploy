import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type PublishMode = "ingress" | "host";
type Protocol = "tcp" | "udp";

interface PortProviderInputs {
  publishedPort: number;
  publishMode: PublishMode;
  targetPort: number;
  protocol: Protocol;
  applicationId: string;
}

const portProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: PortProviderInputs) {
    const client = getClient();

    const port = await client.port.create({
      publishedPort: inputs.publishedPort,
      publishMode: inputs.publishMode,
      targetPort: inputs.targetPort,
      protocol: inputs.protocol,
      applicationId: inputs.applicationId,
    });

    return {
      id: port.portId,
      outs: { ...inputs, portId: port.portId },
    };
  },

  async read(id: string, props: PortProviderInputs) {
    const client = getClient();
    try {
      const p = await client.port.one({ portId: id });
      return {
        id,
        props: {
          publishedPort: p.publishedPort,
          publishMode: p.publishMode,
          targetPort: p.targetPort,
          protocol: p.protocol,
          applicationId: p.applicationId,
          portId: p.portId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: PortProviderInputs, news: PortProviderInputs) {
    const client = getClient();
    await client.port.update({
      portId: id,
      publishedPort: news.publishedPort,
      publishMode: news.publishMode,
      targetPort: news.targetPort,
      protocol: news.protocol,
    });

    return {
      outs: { ...news, portId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.port.delete({ portId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["applicationId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Port} resource.
 *
 * @example
 * ```ts
 * const port = new dokploy.Port("http-port", {
 *   publishedPort: 80,
 *   publishMode: "ingress",
 *   targetPort: 3000,
 *   protocol: "tcp",
 *   applicationId: app.applicationId,
 * });
 * ```
 */
export interface PortArgs {
  /** Host port to publish */
  publishedPort: pulumi.Input<number>;
  /** Publish mode: `"ingress"` (load-balanced) or `"host"` (direct) */
  publishMode: pulumi.Input<PublishMode>;
  /** Container port to forward to */
  targetPort: pulumi.Input<number>;
  /** Network protocol: `"tcp"` or `"udp"` */
  protocol: pulumi.Input<Protocol>;
  /** Application ID this port mapping belongs to */
  applicationId: pulumi.Input<string>;
}

/**
 * A port mapping for a Dokploy application service.
 *
 * Changing `applicationId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const apiPort = new dokploy.Port("api-port", {
 *   publishedPort: 8080,
 *   publishMode: "ingress",
 *   targetPort: 8080,
 *   protocol: "tcp",
 *   applicationId: app.applicationId,
 * });
 * ```
 */
export class Port extends pulumi.dynamic.Resource {
  /** The Dokploy port ID */
  public readonly portId!: pulumi.Output<string>;
  public readonly publishedPort!: pulumi.Output<number>;
  public readonly publishMode!: pulumi.Output<PublishMode>;
  public readonly targetPort!: pulumi.Output<number>;
  public readonly protocol!: pulumi.Output<Protocol>;
  public readonly applicationId!: pulumi.Output<string>;

  constructor(name: string, args: PortArgs, opts?: pulumi.CustomResourceOptions) {
    super(portProvider, name, { portId: undefined, ...args }, opts);
  }
}
