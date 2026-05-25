/**
 * Single codegen script for @xantiagoma/dokploy-api.
 *
 * 1. Fetches OpenAPI spec
 * 2. Runs openapi-typescript for raw operation types
 * 3. Uses ts-morph to generate routers, client, and index from the spec
 *
 * Only `src/response-map.ts` is hand-written — everything else is generated.
 *
 * Usage:
 *   bun scripts/generate.ts
 *   bun scripts/generate.ts https://my-instance.com
 *   DOKPLOY_OPENAPI_URL=... bun scripts/generate.ts
 */

import { Project, StructureKind, Scope, type MethodDeclarationStructure } from "ts-morph";

const PUBLIC_SPEC_URL = "https://docs.dokploy.com/openapi.json";

const specUrl =
  process.argv[2] ??
  process.env["DOKPLOY_OPENAPI_URL"] ??
  PUBLIC_SPEC_URL;

const url = specUrl.endsWith(".json")
  ? specUrl
  : `${specUrl.replace(/\/api\/?$/, "")}/api/settings.getOpenApiDocument`;

// ---------------------------------------------------------------------------
// Step 1: Fetch OpenAPI spec
// ---------------------------------------------------------------------------

console.log(`1. Fetching OpenAPI spec from: ${url}`);

const headers: Record<string, string> = {};
const apiKey = process.env["DOKPLOY_API_KEY"];
if (apiKey) headers["x-api-key"] = apiKey;

const res = await fetch(url, { headers });
if (!res.ok) {
  console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const spec = await res.text();
await Bun.write("openapi.json", spec);
console.log(`   Saved openapi.json (${(spec.length / 1024).toFixed(0)} KB)`);

// ---------------------------------------------------------------------------
// Step 2: Run openapi-typescript
// ---------------------------------------------------------------------------

console.log(`2. Generating OpenAPI types...`);

const oaResult = Bun.spawnSync(
  ["bunx", "openapi-typescript", "openapi.json", "-o", "src/generated.ts"],
  { stdout: "inherit", stderr: "inherit" },
);
if (oaResult.exitCode !== 0) {
  console.error("openapi-typescript failed");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Step 3: Parse spec and prepare router metadata
// ---------------------------------------------------------------------------

console.log(`3. Generating routers, client, and index via ts-morph...`);

interface Endpoint {
  method: string;
  httpMethod: "get" | "post";
  operationId: string;
  hasBody: boolean;
  hasParams: boolean;
}

interface OpenAPIDoc {
  paths: Record<string, Record<string, {
    operationId: string;
    parameters?: Array<{ name: string }>;
    requestBody?: unknown;
  }>>;
}

const doc: OpenAPIDoc = JSON.parse(spec);

const routers = new Map<string, Endpoint[]>();
for (const [path, methods] of Object.entries(doc.paths)) {
  const name = path.replace(/^\//, "");
  const dotIndex = name.indexOf(".");
  if (dotIndex === -1) continue;

  const routerName = name.substring(0, dotIndex);
  const methodName = name.substring(dotIndex + 1);
  const httpMethod = Object.keys(methods)[0] as "get" | "post";
  const op = methods[httpMethod]!;

  if (!routers.has(routerName)) routers.set(routerName, []);
  routers.get(routerName)!.push({
    method: methodName,
    httpMethod,
    operationId: op.operationId,
    hasBody: "requestBody" in op,
    hasParams: (op.parameters?.length ?? 0) > 0,
  });
}

const sortedRouters = [...routers.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const sortedNames = sortedRouters.map(([n]) => n);
const methodCount = [...routers.values()].reduce((s, m) => s + m.length, 0);
const bodyOps = [...routers.values()]
  .flat()
  .filter((o) => o.hasBody)
  .sort((a, b) => a.operationId.localeCompare(b.operationId));

function toPascalCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function opIdToInputTypeName(opId: string): string {
  return opId.split("-").map(toPascalCase).join("") + "Input";
}

// Enum extractions: [exportedTypeName, sourceInputTypeName, fieldName]
const enumExtracts: [string, string, string][] = [
  ["ComposeSourceType", "ComposeUpdateInput", "sourceType"],
  ["CertificateType", "DomainCreateInput", "certificateType"],
  ["DomainType", "DomainCreateInput", "domainType"],
  ["ComposeStatus", "ComposeUpdateInput", "composeStatus"],
  ["ComposeType", "ComposeCreateInput", "composeType"],
  ["TriggerType", "ComposeUpdateInput", "triggerType"],
];

// ---------------------------------------------------------------------------
// ts-morph project
// ---------------------------------------------------------------------------

const project = new Project({ useInMemoryFileSystem: true });

// =========================================================================
// File: src/generated-routers.ts
// =========================================================================

const routersFile = project.createSourceFile("src/generated-routers.ts", "", { overwrite: true });

routersFile.insertStatements(0, [
  `/**`,
  ` * AUTO-GENERATED — do not edit manually.`,
  ` * Run: bun scripts/generate.ts`,
  ` *`,
  ` * ${methodCount} endpoints across ${routers.size} routers`,
  ` */`,
]);

routersFile.addImportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: "./generated.ts",
  namedImports: ["operations"],
});

routersFile.addImportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: "./response-map.ts",
  namedImports: ["ResponseMap"],
});

