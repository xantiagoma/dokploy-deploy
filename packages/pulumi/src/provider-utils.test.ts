import { test, expect, describe } from "bun:test";
import { diffProps, UNKNOWN_VALUE } from "./provider-utils.ts";

describe("diffProps", () => {
  test("no changes when old and new are identical", () => {
    const props = { environmentId: "env-1", name: "svc", env: "A=1" };
    const { changes, replaces } = diffProps(props, props, ["environmentId"]);
    expect(changes).toBe(false);
    expect(replaces).toEqual([]);
  });

  test("in-place change on a non-replace key", () => {
    const olds = { environmentId: "env-1", env: "A=1" };
    const news = { environmentId: "env-1", env: "A=2" };
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    expect(changes).toBe(true);
    expect(replaces).toEqual([]);
  });

  test("replace when a replace key genuinely changes (both known, different)", () => {
    const olds = { environmentId: "env-1", env: "A=1" };
    const news = { environmentId: "env-2", env: "A=1" };
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    expect(changes).toBe(true);
    expect(replaces).toEqual(["environmentId"]);
  });

  // Regression: bumping the package version changes the serialized provider
  // closure (__provider). On its own that must be a no-op, not a mass update.
  test("ignores the injected __provider closure key", () => {
    const olds = { environmentId: "env-1", env: "A=1", __provider: "serialized-v1" };
    const news = { environmentId: "env-1", env: "A=1", __provider: "serialized-v2" };
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    expect(changes).toBe(false);
    expect(replaces).toEqual([]);
  });

  // Regression: the replace-storm bug. During preview, an upstream resource with
  // a pending update makes its outputs unknown, so a dependent's replace-trigger
  // input (environmentId) arrives as the unknown sentinel. This must NOT replace.
  test("never replaces on a known => unknown (preview) replace-key value", () => {
    const olds = { environmentId: "env-1", env: "A=1" };
    const news = { environmentId: UNKNOWN_VALUE, env: "A=1" };
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    expect(replaces).toEqual([]);
    expect(changes).toBe(false);
  });

  // The full replace-storm scenario: a version bump (__provider changes) AND the
  // upstream env id is unknown in preview. Expect a clean no-op: no replace.
  test("version bump + unknown environmentId is a no-op (no replace storm)", () => {
    const olds = { environmentId: "env-1", env: "A=1", __provider: "serialized-v1" };
    const news = { environmentId: UNKNOWN_VALUE, env: "A=1", __provider: "serialized-v2" };
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    expect(replaces).toEqual([]);
    expect(changes).toBe(false);
  });

  // A real env edit during a version bump should still update in place (env is
  // not a replace key) without dragging in a replace from the unknown id.
  test("real env change during version bump updates in place, no replace", () => {
    const olds = { environmentId: "env-1", env: "A=1", __provider: "serialized-v1" };
    const news = { environmentId: UNKNOWN_VALUE, env: "A=2", __provider: "serialized-v2" };
    const { changes, replaces } = diffProps(olds, news, ["environmentId"]);
    expect(changes).toBe(true);
    expect(replaces).toEqual([]);
  });
});
