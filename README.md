# OrionPlugins

Public open-source plugin workspace for Orion AI Systems.

This repository will house plugins and integration packages that make Orion AI Systems projects, including GeoCore and WarMap, easier to import into developer tools such as Codex, Orion, and adjacent automation environments.

## Purpose

OrionPlugins is intended to be a durable public home for reusable plugin surfaces rather than a collection of one-off snippets. Each plugin should have a clear ownership boundary, import story, documentation path, and verification workflow.

## Repository Structure

```text
.
├── docs/
│   └── plugin-catalog.md
├── plugins/
│   └── warmap/
│       ├── manifest.json
│       ├── fixtures/
│       ├── src/
│       └── tests/
├── .github/
│   └── workflows/
│       └── validate.yml
├── CONTRIBUTING.md
└── README.md
```

## Plugin Layout

Each plugin should live under `plugins/<plugin-name>` and include its own README. A plugin directory should document:

- supported host environments
- installation and import steps
- exported capabilities
- configuration and secrets requirements
- development and verification commands
- compatibility notes

Suggested plugin shape:

```text
plugins/
└── example-plugin/
    ├── README.md
    ├── package.json
    ├── src/
    └── tests/
```

The exact structure can vary by plugin type, but each plugin should remain independently understandable and easy to import.

## Development Principles

- Keep plugins focused on stable, reusable integration surfaces.
- Separate host-specific adapters from shared domain logic where practical.
- Document configuration and security expectations before publishing a plugin as usable.
- Prefer small, explicit interfaces over hidden side effects.
- Add verification workflows alongside meaningful plugin behavior.

## Current Phase

This repository is in its foundation phase. `plugins/warmap` is the first experimental contract package. It describes normalized WarMap reads, proposal capability, and the five narrow approval-bound semantic writes without dynamically loading arbitrary plugin code. Orion remains the trusted runtime and WarMap remains the local execution-state authority.

Validate it with:

```bash
npm test --prefix plugins/warmap
npm run validate --prefix plugins/warmap
```

The package contains offline request fixtures only; it does not include credentials, a live connector, or a stable public distribution promise.

## License

No license has been added yet. Add an explicit open-source license before publishing reusable code for external adoption.
