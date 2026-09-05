import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validatePackage } from "../src/contract.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
const fixtureNames = ["create-task", "create-event", "create-time-block", "update-task-status", "create-carryover"];
const fixtures = await Promise.all(fixtureNames.map(async (name) => JSON.parse(await readFile(join(root, "fixtures", `${name}.json`), "utf8"))));
const errors = validatePackage(manifest, fixtures);
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated WarMap experimental contract: ${fixtures.length} write fixtures.`);
}
