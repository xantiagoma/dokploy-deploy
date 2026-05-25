import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

type MountType = "bind" | "volume" | "file";
type ServiceType =
  | "application"
  | "postgres"
  | "mysql"
  | "mariadb"
  | "mongo"
  | "redis"
  | "compose"
  | "libsql";

interface MountProviderInputs {
  type: MountType;
  mountPath: string;
  serviceId: string;
  content?: string;
  filePath?: string;
  hostPath?: string;
  volumeName?: string;
  serviceType?: ServiceType;
}

const mountProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: MountProviderInputs) {
    const client = getClient();

    const mount = await client.mounts.create({
      type: inputs.type,
      mountPath: inputs.mountPath,
      serviceId: inputs.serviceId,
      content: inputs.content,
      filePath: inputs.filePath,
      hostPath: inputs.hostPath,
      volumeName: inputs.volumeName,
      serviceType: inputs.serviceType,
    });

    return {
      id: mount.mountId,
      outs: { ...inputs, mountId: mount.mountId },
    };
  },

  async read(id: string, props: MountProviderInputs) {
    const client = getClient();
    try {
      const m = await client.mounts.one({ mountId: id });
      return {
        id,
        props: {
          type: m.type,
          mountPath: m.mountPath,
          serviceId: m.serviceId,
          content: m.content ?? undefined,
          filePath: m.filePath ?? undefined,
          hostPath: m.hostPath ?? undefined,
          volumeName: m.volumeName ?? undefined,
          serviceType: m.serviceType ?? undefined,
          mountId: m.mountId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: MountProviderInputs, news: MountProviderInputs) {
    const client = getClient();
    await client.mounts.update({
      mountId: id,
      type: news.type,
      mountPath: news.mountPath,
      content: news.content,
      filePath: news.filePath,
      hostPath: news.hostPath,
      volumeName: news.volumeName,
    });

    return {
      outs: { ...news, mountId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.mounts.remove({ mountId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["serviceId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Mount} resource.
 *
 * @example
 * ```ts
 * const mount = new dokploy.Mount("data-volume", {
 *   type: "volume",
 *   mountPath: "/data",
 *   serviceId: compose.composeId,
 *   serviceType: "compose",
 *   volumeName: "myapp_data",
 * });
 * ```
 */
export interface MountArgs {
  /** Mount type: `"bind"`, `"volume"`, or `"file"` */
  type: pulumi.Input<MountType>;
  /** Container path where the mount is attached */
  mountPath: pulumi.Input<string>;
  /** ID of the service this mount belongs to */
  serviceId: pulumi.Input<string>;
  /** File content (for `type: "file"` mounts) */
  content?: pulumi.Input<string>;
  /** Path to the file inside the container (for `type: "file"` mounts) */
  filePath?: pulumi.Input<string>;
  /** Host path (for `type: "bind"` mounts) */
  hostPath?: pulumi.Input<string>;
  /** Docker volume name (for `type: "volume"` mounts) */
  volumeName?: pulumi.Input<string>;
  /** Service type: `"application"`, `"postgres"`, `"mysql"`, `"mariadb"`, `"mongo"`, `"redis"`, `"compose"`, or `"libsql"` */
  serviceType?: pulumi.Input<ServiceType>;
}

/**
 * A volume/bind/file mount attached to a Dokploy service.
 *
 * Changing `serviceId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const configMount = new dokploy.Mount("app-config", {
 *   type: "file",
 *   mountPath: "/app/config.json",
 *   serviceId: compose.composeId,
 *   serviceType: "compose",
 *   content: JSON.stringify({ key: "value" }),
 * });
 * ```
 */
export class Mount extends pulumi.dynamic.Resource {
  /** The Dokploy mount ID */
  declare public readonly mountId: pulumi.Output<string>;
  declare public readonly type: pulumi.Output<MountType>;
  declare public readonly mountPath: pulumi.Output<string>;
  declare public readonly serviceId: pulumi.Output<string>;
  declare public readonly content: pulumi.Output<string | undefined>;
  declare public readonly filePath: pulumi.Output<string | undefined>;
  declare public readonly hostPath: pulumi.Output<string | undefined>;
  declare public readonly volumeName: pulumi.Output<string | undefined>;
  declare public readonly serviceType: pulumi.Output<ServiceType | undefined>;

  constructor(name: string, args: MountArgs, opts?: pulumi.CustomResourceOptions) {
    super(mountProvider, name, { mountId: undefined, ...args }, opts);
  }
}