// Helper types
routersFile.addTypeAlias({ name: "BodyOf", typeParameters: ["T"], type: `T extends { requestBody: { content: { "application/json": infer B } } } ? B : never`, isExported: false });
routersFile.addTypeAlias({ name: "QueryOf", typeParameters: ["T"], type: `T extends { parameters: { query: infer Q } } ? Q : never`, isExported: false });
routersFile.addTypeAlias({ name: "ResponseOf", typeParameters: [{ name: "OpId", constraint: "string" }], type: `OpId extends keyof ResponseMap ? ResponseMap[OpId] : unknown`, isExported: false });

// Transport interface
routersFile.addInterface({
  name: "Transport",
  isExported: true,
  methods: [
    { name: "query", typeParameters: ["T"], parameters: [{ name: "procedure", type: "string" }, { name: "input", type: "object", hasQuestionToken: true }], returnType: "Promise<T>" },
    { name: "mutate", typeParameters: ["T"], parameters: [{ name: "procedure", type: "string" }, { name: "input", type: "object" }], returnType: "Promise<T>" },
  ],
});

// Router classes
for (const [routerName, endpoints] of sortedRouters) {
  const className = `${toPascalCase(routerName)}Router`;

  const methods: MethodDeclarationStructure[] = endpoints.map((ep) => {
    const procedure = `${routerName}.${ep.method}`;
    const defaultType = `ResponseOf<"${ep.operationId}">`;

    let params: { name: string; type: string }[] = [];
    let body: string;

    if (ep.httpMethod === "post" && ep.hasBody) {
      params = [{ name: "input", type: `BodyOf<operations["${ep.operationId}"]>` }];
      body = `return this.transport.mutate<T>("${procedure}", input);`;
    } else if (ep.httpMethod === "get" && ep.hasParams) {
      params = [{ name: "input", type: `QueryOf<operations["${ep.operationId}"]>` }];
      body = `return this.transport.query<T>("${procedure}", input);`;
    } else if (ep.httpMethod === "post") {
      body = `return this.transport.mutate<T>("${procedure}", {});`;
    } else {
      body = `return this.transport.query<T>("${procedure}");`;
    }

    return {
      kind: StructureKind.Method,
      name: ep.method,
      isAsync: true,
      typeParameters: [{ name: "T", default: defaultType }],
      parameters: params,
      returnType: "Promise<T>",
      statements: [body],
    };
  });

  routersFile.addClass({
    name: className,
    isExported: true,
    ctors: [{
      parameters: [{ name: "transport", type: "Transport", scope: Scope.Private }],
    }],
    methods,
  });
}

// AllRouters interface
routersFile.addInterface({
  name: "AllRouters",
  isExported: true,
  properties: sortedNames.map((name) => ({
    name,
    type: `${toPascalCase(name)}Router`,
  })),
});

