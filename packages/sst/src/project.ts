import * as pulumi from "@pulumi/pulumi";
import * as dokploy from "@xantiagoma/dokploy-pulumi";
import { envToString } from "./utils.ts";

/**
 * Arguments for the {@link DokployProject} component.
 *
 * @example
 * ```ts
 * const project = new DokployProject("demi", {
 *   name: "demi",
 *   description: "demi.casa infrastructure",
 *   env: { DATABASE_URL: "postgres://...", REDIS_URL: "redis://..." },
 * });
 * ```
 */
export interface DokployProjectArgs {
  /** Project name in Dokploy (defaults to the Pulumi resource name) */
  name?: pulumi.Input<string>;
  /** Project description */
  description?: pulumi.Input<string>;
  /** Project-level env vars — accepts an object `{ KEY: "value" }` or a raw `"KEY=value"` string */
  env?: pulumi.Input<Record<string, string>> | pulumi.Input<string>;
}

/**
 * High-level component that creates a Dokploy project.
 *
 * Exposes the auto-created production environment ID for use with
 * {@link DokployCompose} services.
 *
 * @example
 * ```ts
 * import { DokployProject, DokployCompose } from "@xantiagoma/dokploy-sst";
 *
 * const project = new DokployProject("demi", {
 *   description: "demi.casa",
 *   env: { DATABASE_URL: "postgres://..." },
 * });
 *
 * new DokployCompose("server", {
 *   environmentId: project.productionEnvironmentId,
 *   // ...
 * });
 * ```
 */
export class DokployProject extends pulumi.ComponentResource {
  /** The underlying Project resource */
  public readonly project: dokploy.Project;
  /** The Dokploy project ID */
  public readonly projectId: pulumi.Output<string>;
  /** The auto-created production environment ID */
  public readonly productionEnvironmentId: pulumi.Output<string>;

  constructor(name: string, args?: DokployProjectArgs, opts?: pulumi.ComponentResourceOptions) {
    super("dokploy:index:DokployProject", name, {}, opts);

    const envStr = args?.env
      ? pulumi.output(args.env).apply((e) => envToString(e))
      : undefined;

    this.project = new dokploy.Project(
      `${name}-project`,
      { name: args?.name ?? name, description: args?.description, env: envStr },
      { parent: this },
    );

    this.projectId = this.project.projectId;
    this.productionEnvironmentId = this.project.productionEnvironmentId;

    this.registerOutputs({
      projectId: this.projectId,
      productionEnvironmentId: this.productionEnvironmentId,
    });
  }
}
