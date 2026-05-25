import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface CertificateProviderInputs {
  name: string;
  certificateData: string;
  privateKey: string;
  organizationId: string;
  certificatePath?: string;
  autoRenew?: boolean;
  serverId?: string;
}

const certificateProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: CertificateProviderInputs) {
    const client = getClient();

    const result = await client.certificates.create({
      name: inputs.name,
      certificateData: inputs.certificateData,
      privateKey: inputs.privateKey,
      organizationId: inputs.organizationId,
      certificatePath: inputs.certificatePath,
      autoRenew: inputs.autoRenew,
      serverId: inputs.serverId,
    });

    return {
      id: result.certificateId,
      outs: { ...inputs, certificateId: result.certificateId },
    };
  },

  async read(id: string, props: CertificateProviderInputs) {
    const client = getClient();
    try {
      const c = await client.certificates.one({ certificateId: id });
      return {
        id,
        props: {
          name: c.name,
          // privateKey and certificateData are secrets — not returned by the API; preserve from state
          privateKey: props.privateKey,
          certificateData: props.certificateData,
          organizationId: c.organizationId,
          certificatePath: c.certificatePath ?? undefined,
          autoRenew: c.autoRenew ?? undefined,
          serverId: c.serverId ?? undefined,
          certificateId: c.certificateId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: CertificateProviderInputs, news: CertificateProviderInputs) {
    const client = getClient();
    await client.certificates.update({
      certificateId: id,
      name: news.name,
      certificateData: news.certificateData,
      privateKey: news.privateKey,
    });

    return {
      outs: { ...news, certificateId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.certificates.remove({ certificateId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, ["organizationId"]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Certificate} resource.
 *
 * @example
 * ```ts
 * const cert = new dokploy.Certificate("my-cert", {
 *   name: "my-cert",
 *   certificateData: config.requireSecret("certData"),
 *   privateKey: config.requireSecret("certPrivateKey"),
 *   organizationId: "org-id",
 * });
 * ```
 */
export interface CertificateArgs {
  /** Certificate name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** PEM-encoded certificate data (secret) */
  certificateData: pulumi.Input<string>;
  /** PEM-encoded private key (secret) */
  privateKey: pulumi.Input<string>;
  /** Organization ID this certificate belongs to */
  organizationId: pulumi.Input<string>;
  /** Path where the certificate is stored on the server */
  certificatePath?: pulumi.Input<string>;
  /** Whether to auto-renew the certificate */
  autoRenew?: pulumi.Input<boolean>;
  /** Server ID to associate with the certificate */
  serverId?: pulumi.Input<string>;
}

/**
 * An SSL certificate registered in Dokploy.
 *
 * `privateKey` and `certificateData` are secrets — they are not returned by the API on read
 * and are preserved from state. Changing `organizationId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const cert = new dokploy.Certificate("my-cert", {
 *   name: "my-cert",
 *   certificateData: config.requireSecret("certData"),
 *   privateKey: config.requireSecret("certPrivateKey"),
 *   organizationId: "org-id",
 *   autoRenew: true,
 * });
 * ```
 */
export class Certificate extends pulumi.dynamic.Resource {
  /** The Dokploy certificate ID */
  declare public readonly certificateId: pulumi.Output<string>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly organizationId: pulumi.Output<string>;
  declare public readonly certificatePath: pulumi.Output<string | undefined>;
  declare public readonly autoRenew: pulumi.Output<boolean | undefined>;
  declare public readonly serverId: pulumi.Output<string | undefined>;

  constructor(name: string, args: CertificateArgs, opts?: pulumi.CustomResourceOptions) {
    super(certificateProvider, name, { certificateId: undefined, ...args }, opts);
  }
}
