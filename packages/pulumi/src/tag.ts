import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";

interface TagProviderInputs {
  name: string;
  color?: string;
}

const tagProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: TagProviderInputs) {
    const client = getClient();

    const tag = await client.tag.create({
      name: inputs.name,
      color: inputs.color,
    });

    return {
      id: tag.tagId,
      outs: { ...inputs, tagId: tag.tagId },
    };
  },

  async read(id: string, props: TagProviderInputs) {
    const client = getClient();
    try {
      const tag = await client.tag.one({ tagId: id });
      return {
        id,
        props: {
          name: tag.name,
          color: tag.color ?? undefined,
          tagId: tag.tagId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(id: string, _olds: TagProviderInputs, news: TagProviderInputs) {
    const client = getClient();
    await client.tag.update({
      tagId: id,
      name: news.name,
      color: news.color,
    });

    return {
      outs: { ...news, tagId: id },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.tag.remove({ tagId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(_id: string, olds: Record<string, unknown>, news: Record<string, unknown>) {
    const { changes, replaces } = diffProps(olds, news, []);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Tag} resource.
 *
 * @example
 * ```ts
 * const tag = new dokploy.Tag("production-tag", {
 *   name: "production",
 *   color: "#ff0000",
 * });
 * ```
 */
export interface TagArgs {
  /** Tag name */
  name: pulumi.Input<string>;
  /** Optional tag color (CSS color string, e.g. `"#ff0000"`) */
  color?: pulumi.Input<string>;
}

/**
 * A project tag managed by Dokploy.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const tag = new dokploy.Tag("production-tag", {
 *   name: "production",
 *   color: "#ff0000",
 * });
 *
 * export const tagId = tag.tagId;
 * ```
 */
export class Tag extends pulumi.dynamic.Resource {
  /** The Dokploy tag ID */
  declare public readonly tagId: pulumi.Output<string>;
  declare public readonly name: pulumi.Output<string>;
  declare public readonly color: pulumi.Output<string | undefined>;

  constructor(name: string, args: TagArgs, opts?: pulumi.CustomResourceOptions) {
    super(tagProvider, name, { tagId: undefined, ...args }, opts);
  }
}