// createAllRouters function
routersFile.addFunction({
  name: "createAllRouters",
  isExported: true,
  parameters: [{ name: "transport", type: "Transport" }],
  returnType: "AllRouters",
  statements: [
    `return {\n${sortedNames.map((n) => `    ${n}: new ${toPascalCase(n)}Router(transport),`).join("\n")}\n  };`,
  ],
});

// DokployClient class
routersFile.addClass({
  name: "DokployClient",
  isExported: true,
  implements: ["AllRouters"],
  properties: sortedNames.map((name) => ({
    name,
    type: `${toPascalCase(name)}Router`,
    hasExclamationToken: true,
    scope: Scope.Public,
    isReadonly: true,
  })),
  ctors: [{
    parameters: [{ name: "transport", type: "Transport" }],
    statements: ["Object.assign(this, createAllRouters(transport));"],
  }],
});

// Input type aliases
for (const op of bodyOps) {
  routersFile.addTypeAlias({
    name: opIdToInputTypeName(op.operationId),
    type: `BodyOf<operations["${op.operationId}"]>`,
    isExported: true,
  });
}

// Enum type aliases
for (const [typeName, sourceType, field] of enumExtracts) {
  routersFile.addTypeAlias({
    name: typeName,
    type: `NonNullable<${sourceType}["${field}"]>`,
    isExported: true,
  });
}

// =========================================================================
// File: src/client.ts
// =========================================================================

const clientFile = project.createSourceFile("src/client.ts", "", { overwrite: true });

clientFile.insertStatements(0, [
  `/**`,
  ` * AUTO-GENERATED — do not edit manually.`,
  ` * Run: bun scripts/generate.ts`,
  ` */`,
]);

clientFile.addImportDeclaration({ defaultImport: "createClient", moduleSpecifier: "openapi-fetch" });
clientFile.addImportDeclaration({ isTypeOnly: true, moduleSpecifier: "./generated.ts", namedImports: ["paths"] });
clientFile.addImportDeclaration({ moduleSpecifier: "./generated-routers.ts", namedImports: ["DokployClient"] });
clientFile.addImportDeclaration({ isTypeOnly: true, moduleSpecifier: "./generated-routers.ts", namedImports: ["Transport"] });

clientFile.addExportDeclaration({ moduleSpecifier: "./generated-routers.ts", namedExports: ["DokployClient"] });

clientFile.addInterface({
  name: "DokployClientOptions",
  isExported: true,
  properties: [
    { name: "endpoint", type: "string", docs: [{ description: "Dokploy instance URL (e.g. `https://dokploy.example.com`)" }] },
    { name: "apiKey", type: "string", docs: [{ description: "API key from Dashboard > Settings > Profile > API/CLI" }] },
  ],
});

clientFile.addClass({
  name: "DokployApiError",
  isExported: true,
  extends: "Error",
  ctors: [{
    parameters: [
      { name: "procedure", type: "string", scope: Scope.Public },
      { name: "status", type: "number", scope: Scope.Public },
      { name: "body", type: "string", scope: Scope.Public },
    ],
    statements: [
      "super(`Dokploy API error [${procedure}] (${status}): ${body}`);",
      'this.name = "DokployApiError";',
    ],
  }],
});

