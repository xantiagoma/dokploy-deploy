import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface RedirectProviderInputs {
  regex: string;
  replacement: string;
  permanent: boolean;
  applicationId: string;
}

const redirectProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: RedirectProviderInputs) {
    const client = getClient();

    // redirects.create returns `true` — need to find the created redirect via application.one
    await client.redirects.create({
      regex: inputs.regex,
      replacement: inputs.replacement,
      permanent: inputs.permanent,
      applicationId: inputs.applicationId,
    });

    // Find the created redirect in the application's redirects array
    const app = await client.application.one({ applicationId: inputs.applicationId });
    const created = app.redirects.find((r) => r.regex === inputs.regex);
    if (!created) throw new Error(`Redirect "${inputs.regex}" not found after creation`);

    return {
      id: created.redirectId,
      outs: { ...inputs, redirectId: created.redirectId },
    };
  },

  async read(id: string, props: RedirectProviderInputs) {
    const client = getClient();
    try {
      const r = await client.redirects.one({ redirectId: id });
      return {
        id,
        props: {
          regex: r.regex,
          replacement: r.replacement,
          permanent: r.permanent,
          applicationId: r.applicationId,
          redirectId: r.redirectId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: RedirectProviderInputs, news: RedirectProviderInputs) {
    const client = getClient();
    await client.redirects.update({
      redirectId: id,
      regex: news.regex,
      replacement: news.replacement,
      permanent: news.permanent,
    });

    return {
      outs: { ...news, redirectId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.redirects.delete({ redirectId: id });
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
 * Arguments for creating a {@link Redirect} resource.
 *
 * @example
 * ```ts
 * const redirect = new dokploy.Redirect("www-redirect", {
 *   regex: "^https://www\\.example\\.com(.*)",
 *   replacement: "https://example.com$1",
 *   permanent: true,
 *   applicationId: app.applicationId,
 * });
 * ```
 */
export interface RedirectArgs {
  /** Regular expression to match the incoming URL */
  regex: pulumi.Input<string>;
  /** Replacement URL (supports capture group references like `$1`) */
  replacement: pulumi.Input<string>;
  /** Whether the redirect is permanent (301) or temporary (302) */
  permanent: pulumi.Input<boolean>;
  /** Application ID this redirect rule belongs to */
  applicationId: pulumi.Input<string>;
}

/**
 * A URL redirect rule for a Dokploy application.
 *
 * Changing `applicationId` triggers a replacement (delete + create).
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const wwwRedirect = new dokploy.Redirect("www-redirect", {
 *   regex: "^https://www\\.example\\.com(.*)",
 *   replacement: "https://example.com$1",
 *   permanent: true,
 *   applicationId: app.applicationId,
 * });
 * ```
 */
export class Redirect extends pulumi.dynamic.Resource {
  /** The Dokploy redirect rule ID */
  declare public readonly redirectId: pulumi.Output<string>;
  declare public readonly regex: pulumi.Output<string>;
  declare public readonly replacement: pulumi.Output<string>;
  declare public readonly permanent: pulumi.Output<boolean>;
  declare public readonly applicationId: pulumi.Output<string>;

  constructor(name: string, args: RedirectArgs, opts?: pulumi.CustomResourceOptions) {
    super(redirectProvider, name, { redirectId: undefined, ...args }, opts);
  }
}
