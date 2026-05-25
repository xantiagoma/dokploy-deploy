import { DokployProject, DokployCompose } from "@xantiagoma/dokploy-sst";

const project = new DokployProject("e2e-sst-project", {
  description: "SST E2E test — will be deleted",
  env: {
    TEST_VAR: "hello-from-sst",
  },
});

new DokployCompose("e2e-sst-compose", {
  project: "e2e-sst",
  projectId: project.projectId,
  environmentId: project.productionEnvironmentId,
  composeName: "sst-test-service",
  composeFile: `version: "3"
services:
  echo-server:
    image: ealen/echo-server
    restart: unless-stopped
`,
  env: { PORT: "80" },
  domains: [
    {
      host: `sst-e2e-${Date.now()}.localhost`,
      serviceName: "echo-server",
      port: 80,
    },
  ],
});

export const projectId = project.projectId;
export const envId = project.productionEnvironmentId;
