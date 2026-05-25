import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface RegistryProviderInputs {
  registryName: string;
  username: string;
  password: string;
  registryUrl: string;
  registryType: "cloud";
  imagePrefix: string;
}

const registryProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: RegistryProviderInputs) {
    const client = getClient();

    const result = await client.registry.create({
      registryName: inputs.registryName,
      username: inputs.username,
      password: inputs.password,
      registryUrl: inputs.registryUrl,
      registryType: inputs.registryType,
      imagePrefix: inputs.imagePrefix,
    });

    return {
      id: result.registryId,
      outs: { ...inputs, registryId: result.registryId },
    };
  },

  async read(id: string, props: RegistryProviderInputs) {
    const client = getClient();
    try {
      const r = await client.registry.one({ registryId: id });
      return {
        id,
        props: {
          registryName: r.registryName,
          username: r.username,
          // password is write-only — not returned by the API
          password: props.password,
          registryUrl: r.registryUrl,
          registryType: r.registryType as "cloud",
          imagePrefix: r.imagePrefix ?? "",
          registryId: r.registryId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: RegistryProviderInputs, news: RegistryProviderInputs) {
    const client = getClient();
    await client.registry.update({
      registryId: id,
      registryName: news.registryName,
      username: news.username,
      password: news.password,
      registryUrl: news.registryUrl,
      registryType: news.registryType,
      imagePrefix: news.imagePrefix,
    });

    return {
      outs: { ...news, registryId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.registry.remove({ registryId: id });
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
 * Arguments for creating a {@link Registry} resource.
 *
 * @example
 * ```ts
 * const registry = new dokploy.Registry("ghcr", {
 *   registryName: "GitHub Container Registry",
 *   username: "myorg",
 *   password: config.requireSecret("ghcrToken"),
 *   registryUrl: "ghcr.io",
 *   registryType: "cloud",
 *   imagePrefix: "myorg",
 * });
 * ```
 */
export interface RegistryArgs {
  /** Registry name displayed in the Dokploy dashboard */
  registryName: pulumi.Input<string>;
  /** Registry username */
  username: pulumi.Input<string>;
  /** Registry password or token */
  password: pulumi.Input<string>;
  /** Registry URL (e.g. `"ghcr.io"`, `"registry.hub.docker.com"`) */
  registryUrl: pulumi.Input<string>;
  /** Registry type (currently only `"cloud"` is supported) */
  registryType: pulumi.Input<"cloud">;
  /** Image prefix / namespace (e.g. `"myorg"`) */
  imagePrefix: pulumi.Input<string>;
}

/**
 * A Docker registry configured in Dokploy for pulling private images.
 *
 * The `password` field is write-only and not returned by the API on read.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const registry = new dokploy.Registry("ghcr", {
 *   registryName: "GitHub Container Registry",
 *   username: "myorg",
 *   password: config.requireSecret("ghcrToken"),
 *   registryUrl: "ghcr.io",
 *   registryType: "cloud",
 *   imagePrefix: "myorg",
 * });
 * ```
 */
export class Registry extends pulumi.dynamic.Resource {
  /** The Dokploy registry ID */
  public readonly registryId!: pulumi.Output<string>;
  public readonly registryName!: pulumi.Output<string>;
  public readonly username!: pulumi.Output<string>;
  public readonly registryUrl!: pulumi.Output<string>;
  public readonly registryType!: pulumi.Output<"cloud">;
  public readonly imagePrefix!: pulumi.Output<string>;

  constructor(name: string, args: RegistryArgs, opts?: pulumi.CustomResourceOptions) {
    super(registryProvider, name, { registryId: undefined, ...args }, opts);
  }
}
