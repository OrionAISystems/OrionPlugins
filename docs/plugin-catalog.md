# Plugin Catalog

This catalog tracks public plugin packages planned or maintained in this repository.

## Status Key

- `planned`: documented intent, no implementation yet
- `experimental`: early implementation, APIs may change
- `stable`: supported public import surface
- `deprecated`: retained for compatibility, not recommended for new use

## Plugins

| Plugin | Status | Primary Hosts | Notes |
| --- | --- | --- | --- |
| GeoCore plugins | planned | Codex, Orion | Future public integrations for geospatial data, routing, and place intelligence workflows. |
| WarMap execution contract | experimental | Orion, Codex | Normalized Today/agenda/change reads plus five explicit approval-bound semantic WarMap writes. Orion remains the trusted runtime; arbitrary plugin code is not dynamically loaded. Validate with `npm test --prefix plugins/warmap` and `npm run validate --prefix plugins/warmap`. |

## Catalog Maintenance

Update this file whenever a plugin is added, renamed, promoted, deprecated, or receives a meaningful change in host compatibility.
