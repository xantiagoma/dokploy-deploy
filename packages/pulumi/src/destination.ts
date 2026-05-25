import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface DestinationProviderInputs {
  name: string;
  provider: string;
  accessKey: string;
  bucket: string;
  region: string;
  endpoint: string;
  secretAccessKey: string;
  additionalFlags: string[];
}

const destinationProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: DestinationProviderInputs) {
    const client = getClient();

    const result = await client.destination.create({
      name: inputs.name,
      provider: inputs.provider,
      accessKey: inputs.accessKey,
      bucket: inputs.bucket,
      region: inputs.region,
      endpoint: inputs.endpoint,
      secretAccessKey: inputs.secretAccessKey,
      additionalFlags: inputs.additionalFlags,
    });

    return {
      id: result.destinationId,
      outs: { ...inputs, destinationId: result.destinationId },
    };
  },

  async read(id: string, props: DestinationProviderInputs) {
    const client = getClient();
    try {
      const d = await client.destination.one({ destinationId: id });
      return {
        id,
        props: {
          name: d.name,
          provider: d.provider ?? "",
          accessKey: d.accessKey,
          bucket: d.bucket,
          region: d.region,
          endpoint: d.endpoint,
          // secretAccessKey is write-only — not returned by the API
          secretAccessKey: props.secretAccessKey,
          additionalFlags: d.additionalFlags ?? [],
          destinationId: d.destinationId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: DestinationProviderInputs, news: DestinationProviderInputs) {
    const client = getClient();
    await client.destination.update({
      destinationId: id,
      name: news.name,
      provider: news.provider,
      accessKey: news.accessKey,
      bucket: news.bucket,
      region: news.region,
      endpoint: news.endpoint,
      secretAccessKey: news.secretAccessKey,
      additionalFlags: news.additionalFlags,
    });

    return {
      outs: { ...news, destinationId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.destination.remove({ destinationId: id });
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
 * Arguments for creating a {@link Destination} resource.
 *
 * @example
 * ```ts
 * const dest = new dokploy.Destination("backups", {
 *   name: "backups",
 *   provider: "aws",
 *   accessKey: "AKIAIOSFODNN7EXAMPLE",
 *   secretAccessKey: config.requireSecret("awsSecretKey"),
 *   bucket: "my-backups",
 *   region: "us-east-1",
 *   endpoint: "https://s3.amazonaws.com",
 *   additionalFlags: [],
 * });
 * ```
 */
export interface DestinationArgs {
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
  /** S3 secret access key */
  secretAccessKey: pulumi.Input<string>;
  /** Additional flags passed to the backup tool */
  additionalFlags: pulumi.Input<string[]>;
}

/**
 * An S3-compatible backup destination in Dokploy.
 *
 * Destinations are S3-compatible storage targets used for database backups.
 * The `secretAccessKey` is write-only and not returned by the API on read.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const destination = new dokploy.Destination("backups", {
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
export class Destination extends pulumi.dynamic.Resource {
  /** The Dokploy destination ID */
  declare public readonly destinationId: pulumi.Output<string>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly provider: pulumi.Output<string>;
  declare public readonly accessKey: pulumi.Output<string>;
  declare public readonly bucket: pulumi.Output<string>;
  declare public readonly region: pulumi.Output<string>;
  declare public readonly endpoint: pulumi.Output<string>;
  declare public readonly additionalFlags: pulumi.Output<string[]>;

  constructor(name: string, args: DestinationArgs, opts?: pulumi.CustomResourceOptions) {
    super(destinationProvider, name, { destinationId: undefined, ...args }, opts);
  }
}
