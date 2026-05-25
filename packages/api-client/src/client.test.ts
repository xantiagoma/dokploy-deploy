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
    const projects = await client.project.all();
    expect(Array.isArray(projects)).toBe(true);
  });

  test("project.create + one + update + remove", async () => {
    // Create — returns {project, environment}
    const result = await client.project.create({
      name: `test-${Date.now()}`,
      description: "Integration test project",
    });
    expect(result.project.projectId).toBeDefined();
    testProjectId = result.project.projectId;
    testEnvironmentId = result.environment.environmentId;

    // Read
    const fetched = await client.project.one({ projectId: testProjectId });
    expect(fetched.name).toBe(result.project.name);

    // Update
    const updated = await client.project.update({
      projectId: testProjectId,
      description: "Updated description",
    });
    expect(updated.description).toBe("Updated description");

    // List environments
    const envs = await client.environment.byProjectId({ projectId: testProjectId });
    expect(envs.length).toBeGreaterThanOrEqual(1);
  });

  test("compose lifecycle", async () => {
    // Create compose
    const compose = await client.compose.create({
      name: `test-compose-${Date.now()}`,
      projectId: testProjectId,
      environmentId: testEnvironmentId,
    });
    expect(compose.composeId).toBeDefined();

    // Read
    const fetched = await client.compose.one({ composeId: compose.composeId });
    expect(fetched.name).toBe(compose.name);

    // Update
    const updated = await client.compose.update({
      composeId: compose.composeId,
      env: "TEST_VAR=hello",
      sourceType: "raw",
      composeFile: 'version: "3"\nservices:\n  test:\n    image: alpine\n    command: sleep infinity\n',
    });
    expect(updated.env).toContain("TEST_VAR=hello");

    // Delete
    await client.compose.delete({ composeId: compose.composeId });

    // Verify deleted
    try {
      await client.compose.one({ composeId: compose.composeId });
      expect(true).toBe(false); // should not reach
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
  test("createDokployClient returns client with routers", () => {
    const client = createDokployClient({
      endpoint: "http://localhost:3000",
      apiKey: "test-key",
    });
    expect(client.project).toBeDefined();
    expect(client.compose).toBeDefined();
    expect(client.domain).toBeDefined();
    expect(client.environment).toBeDefined();
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
