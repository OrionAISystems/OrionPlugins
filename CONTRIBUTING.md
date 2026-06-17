# Contributing

OrionPlugins is intended for production-minded, reusable plugin development.

## Expectations

- Keep changes scoped to a clear plugin, documentation area, or repository workflow.
- Document new plugin behavior in the plugin README and, when relevant, `docs/plugin-catalog.md`.
- Avoid committing secrets, environment-specific credentials, or private operational data.
- Prefer existing project conventions before adding new tooling or dependencies.
- Add focused tests or validation when introducing executable behavior.

## Adding a Plugin

1. Create a directory under `plugins/<plugin-name>`.
2. Add a plugin-level README that explains purpose, host compatibility, installation, configuration, and verification.
3. Keep shared domain logic separate from host adapters when the plugin targets multiple environments.
4. Update `docs/plugin-catalog.md` with the plugin status and import notes.
5. Add validation, tests, or examples appropriate to the plugin maturity.

## Public Release Readiness

Before treating a plugin as ready for public use, confirm:

- licensing is explicit
- installation steps are reproducible
- required secrets are documented and never committed
- supported host environments are named
- compatibility constraints are documented
- verification commands pass from a clean checkout
