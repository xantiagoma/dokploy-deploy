import { defineCommand } from "citty";
import { createDokployClient } from "@xantiagoma/dokploy-api";
import { Project } from "ts-morph";
import { writeFileSync } from "node:fs";

export default defineCommand({
  meta: {
    name: "pull",
    description: "Pull existing Dokploy infrastructure into IaC code",
  },
  args: {
    url: { type: "string", description: "Dokploy instance URL", required: false },
    key: { type: "string", description: "Dokploy API key", required: false },
    format: { type: "string", description: "Output format: sst (default) or pulumi", default: "sst" },
    output: { type: "string", alias: "o", description: "Write to file instead of stdout", required: false },
  },
  async run({ args }) {
    const endpoint = args.url || process.env["DOKPLOY_URL"];
    const apiKey = args.key || process.env["DOKPLOY_API_KEY"];

    if (!endpoint || !apiKey) {
      console.error("Error: --url and --key are required (or set DOKPLOY_URL and DOKPLOY_API_KEY)");
      process.exit(1);
    }

    const format = args.format as "sst" | "pulumi";
    const client = createDokployClient({ endpoint, apiKey });
    console.error(`Connecting to ${endpoint}`);

    // --- Fetch all data ---
    const projects = await client.project.all();
    console.error(`Found ${projects.length} project(s)`);

    // Fetch git providers for name resolution
    const githubProviders = await client.github.githubProviders();
    const githubIdToName = new Map(githubProviders.map((p) => [p.githubId, p.gitProvider.name]));
    // Track which provider names are used so we can generate variables
    const usedProviders = new Set<string>();

    // --- Build AST ---
    const tsProject = new Project({ useInMemoryFileSystem: true });
    const sf = tsProject.createSourceFile("infra.ts", "");

    // Imports (we'll fixup SST imports after scanning all resources)
    if (format === "sst") {
      sf.addImportDeclaration({
        moduleSpecifier: "@xantiagoma/dokploy-sst",
        namedImports: [
          "DokployProject", "DokployCompose", "DokployApplication",
          "DokployPostgres", "DokployMysql", "DokployMariadb", "DokployMongo", "DokployRedis",
          "projectRef", "gitProvider",
        ],
      });
    } else {
      sf.addImportDeclaration({
        moduleSpecifier: "@xantiagoma/dokploy-pulumi",
        namespaceImport: "dokploy",
      });
      // Add helper functions for env var references in template literals
      sf.addStatements(`\nconst projectRef = (name: string) => \`\\\${{project.\${name}}}\`;`);
      sf.addStatements(`const envRef = (name: string) => \`\\\${{environment.\${name}}}\`;`);
    }

    for (const project of projects) {
      const projVar = toVar(project.name);

      // Parse env
      const envEntries = project.env
        .split("\n")
        .filter((l) => l.includes("=") && !l.startsWith("#"))
        .map((l) => { const eq = l.indexOf("="); return [l.substring(0, eq)!, l.substring(eq + 1)] as const; });

      // Project
      if (format === "sst") {
        const envObj = envEntries.length > 0
          ? obj(envEntries.map(([k, v]) => `${k}: ${q(v)}`), 4)
          : undefined;
        sf.addStatements(`\nconst ${projVar} = new DokployProject(${q(project.name)}, ${obj([
          project.description ? `description: ${q(project.description)}` : null,
          envObj ? `env: ${envObj}` : null,
        ])});`);
      } else {
        sf.addStatements(`\nconst ${projVar} = new dokploy.Project(${q(project.name)}, ${obj([
          `name: ${q(project.name)}`,
          project.description ? `description: ${q(project.description)}` : null,
          project.env ? `env: \`\n${envToTemplateLiteral(project.env)}\n\`` : null,
        ])});`);
      }

      // Environments
      const envs = await client.environment.byProjectId({ projectId: project.projectId });

      for (const env of envs) {
        const count = [env.compose, env.applications, env.postgres, env.redis, env.mysql, env.mariadb, env.mongo]
          .reduce((s, a) => s + (a?.length ?? 0), 0);
        console.error(`  ${project.name}/${env.name}: ${count} service(s)`);

        sf.addStatements(`\n// --- ${project.name} / ${env.name} ---`);

        // Databases
        for (const pg of env.postgres ?? []) addDb(sf, format, "Postgres", projVar, pg, ["databaseName", "databaseUser", "databasePassword"]);
        for (const r of env.redis ?? []) addDb(sf, format, "Redis", projVar, r, ["databasePassword"]);
        for (const db of env.mysql ?? []) addDb(sf, format, "Mysql", projVar, db, ["databaseName", "databaseUser", "databasePassword"]);
        for (const db of env.mariadb ?? []) addDb(sf, format, "Mariadb", projVar, db, ["databaseName", "databaseUser", "databasePassword"]);
        for (const db of env.mongo ?? []) addDb(sf, format, "Mongo", projVar, db, ["databaseUser", "databasePassword"]);

        // Compose
        for (const c of env.compose ?? []) {
          const domains = await client.domain.byComposeId({ composeId: c.composeId });
          addCompose(sf, format, projVar, c, domains, githubIdToName, usedProviders);
        }

        // Applications
        for (const app of env.applications ?? []) {
          const domains = await client.domain.byApplicationId({ applicationId: app.applicationId });
          addApplication(sf, format, projVar, app, domains);
        }
      }
    }

    // Insert gitProvider() declarations after imports (SST only)
    if (format === "sst" && usedProviders.size > 0) {
      const providerDecls = [...usedProviders].sort().map(
        (name) => `const ${toGitProviderVar(name)} = gitProvider(${q(name)});`
      ).join("\n");
      // Insert after the import statement
      const importDecl = sf.getImportDeclarations()[0];
      if (importDecl) {
        importDecl.replaceWithText(importDecl.getText() + "\n\n" + providerDecls);
      }
    }

    sf.formatText({ indentSize: 2 });
    const output = sf.getFullText();
    if (args.output) {
      writeFileSync(args.output, output);
      console.error(`Written to ${args.output}`);
    } else {
      console.log(output);
    }
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toVar(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").replace(/^(\d)/, "_$1");
}

