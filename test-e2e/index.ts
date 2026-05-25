import * as dokploy from "@xantiagoma/dokploy-pulumi";

const project = new dokploy.Project("e2e-test-project", {
  name: `e2e-test-${Date.now()}`,
  description: "E2E test — will be deleted",
});

const compose = new dokploy.Compose("e2e-test-compose", {
  name: `e2e-compose-${Date.now()}`,
  projectId: project.projectId,
  environmentId: project.productionEnvironmentId,
  sourceType: "raw",
  composeFile: `version: "3"
services:
  echo-server:
    image: ealen/echo-server
    restart: unless-stopped
`,
  env: "TEST_VAR=hello",
});

const domain = new dokploy.Domain("e2e-test-domain", {
  host: `e2e-test-${Date.now()}.localhost`,
  composeId: compose.composeId,
  serviceName: "echo-server",
  port: 80,
  https: false,
  certificateType: "none",
});

export const projectId = project.projectId;
export const productionEnvId = project.productionEnvironmentId;
export const composeId = compose.composeId;
export const domainId = domain.domainId;
export const domainHost = domain.host;
