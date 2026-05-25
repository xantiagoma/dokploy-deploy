import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "dokploy",
    version: "0.0.0",
    description: "CLI for Dokploy IaC — pull infrastructure, manage resources",
  },
  subCommands: {
    pull: () => import("./commands/pull.ts").then((m) => m.default),
  },
});

runMain(main);
