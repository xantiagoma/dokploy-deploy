import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface SshKeyProviderInputs {
  name: string;
  privateKey: string;
  publicKey: string;
  organizationId: string;
  description?: string;
}

const sshKeyProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: SshKeyProviderInputs) {
    const client = getClient();

    // sshKey.create returns void — need to find the key by listing all
    await client.sshKey.create({
      name: inputs.name,
      privateKey: inputs.privateKey,
      publicKey: inputs.publicKey,
      organizationId: inputs.organizationId,
      description: inputs.description ?? null,
    });

    // Find the created key by name (it was just created)
    const allKeys = await client.sshKey.all();
    const created = allKeys.find((k) => k.name === inputs.name);
    if (!created) throw new Error(`SSH key "${inputs.name}" not found after creation`);

    return {
      id: created.sshKeyId,
      outs: { ...inputs, sshKeyId: created.sshKeyId },
    };
  },

  async read(id: string, props: SshKeyProviderInputs) {
    const client = getClient();
    try {
      const k = await client.sshKey.one({ sshKeyId: id });
      return {
        id,
        props: {
          name: k.name,
          // privateKey is write-only — not returned by the API
          privateKey: props.privateKey,
          publicKey: k.publicKey,
          organizationId: k.organizationId,
          description: k.description ?? undefined,
          sshKeyId: k.sshKeyId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: SshKeyProviderInputs, news: SshKeyProviderInputs) {
    const client = getClient();
    await client.sshKey.update({
      sshKeyId: id,
      name: news.name,
      description: news.description ?? null,
    });

    return {
      outs: { ...news, sshKeyId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.sshKey.remove({ sshKeyId: id });
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
 * Arguments for creating an {@link SshKey} resource.
 *
 * @example
 * ```ts
 * const key = new dokploy.SshKey("deploy-key", {
 *   name: "deploy-key",
 *   privateKey: "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
 *   publicKey: "ssh-ed25519 AAAA...",
 *   organizationId: "org-id",
 * });
 * ```
 */
export interface SshKeyArgs {
  /** Key name displayed in the Dokploy dashboard */
  name: pulumi.Input<string>;
  /** PEM-encoded private key */
  privateKey: pulumi.Input<string>;
  /** Public key string */
  publicKey: pulumi.Input<string>;
  /** Organization ID this key belongs to */
  organizationId: pulumi.Input<string>;
  /** Optional key description */
  description?: pulumi.Input<string>;
}

/**
 * An SSH key registered in Dokploy for authenticating to remote servers.
 *
 * The private key is write-only — it is not returned by the API on read.
 * Changing `organizationId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const sshKey = new dokploy.SshKey("deploy-key", {
 *   name: "deploy-key",
 *   privateKey: config.requireSecret("sshPrivateKey"),
 *   publicKey: "ssh-ed25519 AAAA...",
 *   organizationId: "org-id",
 * });
 *
 * const server = new dokploy.Server("build-server", {
 *   name: "build-server",
 *   description: "Build server",
 *   ipAddress: "10.0.0.1",
 *   port: 22,
 *   username: "root",
 *   sshKeyId: sshKey.sshKeyId,
 *   serverType: "build",
 * });
 * ```
 */
export class SshKey extends pulumi.dynamic.Resource {
  /** The Dokploy SSH key ID */
  public readonly sshKeyId!: pulumi.Output<string>;
  public readonly name!: pulumi.Output<string>;
  public readonly publicKey!: pulumi.Output<string>;
  public readonly organizationId!: pulumi.Output<string>;
  public readonly description!: pulumi.Output<string | undefined>;

  constructor(name: string, args: SshKeyArgs, opts?: pulumi.CustomResourceOptions) {
    super(sshKeyProvider, name, { sshKeyId: undefined, ...args }, opts);
  }
}
