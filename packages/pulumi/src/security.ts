import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface SecurityProviderInputs {
  applicationId: string;
  username: string;
  password: string;
}

const securityProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: SecurityProviderInputs) {
    const client = getClient();

    // security.create returns `true` — need to find the created entry via application.one
    await client.security.create({
      applicationId: inputs.applicationId,
      username: inputs.username,
      password: inputs.password,
    });

    const app = await client.application.one({ applicationId: inputs.applicationId });
    const created = app.security.find((s) => s.username === inputs.username);
    if (!created) throw new Error(`Security entry for "${inputs.username}" not found after creation`);

    return {
      id: created.securityId,
      outs: { ...inputs, securityId: created.securityId },
    };
  },

  async read(id: string, props: SecurityProviderInputs) {
    const client = getClient();
    try {
      const s = await client.security.one({ securityId: id });
      return {
        id,
        props: {
          applicationId: s.applicationId,
          username: s.username,
          // password is a secret — not returned by the API; preserve from state
          password: props.password,
          securityId: s.securityId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: SecurityProviderInputs, news: SecurityProviderInputs) {
    const client = getClient();
    await client.security.update({
      securityId: id,
      username: news.username,
      password: news.password,
    });

    return {
      outs: { ...news, securityId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.security.delete({ securityId: id });
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
 * Arguments for creating a {@link Security} resource.
 *
 * @example
 * ```ts
 * const auth = new dokploy.Security("basic-auth", {
 *   applicationId: app.applicationId,
 *   username: "admin",
 *   password: config.requireSecret("basicAuthPassword"),
 * });
 * ```
 */
export interface SecurityArgs {
  /** Application ID this basic auth rule belongs to */
  applicationId: pulumi.Input<string>;
  /** Basic auth username */
  username: pulumi.Input<string>;
  /** Basic auth password (secret) */
  password: pulumi.Input<string>;
}

/**
 * A basic authentication security rule for a Dokploy application.
 *
 * `password` is a secret — it is not returned by the API on read and is preserved from state.
 * Changing `applicationId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const basicAuth = new dokploy.Security("basic-auth", {
 *   applicationId: app.applicationId,
 *   username: "admin",
 *   password: config.requireSecret("basicAuthPassword"),
 * });
 * ```
 */
export class Security extends pulumi.dynamic.Resource {
  /** The Dokploy security rule ID */
  declare public readonly securityId: pulumi.Output<string>;
  declare public readonly applicationId: pulumi.Output<string>;
  declare public readonly username: pulumi.Output<string>;

  constructor(name: string, args: SecurityArgs, opts?: pulumi.CustomResourceOptions) {
    super(securityProvider, name, { securityId: undefined, ...args }, opts);
  }
}
