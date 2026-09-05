export const WRITE_ACTIONS = [
  "create_task",
  "create_event",
  "create_time_block",
  "update_task_status",
  "create_carryover"
];

const WRITE_ENDPOINTS = {
  create_task: { method: "POST", path: "/v1/actions/tasks" },
  create_event: { method: "POST", path: "/v1/actions/scheduled-items" },
  create_time_block: { method: "POST", path: "/v1/actions/scheduled-items" },
  update_task_status: { method: "PATCH", path: "/v1/actions/tasks/:id/status" },
  create_carryover: { method: "POST", path: "/v1/actions/carryovers" }
};

const REQUIRED_HEADERS = ["Authorization", "Idempotency-Key", "x-correlation-id"];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateManifest(manifest) {
  const errors = [];
  if (!isObject(manifest)) return ["Manifest must be an object."];
  if (manifest.id !== "warmap") errors.push("Manifest id must be warmap.");
  if (manifest.status !== "experimental") errors.push("WarMap plugin must remain experimental in this package.");
  if (manifest.trustedRuntime !== "Orion") errors.push("Orion must remain the trusted runtime.");
  if (manifest.dynamicCodeLoading !== false) errors.push("Arbitrary plugin code must not be dynamically loaded.");
  if (!Array.isArray(manifest.requestHeaders) || REQUIRED_HEADERS.some((header) => !manifest.requestHeaders.includes(header))) {
    errors.push("Manifest must require Authorization, Idempotency-Key, and x-correlation-id headers.");
  }
  const capabilities = manifest.capabilities;
  if (!isObject(capabilities)) return [...errors, "Manifest capabilities are required."];
  const reads = Array.isArray(capabilities.read) ? capabilities.read : [];
  for (const path of ["/v1/today", "/v1/agenda", "/v1/changes"]) {
    if (!reads.some((entry) => entry?.path === path && entry?.method === "GET")) errors.push(`Missing normalized read endpoint ${path}.`);
  }
  const writes = Array.isArray(capabilities.write) ? capabilities.write : [];
  const actions = writes.map((entry) => entry?.action);
  if (JSON.stringify(actions) !== JSON.stringify(WRITE_ACTIONS)) errors.push("Write capabilities must list the five actions in contract order.");
  for (const action of WRITE_ACTIONS) {
    const entry = writes.find((candidate) => candidate?.action === action);
    const expected = WRITE_ENDPOINTS[action];
    if (!entry) {
      errors.push(`Missing write capability ${action}.`);
      continue;
    }
    if (entry.method !== expected.method || entry.path !== expected.path) errors.push(`Write capability ${action} has an incompatible endpoint.`);
    if (entry.approvalRequired !== true || entry.idempotencyRequired !== true || entry.provenanceRequired !== true) errors.push(`Write capability ${action} must be approval, idempotency, and provenance bound.`);
  }
  return errors;
}

export function validateFixture(fixture, action) {
  const errors = [];
  const expected = WRITE_ENDPOINTS[action];
  if (!isObject(fixture)) return ["Fixture must be an object."];
  if (fixture.action !== action) errors.push(`Fixture action must be ${action}.`);
  if (fixture.method !== expected.method) errors.push(`Fixture ${action} method is invalid.`);
  if (action === "update_task_status" ? !String(fixture.endpoint ?? "").match(/^\/v1\/actions\/tasks\/[^/]+\/status$/) : fixture.endpoint !== expected.path) {
    errors.push(`Fixture ${action} endpoint is invalid.`);
  }
  if (!isObject(fixture.headers) || REQUIRED_HEADERS.some((header) => !hasText(fixture.headers[header]))) {
    errors.push(`Fixture ${action} is missing required request headers.`);
  }
  if (!isObject(fixture.body)) {
    errors.push(`Fixture ${action} body is required.`);
    return errors;
  }
  const provenance = fixture.body.provenance;
  if (!isObject(provenance) || !hasText(provenance.sourceSystem) || !hasText(provenance.sourceProposalId) || !hasText(provenance.sourceEvidenceId) || !hasText(provenance.actorId) || !hasText(provenance.correlationId)) {
    errors.push(`Fixture ${action} must include complete mutation provenance.`);
  }
  if (action === "create_task" && (!hasText(fixture.body.title) || !hasText(fixture.body.workspaceId))) errors.push("Task fixture needs title and workspaceId.");
  if ((action === "create_event" || action === "create_time_block") && (fixture.body.type !== (action === "create_event" ? "event" : "time_block") || !hasText(fixture.body.workspaceId) || !hasText(fixture.body.startDateTime) || !hasText(fixture.body.endDateTime))) {
    errors.push(`Fixture ${action} must carry a complete scheduled-item payload with the correct type.`);
  }
  if (action === "update_task_status" && !["backlog", "active", "scheduled", "blocked", "done", "dropped"].includes(fixture.body.status)) errors.push("Task status fixture has an invalid status.");
  if (action === "create_carryover" && (!hasText(fixture.body.sourceItemId) || !["reschedule", "convert_to_task", "drop", "mark_done", "defer"].includes(fixture.body.action))) errors.push("Carryover fixture needs sourceItemId and a valid action.");
  return errors;
}

export function validatePackage(manifest, fixtures) {
  const errors = validateManifest(manifest);
  const fixtureActions = fixtures.map(({ action }) => action).sort();
  if (JSON.stringify(fixtureActions) !== JSON.stringify([...WRITE_ACTIONS].sort())) errors.push("Fixtures must cover every write action exactly once.");
  for (const fixture of fixtures) errors.push(...validateFixture(fixture, fixture.action));
  return errors;
}
