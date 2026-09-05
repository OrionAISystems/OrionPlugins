# WarMap Execution Contract

Experimental, offline contract metadata for the Orion -> WarMap integration.

## Boundary

Orion is the trusted runtime and approval coordinator. WarMap remains the local execution-state authority. This package describes the compatibility boundary; it does not dynamically load arbitrary plugin code and it does not contain credentials or a live transport client.

The normalized read surface is:

- `GET /v1/today`
- `GET /v1/agenda?start=&end=&timezone=`
- `GET /v1/changes?since=&limit=`

`GET /v1/state` is retained only as a compatibility fallback for older WarMap runtimes.

The approval-bound write surface is limited to:

- `create_task`
- `create_event`
- `create_time_block`
- `update_task_status`
- `create_carryover`

Every write requires a complete semantic payload, service authorization, `Idempotency-Key`, `x-correlation-id`, mutation provenance, operator approval, and audit capture. The endpoint metadata is manifest-owned; arbitrary endpoints are not accepted.

## Files

- `manifest.json` - read, propose, write, endpoint, header, and authority metadata.
- `fixtures/` - offline JSON request examples for all five actions.
- `src/contract.mjs` - dependency-free manifest and fixture validation.
- `tests/contract-validation.test.mjs` - contract coverage, including invalid type/header rejection.

## Verification

From the repository root:

```bash
npm test --prefix plugins/warmap
npm run validate --prefix plugins/warmap
```

This package remains experimental. Stable public release and license selection are intentionally outside the current pass.
