import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";

/**
 * Arguments for the {@link DokployCertificate} component.
 *
 * @example
 * ```ts
 * const cert = new DokployCertificate("my-cert", {
 *   name: "my-cert",
 *   certificateData: config.requireSecret("certData"),
 *   privateKey: config.requireSecret("certPrivateKey"),
 *   organizationId: "org-id",
 *   autoRenew: true,
 * });
 * ```
 */
export interface DokployCertificateArgs {
  /** Certificate name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** PEM-encoded certificate data (secret — not returned by the API on read) */
  certificateData: pulumi.Input<string>;
  /** PEM-encoded private key (secret — not returned by the API on read) */
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
 * High-level component that registers an SSL certificate in Dokploy.
 *
 * `privateKey` and `certificateData` are secrets — they are not returned by the API
 * on read and are preserved from Pulumi state. Changing `organizationId` triggers a
 * replacement (delete + create).
 *
 * @example
 * ```ts
 * import { DokployCertificate } from "@xantiagoma/dokploy-sst";
 *
 * const cert = new DokployCertificate("my-cert", {
 *   name: "my-cert",
 *   certificateData: config.requireSecret("certData"),
 *   privateKey: config.requireSecret("certPrivateKey"),
 *   organizationId: "org-id",
 *   autoRenew: true,
 * });
 *
 * export const certificateId = cert.certificateId;
 * ```
 */
export class DokployCertificate extends pulumi.ComponentResource {
  /** The underlying Certificate resource */
  public readonly certificate: dokploy.Certificate;
  /** The Dokploy certificate ID */
  public readonly certificateId: pulumi.Output<string>;

  constructor(name: string, args: DokployCertificateArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployCertificate", name, {}, opts);

    this.certificate = new dokploy.Certificate(
      `${name}-certificate`,
      {
        name: args.name,
        certificateData: args.certificateData,
        privateKey: args.privateKey,
        organizationId: args.organizationId,
        certificatePath: args.certificatePath,
        autoRenew: args.autoRenew,
        serverId: args.serverId,
      },
      { parent: this },
    );

    this.certificateId = this.certificate.certificateId;

    this.registerOutputs({ certificateId: this.certificateId });
  }
}
