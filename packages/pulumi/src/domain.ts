import * as pulumi from "@pulumi/pulumi";
import { getClient, diffProps } from "./provider-utils.ts";
import type { CertificateType } from "@xantiagoma/dokploy-api";

interface DomainProviderInputs {
  host: string;
  path?: string;
  port?: number;
  https?: boolean;
  certificateType?: CertificateType;
  serviceName?: string;
  domainType?: string;
  applicationId?: string;
  composeId?: string;
}

const domainProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: DomainProviderInputs) {
    const client = getClient();
    const domain = await client.domain.create({
      host: inputs.host,
      path: inputs.path,
      port: inputs.port,
      https: inputs.https,
      certificateType: inputs.certificateType,
      serviceName: inputs.serviceName,
      domainType: inputs.domainType,
      applicationId: inputs.applicationId,
      composeId: inputs.composeId,
    });

    return {
      id: domain.domainId,
      outs: {
        ...inputs,
        domainId: domain.domainId,
      },
    };
  },

  async read(id: string, props: DomainProviderInputs) {
    const client = getClient();
    try {
      const domain = await client.domain.one({ domainId: id });
      return {
        id,
        props: {
          host: domain.host,
          path: domain.path ?? undefined,
          port: domain.port ?? undefined,
          https: domain.https,
          certificateType: domain.certificateType,
          serviceName: domain.serviceName ?? undefined,
          domainType: domain.domainType ?? undefined,
          applicationId: domain.applicationId ?? undefined,
          composeId: domain.composeId ?? undefined,
          domainId: domain.domainId,
        },
      };
    } catch {
      return { id, props };
    }
  },

  async update(
    id: string,
    _olds: DomainProviderInputs,
    news: DomainProviderInputs,
  ) {
    const client = getClient();
    await client.domain.update({
      domainId: id,
      host: news.host,
      path: news.path,
      port: news.port,
      https: news.https,
      certificateType: news.certificateType,
      serviceName: news.serviceName,
      domainType: news.domainType,
    });

    return {
      outs: {
        ...news,
        domainId: id,
      },
    };
  },

  async delete(id: string) {
    const client = getClient();
    try {
      await client.domain.delete({ domainId: id });
    } catch {
      // Already deleted
    }
  },

  async diff(
    _id: string,
    olds: Record<string, unknown>,
    news: Record<string, unknown>,
  ) {
    const { changes, replaces } = diffProps(olds, news, [
      "applicationId",
      "composeId",
    ]);
    return { changes, replaces, deleteBeforeReplace: true };
  },
};

/**
 * Arguments for creating a {@link Domain} resource.
 *
 * @example
 * ```ts
 * const domain = new dokploy.Domain("app-domain", {
 *   host: "app.example.com",
 *   composeId: server.composeId,
 *   serviceName: "web",
 *   port: 3000,
 *   https: true,
 *   certificateType: "letsencrypt",
 * });
 * ```
 */
export interface DomainArgs {
  /** Hostname (e.g. `"app.example.com"`) */
  host: pulumi.Input<string>;
  /** URL path prefix (e.g. `"/"`) */
  path?: pulumi.Input<string>;
  /** Container port to route to */
  port?: pulumi.Input<number>;
  /** Enable HTTPS */
  https?: pulumi.Input<boolean>;
  /** SSL certificate strategy: `"letsencrypt"` or `"none"` */
  certificateType?: pulumi.Input<CertificateType>;
  /** Docker Compose service name to route to */
  serviceName?: pulumi.Input<string>;
  /** Domain type */
  domainType?: pulumi.Input<string>;
  /** Application ID (for application-type services) */
  applicationId?: pulumi.Input<string>;
  /** Compose service ID (for compose-type services) */
  composeId?: pulumi.Input<string>;
}

/**
 * A domain routing rule in Dokploy (Traefik).
 *
 * Routes traffic from a hostname to a specific container port.
 * Changing `applicationId` or `composeId` triggers a replacement.
 *
 * @example
 * ```ts
 * import * as dokploy from "@xantiagoma/dokploy-pulumi";
 *
 * const domain = new dokploy.Domain("api-domain", {
 *   host: "api.example.com",
 *   composeId: server.composeId,
 *   serviceName: "api",
 *   port: 8080,
 *   https: true,
 *   certificateType: "letsencrypt",
 * });
 * ```
 */
export class Domain extends pulumi.dynamic.Resource {
  /** The Dokploy domain ID */
  public readonly domainId!: pulumi.Output<string>;
  public readonly host!: pulumi.Output<string>;
  public readonly path!: pulumi.Output<string | undefined>;
  public readonly port!: pulumi.Output<number | undefined>;
  public readonly https!: pulumi.Output<boolean | undefined>;
  public readonly certificateType!: pulumi.Output<
    CertificateType | undefined
  >;
  public readonly serviceName!: pulumi.Output<string | undefined>;
  public readonly domainType!: pulumi.Output<string | undefined>;
  public readonly applicationId!: pulumi.Output<string | undefined>;
  public readonly composeId!: pulumi.Output<string | undefined>;

  constructor(
    name: string,
    args: DomainArgs,
    opts?: pulumi.CustomResourceOptions,
  ) {
    super(
      domainProvider,
      name,
      {
        domainId: undefined,
        ...args,
      },
      opts,
    );
  }
}
