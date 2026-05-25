import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/**
 * Arguments for the {@link DokployRegistry} component.
 *
 * @example
 * ```ts
 * const registry = new DokployRegistry("ghcr", {
 *   registryName: "GitHub Container Registry",
 *   username: "myorg",
 *   password: config.requireSecret("ghcrToken"),
 *   registryUrl: "ghcr.io",
 *   registryType: "cloud",
 *   imagePrefix: "myorg",
 * });
 * ```
 */
export interface DokployRegistryArgs {
  /** Registry name displayed in the Dokploy dashboard */
  registryName: pulumi.Input<string>;
  /** Registry username */
  username: pulumi.Input<string>;
  /** Registry password or token (write-only — not returned by the API on read) */
  password: pulumi.Input<string>;
  /** Registry URL (e.g. `"ghcr.io"`, `"registry.hub.docker.com"`) */
  registryUrl: pulumi.Input<string>;
  /** Registry type (currently only `"cloud"` is supported) */
  registryType: pulumi.Input<"cloud">;
  /** Image prefix / namespace (e.g. `"myorg"`) */
  imagePrefix: pulumi.Input<string>;
}

/**
 * High-level component that configures a Docker registry in Dokploy for pulling private images.
 *
 * The `password` field is write-only and not returned by the API on read.
 *
 * @example
 * ```ts
 * import { DokployRegistry } from "@xantiagoma/dokploy-sst";
 *
 * const registry = new DokployRegistry("ghcr", {
 *   registryName: "GitHub Container Registry",
 *   username: "myorg",
 *   password: config.requireSecret("ghcrToken"),
 *   registryUrl: "ghcr.io",
 *   registryType: "cloud",
 *   imagePrefix: "myorg",
 * });
 *
 * export const registryId = registry.registryId;
 * ```
 */
export class DokployRegistry extends pulumi.ComponentResource {
  /** The underlying Registry resource */
  public readonly registry: dokploy.Registry;
  /** The Dokploy registry ID */
  public readonly registryId: pulumi.Output<string>;

  constructor(name: string, args: DokployRegistryArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployRegistry", name, {}, opts);

    this.registry = new dokploy.Registry(
      `${name}-registry`,
      {
        registryName: args.registryName,
        username: args.username,
        password: args.password,
        registryUrl: args.registryUrl,
        registryType: args.registryType,
        imagePrefix: args.imagePrefix,
      },
      { parent: this },
    );

    this.registryId = this.registry.registryId;

    this.registerOutputs({ registryId: this.registryId });
  }
}
