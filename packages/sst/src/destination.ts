import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/**
 * Arguments for the {@link DokployDestination} component.
 *
 * @example
 * ```ts
 * const destination = new DokployDestination("backups", {
 *   name: "backups",
 *   provider: "cloudflare",
 *   accessKey: "access-key-id",
 *   secretAccessKey: config.requireSecret("r2SecretKey"),
 *   bucket: "my-backups",
 *   region: "auto",
 *   endpoint: "https://<account-id>.r2.cloudflarestorage.com",
 *   additionalFlags: [],
 * });
 * ```
 */
export interface DokployDestinationArgs {
  /** Destination name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** Storage provider (e.g. `"aws"`, `"cloudflare"`, `"minio"`) */
  provider: pulumi.Input<string>;
  /** S3 access key ID */
  accessKey: pulumi.Input<string>;
  /** S3 bucket name */
  bucket: pulumi.Input<string>;
  /** S3 region */
  region: pulumi.Input<string>;
  /** S3-compatible endpoint URL */
  endpoint: pulumi.Input<string>;
  /** S3 secret access key (write-only — not returned by the API on read) */
  secretAccessKey: pulumi.Input<string>;
  /** Additional flags passed to the backup tool */
  additionalFlags: pulumi.Input<string[]>;
}

/**
 * High-level component that creates an S3-compatible backup destination in Dokploy.
 *
 * Destinations are S3-compatible storage targets used for database backups.
 * The `secretAccessKey` is write-only and not returned by the API on read.
 *
 * @example
 * ```ts
 * import { DokployDestination } from "@xantiagoma/dokploy-sst";
 *
 * const destination = new DokployDestination("backups", {
 *   name: "backups",
 *   provider: "cloudflare",
 *   accessKey: "access-key-id",
 *   secretAccessKey: config.requireSecret("r2SecretKey"),
 *   bucket: "my-backups",
 *   region: "auto",
 *   endpoint: "https://<account-id>.r2.cloudflarestorage.com",
 *   additionalFlags: [],
 * });
 *
 * export const destinationId = destination.destinationId;
 * ```
 */
export class DokployDestination extends pulumi.ComponentResource {
  /** The underlying Destination resource */
  public readonly destination: dokploy.Destination;
  /** The Dokploy destination ID */
  public readonly destinationId: pulumi.Output<string>;

  constructor(name: string, args: DokployDestinationArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployDestination", name, {}, opts);

    this.destination = new dokploy.Destination(
      `${name}-destination`,
      {
        name: args.name,
        provider: args.provider,
        accessKey: args.accessKey,
        bucket: args.bucket,
        region: args.region,
        endpoint: args.endpoint,
        secretAccessKey: args.secretAccessKey,
        additionalFlags: args.additionalFlags,
      },
      { parent: this },
    );

    this.destinationId = this.destination.destinationId;

    this.registerOutputs({ destinationId: this.destinationId });
  }
}