function toGitProviderVar(name: string): string {
  // "Watson-Dokploy" → "gitProviderWatsonDokploy"
  const parts = name.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const camel = parts.map((p, i) => i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("");
  return `gitProvider${camel.charAt(0).toUpperCase() + camel.slice(1)}`;
}

function q(s: string | null | undefined): string {
  if (s == null) return '""';
  return JSON.stringify(s);
}

/** Convert env string for use in a template literal — replaces Dokploy refs with helper calls */
function envToTemplateLiteral(env: string): string {
  return env
    .replace(/\$\{\{project\.(.+?)\}\}/g, (_match, name) => `\${projectRef('${name}')}`)
    .replace(/\$\{\{environment\.(.+?)\}\}/g, (_match, name) => `\${envRef('${name}')}`)
    .replace(/\$(?!\{)/g, "\\$") // escape remaining $ that aren't template expressions
    .trimEnd();
}

/** Build a multi-line object literal from key-value pairs */
function obj(entries: Array<string | null | false>, indent = 2): string {
  const valid = entries.filter(Boolean) as string[];
  if (valid.length === 0) return "{}";
  const pad = " ".repeat(indent);
  return `{\n${valid.map((e) => `${pad}${e},`).join("\n")}\n}`
}

function addDb(sf: ReturnType<Project["createSourceFile"]>, format: string, type: string, projVar: string, db: Record<string, any>, fields: string[]) {
  const name = db.name as string;
  const C = format === "sst" ? `Dokploy${type}` : `dokploy.${type}`;
  sf.addStatements(`\nconst ${toVar(name)} = new ${C}(${q(name)}, ${obj([
    format === "pulumi" ? `name: ${q(name)}` : null,
    `environmentId: ${projVar}.productionEnvironmentId`,
    ...fields.filter((f) => db[f] != null).map((f) => `${f}: ${q(db[f] as string)}`),
    db.dockerImage ? `dockerImage: ${q(db.dockerImage as string)}` : null,
  ])});`);
}

function addCompose(sf: ReturnType<Project["createSourceFile"]>, format: string, projVar: string, c: Record<string, any>, domains: Array<Record<string, any>>, githubIdToName?: Map<string, string>, usedProviders?: Set<string>) {
  const name = c.name as string;

  if (format === "sst") {
    const parts: string[] = [`environmentId: ${projVar}.productionEnvironmentId`];

    // Source
    if (c.sourceType === "github" && c.owner && c.repository) {
      const gh = [`owner: ${q(c.owner as string)}`, `repo: ${q(c.repository as string)}`];
      const providerName = c.githubId ? githubIdToName?.get(c.githubId as string) : undefined;
      if (providerName) {
        usedProviders?.add(providerName);
        gh.push(`githubId: ${toGitProviderVar(providerName)}`);
      } else if (c.githubId) {
        gh.push(`githubId: ${q(c.githubId as string)}`);
      }
      parts.push(`github: { ${gh.join(", ")} }`);
    } else if (c.sourceType === "git" && c.customGitUrl) {
      parts.push(`customGitUrl: ${q(c.customGitUrl as string)}`);
      if (c.customGitBranch) parts.push(`customGitBranch: ${q(c.customGitBranch as string)}`);
    } else if (c.sourceType === "raw" && c.composeFile) {
      parts.push(`composeFile: \`\n${envToTemplateLiteral(c.composeFile as string)}\n\``);
    }

    if (c.composePath && c.composePath !== "./docker-compose.yml") parts.push(`composePath: ${q(c.composePath as string)}`);
    if (c.autoDeploy) parts.push(`autoDeploy: true`);

    // Env with projectRef
    const envStr = c.env as string | null;
    if (envStr) {
      const envLines = envStr.split("\n").filter((l) => l.includes("=") && !l.startsWith("#"));
      if (envLines.length > 0) {
        const envProps = envLines.map((line) => {
          const eq = line.indexOf("=");
          const key = line.substring(0, eq);
          const val = line.substring(eq + 1);
          const ref = val.match(/^\$\{\{project\.(.+?)\}\}$/)?.[1];
          return ref ? `${key}: projectRef(${q(ref)})` : `${key}: ${q(val)}`;
        });
        parts.push(`env: ${obj(envProps.map((e) => e), 4)}`);
      }
    }

    // Domains
    if (domains.length > 0) {
      const domainStrs = domains.map((d) => {
        const dp = [`host: ${q(d.host as string)}`];
        if (d.serviceName) dp.push(`serviceName: ${q(d.serviceName as string)}`);
        if (d.port) dp.push(`port: ${d.port as number}`);
        return `{ ${dp.join(", ")} }`;
      });
      parts.push(`domains: [\n    ${domainStrs.join(",\n    ")},\n  ]`);
    }

    sf.addStatements(`\nnew DokployCompose(${q(name)}, ${obj(parts)});`);
  } else {
    const v = toVar(name);
    sf.addStatements(`\nconst ${v} = new dokploy.Compose(${q(name)}, ${obj([
      `name: ${q(name)}`,
      `environmentId: ${projVar}.productionEnvironmentId`,
      c.sourceType ? `sourceType: ${q(c.sourceType as string)}` : null,
      c.owner ? `owner: ${q(c.owner as string)}` : null,
      c.repository ? `repository: ${q(c.repository as string)}` : null,
      c.branch ? `branch: ${q(c.branch as string)}` : null,
      c.composePath ? `composePath: ${q(c.composePath as string)}` : null,
      c.autoDeploy ? `autoDeploy: true` : null,
      c.githubId ? `githubId: ${q(c.githubId as string)}` : null,
      c.env ? `env: \`\n${envToTemplateLiteral(c.env as string)}\n\`` : null,
    ])});`);

    for (const d of domains) {
      sf.addStatements(`\nnew dokploy.Domain(${q(`${name}-${d.host as string}`)}, ${obj([
        `host: ${q(d.host as string)}`,
        `composeId: ${v}.composeId`,
        d.serviceName ? `serviceName: ${q(d.serviceName as string)}` : null,
        d.port ? `port: ${d.port as number}` : null,
        `https: ${d.https as boolean}`,
        `certificateType: ${q(d.certificateType as string)}`,
        `domainType: "compose"`,
      ])});`);
    }
  }
}

function addApplication(sf: ReturnType<Project["createSourceFile"]>, format: string, projVar: string, app: Record<string, any>, domains: Array<Record<string, any>>) {
  const name = app.name as string;

  if (format === "sst") {
    const parts: Array<string | null> = [
      `environmentId: ${projVar}.productionEnvironmentId`,
      app.description ? `description: ${q(app.description as string)}` : null,
    ];
    if (domains.length > 0) {
      const ds = domains.map((d) => {
        const dp = [`host: ${q(d.host as string)}`];
        if (d.port) dp.push(`port: ${d.port as number}`);
        return `{ ${dp.join(", ")} }`;
      });
      parts.push(`domains: [\n    ${ds.join(",\n    ")},\n  ]`);
    }
    sf.addStatements(`\nnew DokployApplication(${q(name)}, ${obj(parts)});`);
  } else {
    sf.addStatements(`\nnew dokploy.Application(${q(name)}, ${obj([
      `name: ${q(name)}`,
      `environmentId: ${projVar}.productionEnvironmentId`,
      app.description ? `description: ${q(app.description as string)}` : null,
    ])});`);
  }
}
