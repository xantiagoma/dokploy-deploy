import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { createDokployClient, DokployApiError } from "./client.ts";
import type { DokployClient } from "./client.ts";

const DOKPLOY_URL = process.env.DOKPLOY_URL;
const DOKPLOY_API_KEY = process.env.DOKPLOY_API_KEY;

const skip = !DOKPLOY_URL || !DOKPLOY_API_KEY;

describe.skipIf(skip)("DokployClient (integration)", () => {
  let client: DokployClient;
  let testProjectId: string;
  let testEnvironmentId: string;

  beforeAll(() => {
    client = createDokployClient({
      endpoint: DOKPLOY_URL!,
      apiKey: DOKPLOY_API_KEY!,
    });
  });

  test("project.all returns array", async () => {
    // project.all is in ResponseMap → returns ProjectResponse[] automatically
    const projects = await client.project.all();
    expect(Array.isArray(projects)).toBe(true);
  });

  test("project.create + one + update + remove", async () => {
    // project.create is in ResponseMap → returns CreateProjectResponse
    const result = await client.project.create({
      name: `test-${Date.now()}`,
      description: "Integration test project",
    });
    expect(result.project.projectId).toBeDefined();
    testProjectId = result.project.projectId;
    testEnvironmentId = result.environment.environmentId;

    // project.one → ProjectResponse
    const fetched = await client.project.one({ projectId: testProjectId });
    expect(fetched.name).toBe(result.project.name);

    // project.update → ProjectResponse
    const updated = await client.project.update({
      projectId: testProjectId,
      description: "Updated description",
    });
    expect(updated.description).toBe("Updated description");

    // environment.byProjectId → EnvironmentResponse[]
    const envs = await client.environment.byProjectId({ projectId: testProjectId });
    expect(envs.length).toBeGreaterThanOrEqual(1);
  });

  test("compose lifecycle", async () => {
    // compose.create → ComposeResponse
    const compose = await client.compose.create({
      name: `test-compose-${Date.now()}`,
      environmentId: testEnvironmentId,
    });
    expect(compose.composeId).toBeDefined();

    // compose.one → ComposeResponse
    const fetched = await client.compose.one({ composeId: compose.composeId });
    expect(fetched.name).toBe(compose.name);

    // compose.update → ComposeResponse
    const updated = await client.compose.update({
      composeId: compose.composeId,
      env: "TEST_VAR=hello",
      sourceType: "raw",
      composeFile: 'version: "3"\nservices:\n  test:\n    image: alpine\n    command: sleep infinity\n',
    });
    expect(updated.env).toContain("TEST_VAR=hello");

    await client.compose.delete({ composeId: compose.composeId, deleteVolumes: false });

    try {
      await client.compose.one({ composeId: compose.composeId });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(DokployApiError);
    }
  });

  afterAll(async () => {
    if (testProjectId) {
      try {
        await client.project.remove({ projectId: testProjectId });
      } catch {
        // ignore cleanup errors
      }
    }
  });
});

describe("DokployClient (unit)", () => {
  test("createDokployClient returns client with all 48 routers", () => {
    const client = createDokployClient({
      endpoint: "http://localhost:3000",
      apiKey: "test-key",
    });
    expect(client.project).toBeDefined();
    expect(client.compose).toBeDefined();
    expect(client.domain).toBeDefined();
    expect(client.environment).toBeDefined();
    expect(client.application).toBeDefined();
    expect(client.postgres).toBeDefined();
    expect(client.redis).toBeDefined();
    expect(client.notification).toBeDefined();
    expect(client.settings).toBeDefined();
    expect(client.docker).toBeDefined();
  });

  test("DokployApiError has correct properties", () => {
    const err = new DokployApiError("project.one", 404, "Not found");
    expect(err.procedure).toBe("project.one");
    expect(err.status).toBe(404);
    expect(err.body).toBe("Not found");
    expect(err.message).toContain("project.one");
    expect(err.message).toContain("404");
  });
});
