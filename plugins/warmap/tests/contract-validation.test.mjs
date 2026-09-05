import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { WRITE_ACTIONS, validateFixture, validateManifest, validatePackage } from "../src/contract.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
const fixtures = await Promise.all(["create-task", "create-event", "create-time-block", "update-task-status", "create-carryover"].map(async (name) => JSON.parse(await readFile(join(root, "fixtures", `${name}.json`), "utf8"))));

test("manifest keeps WarMap reads normalized and writes approval-bound", () => {
  assert.deepEqual(validateManifest(manifest), []);
  assert.deepEqual(manifest.capabilities.write.map((entry) => entry.action), WRITE_ACTIONS);
  assert.equal(manifest.dynamicCodeLoading, false);
  assert.equal(manifest.trustedRuntime, "Orion");
});

test("offline fixtures cover every semantic action with complete payload metadata", () => {
  assert.deepEqual(validatePackage(manifest, fixtures), []);
  assert.deepEqual(fixtures.map((fixture) => fixture.action).sort(), [...WRITE_ACTIONS].sort());
});

test("validation rejects an invalid event type and missing idempotency header", () => {
  const event = fixtures.find((fixture) => fixture.action === "create_event");
  assert.ok(event);
  const invalid = structuredClone(event);
  invalid.body.type = "time_block";
  delete invalid.headers["Idempotency-Key"];
  assert.equal(validateFixture(invalid, "create_event").length, 2);
});
