import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";
import type { CertificateType } from "@xantiagoma/dokploy-api";

/** Domain configuration for an application service. */
export interface DokployApplicationDomainArgs {
  /** Hostname (e.g. `"app.example.com"`) */
  host: pulumi.Input<string>;
  /** Docker service name to route to */
  serviceName?: pulumi.Input<string>;
  /** Container port */
  port?: pulumi.Input<number>;
  /** Enable HTTPS (default: `true`) */
  https?: pulumi.Input<boolean>;
  /** SSL strategy (default: `"letsencrypt"`) */
  certificateType?: pulumi.Input<CertificateType>;
}

/** Port mapping configuration for an application service. */
export interface DokployApplicationPortArgs {
  /** Host port to publish */
  publishedPort: pulumi.Input<number>;
  /** Container port to forward to */
  targetPort: pulumi.Input<number>;
  /** Network protocol: `"tcp"` or `"udp"` (default: `"tcp"`) */
  protocol?: pulumi.Input<"tcp" | "udp">;
  /** Publish mode: `"ingress"` or `"host"` (default: `"ingress"`) */
  publishMode?: pulumi.Input<"ingress" | "host">;
}

/** Mount configuration for an application service. */
export interface DokployApplicationMountArgs {
  /** Mount type: `"bind"`, `"volume"`, or `"file"` */
  type: pulumi.Input<"bind" | "volume" | "file">;
  /** Container path where the mount is attached */
  mountPath: pulumi.Input<string>;
  /** File content (for `type: "file"` mounts) */
  content?: pulumi.Input<string>;
  /** Host path (for `type: "bind"` mounts) */
  hostPath?: pulumi.Input<string>;
  /** Docker volume name (for `type: "volume"` mounts) */
  volumeName?: pulumi.Input<string>;
}

/**
 * Arguments for the {@link DokployApplication} component.
 *
 * @example
 * ```ts
 * new DokployApplication("api", {
 *   environmentId: project.productionEnvironmentId,
 *   env: { NODE_ENV: "production", PORT: "3000" },
 *   domains: [{ host: "api.example.com", port: 3000 }],
 *   ports: [{ publishedPort: 3000, targetPort: 3000 }],
 * });
 * ```
 */
export interface DokployApplicationArgs {
  /** Environment ID (required — get from DokployProject.productionEnvironmentId) */
  environmentId: pulumi.Input<string>;
  /** Application service name (defaults to the Pulumi resource name) */
  appName?: pulumi.Input<string>;
  /** Service description */
  description?: pulumi.Input<string>;
  /** Environment variables — accepts an object `{ KEY: "value" }` or a raw `"KEY=value"` string */
  env?: pulumi.Input<Record<string, string>> | pulumi.Input<string>;
  /** Domain routing rules to attach to this service */
  domains?: DokployApplicationDomainArgs[];
  /** Port mappings to attach to this service */
  ports?: DokployApplicationPortArgs[];
  /** Volume/bind/file mounts to attach to this service */
  mounts?: DokployApplicationMountArgs[];
}

/**
 * High-level component that creates a Dokploy single-container application with optional
 * domains, port mappings, and mounts.
 *
 * Automatically sets `domainType: "application"` on all attached domains.
 *
 * @example
 * ```ts
 * import { DokployApplication } from "@xantiagoma/dokploy-sst";
 *
 * const api = new DokployApplication("api", {
 *   environmentId: project.productionEnvironmentId,
 *   description: "REST API service",
 *   env: { NODE_ENV: "production", PORT: "3000" },
 *   domains: [
 *     { host: "api.example.com", port: 3000, https: true },
 *   ],
 *   ports: [
 *     { publishedPort: 3000, targetPort: 3000 },
 *   ],
 *   mounts: [
 *     { type: "volume", mountPath: "/data", volumeName: "api_data" },
 *   ],
 * });
 *
 * export const applicationId = api.applicationId;
 * ```
 */
export class DokployApplication extends pulumi.ComponentResource {
  /** The underlying Application resource */
  public readonly application: dokploy.Application;
  /** The Dokploy application service ID */
  public readonly applicationId: pulumi.Output<string>;
  /** Domain resources attached to this service */
  public readonly domains: dokploy.Domain[];
  /** Port mapping resources attached to this service */
  public readonly ports: dokploy.Port[];
  /** Mount resources attached to this service */
  public readonly mounts: dokploy.Mount[];

  constructor(name: string, args: DokployApplicationArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployApplication", name, {}, opts);

    this.application = new dokploy.Application(
      `${name}-application`,
      {
        name: args.appName ?? name,
        environmentId: args.environmentId,
        description: args.description,
      },
      { parent: this },
    );

    this.applicationId = this.application.applicationId;

    this.domains = (args.domains ?? []).map(
      (d, i) =>
        new dokploy.Domain(
          `${name}-domain-${i}`,
          {
            host: d.host,
            serviceName: d.serviceName,
            port: d.port,
            https: d.https ?? true,
            certificateType: d.certificateType ?? "letsencrypt",
            domainType: "application",
            applicationId: this.application.applicationId,
          },
          { parent: this, dependsOn: [this.application] },
        ),
    );

    this.ports = (args.ports ?? []).map(
      (p, i) =>
        new dokploy.Port(
          `${name}-port-${i}`,
          {
            publishedPort: p.publishedPort,
            targetPort: p.targetPort,
            protocol: p.protocol ?? "tcp",
            publishMode: p.publishMode ?? "ingress",
            applicationId: this.application.applicationId,
          },
          { parent: this, dependsOn: [this.application] },
        ),
    );

    this.mounts = (args.mounts ?? []).map(
      (m, i) =>
        new dokploy.Mount(
          `${name}-mount-${i}`,
          {
            type: m.type,
            mountPath: m.mountPath,
            content: m.content,
            hostPath: m.hostPath,
            volumeName: m.volumeName,
            serviceId: this.application.applicationId,
            serviceType: "application",
          },
          { parent: this, dependsOn: [this.application] },
        ),
    );

    this.registerOutputs({ applicationId: this.applicationId });
  }
}