// TrpcFetcher class (not exported)
clientFile.addClass({
  name: "TrpcFetcher",
  implements: ["Transport"],
  properties: [
    { name: "api", type: "ReturnType<typeof createClient<paths>>", scope: Scope.Public, isReadonly: true },
    { name: "baseUrl", type: "string", scope: Scope.Private },
  ],
  ctors: [{
    parameters: [
      { name: "endpoint", type: "string" },
      { name: "apiKey", type: "string", scope: Scope.Private },
    ],
    statements: [
      'this.baseUrl = endpoint.replace(/\\/api\\/?$/, "") + "/api";',
      "this.api = createClient<paths>({ baseUrl: this.baseUrl, headers: { \"x-api-key\": apiKey } });",
    ],
  }],
  methods: [
    {
      kind: StructureKind.Method,
      name: "query",
      isAsync: true,
      typeParameters: ["T"],
      parameters: [
        { name: "procedure", type: "string" },
        { name: "input", type: "object", hasQuestionToken: true },
      ],
      returnType: "Promise<T>",
      statements: [
        "let url = `${this.baseUrl}/trpc/${procedure}`;",
        "if (input) { const encoded = encodeURIComponent(JSON.stringify({ json: input })); url += `?input=${encoded}`; }",
        'const res = await fetch(url, { headers: { "x-api-key": this.apiKey, "Content-Type": "application/json" } });',
        "if (!res.ok) { const body = await res.text(); throw new DokployApiError(procedure, res.status, body); }",
        'const data = (await res.json()) as { result: { data: { json: T } } };',
        "return data.result.data.json;",
      ],
    },
    {
      kind: StructureKind.Method,
      name: "mutate",
      isAsync: true,
      typeParameters: ["T"],
      parameters: [
        { name: "procedure", type: "string" },
        { name: "input", type: "object" },
      ],
      returnType: "Promise<T>",
      statements: [
        "const url = `${this.baseUrl}/${procedure}`;",
        'const res = await fetch(url, { method: "POST", headers: { "x-api-key": this.apiKey, "Content-Type": "application/json" }, body: JSON.stringify(input) });',
        "if (!res.ok) { const body = await res.text(); throw new DokployApiError(procedure, res.status, body); }",
        "return (await res.json()) as T;",
      ],
    },
  ],
});

// DokployClientWithRaw
clientFile.addClass({
  name: "DokployClientWithRaw",
  isExported: true,
  extends: "DokployClient",
  properties: [
    { name: "raw", type: "ReturnType<typeof createClient<paths>>", scope: Scope.Public, isReadonly: true },
  ],
  ctors: [{
    parameters: [{ name: "options", type: "DokployClientOptions" }],
    statements: [
      "const transport = new TrpcFetcher(options.endpoint, options.apiKey);",
      "super(transport);",
      "this.raw = transport.api;",
    ],
  }],
});

// createDokployClient factory
clientFile.addFunction({
  name: "createDokployClient",
  isExported: true,
  parameters: [{ name: "options", type: "DokployClientOptions" }],
  returnType: "DokployClientWithRaw",
  statements: ["return new DokployClientWithRaw(options);"],
});

// =========================================================================
// File: src/index.ts
// =========================================================================

const indexFile = project.createSourceFile("src/index.ts", "", { overwrite: true });

indexFile.insertStatements(0, [
  `/**`,
  ` * AUTO-GENERATED — do not edit manually.`,
  ` * Run: bun scripts/generate.ts`,
  ` */`,
]);

indexFile.addExportDeclaration({
  moduleSpecifier: "./client.ts",
  namedExports: ["createDokployClient", "DokployClient", "DokployClientWithRaw", "DokployApiError"],
});

indexFile.addExportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: "./client.ts",
  namedExports: ["DokployClientOptions"],
});

// Re-export all generated types from routers
const routerExports = [
  "AllRouters",
  "Transport",
  ...bodyOps.map((op) => opIdToInputTypeName(op.operationId)),
  ...enumExtracts.map(([name]) => name),
];

indexFile.addExportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: "./generated-routers.ts",
  namedExports: routerExports,
});

indexFile.addExportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: "./response-map.ts",
  namedExports: ["ResponseMap", "ProjectResponse", "CreateProjectResponse", "EnvironmentResponse", "ComposeResponse", "DomainResponse"],
});

indexFile.addExportDeclaration({
  isTypeOnly: true,
  moduleSpecifier: "./generated.ts",
  namedExports: ["paths", "operations", "components"],
});

// =========================================================================
// Save all files
// =========================================================================

// Write to disk using Bun (ts-morph in-memory → Bun.write)
for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath().replace(/^\//, "");
  await Bun.write(filePath, sourceFile.getFullText());
  console.log(`   ${filePath}`);
}

console.log(`\nDone. (${routers.size} routers, ${methodCount} methods, ${bodyOps.length} input types)`);
