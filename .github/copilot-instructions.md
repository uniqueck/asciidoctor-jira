# Copilot Instructions

## Build, test, and lint commands

This package targets **Node.js >= 22**. CI runs on Node 22.x and 24.x.

```sh
npm ci
npm run lint
npm run lint:fix
npm test
npm run test:node
npm run test:antora
npx mocha test/test.spec.js --grep "Registration"
npx mocha test/antora/antora.spec.js --grep "blockmacro: default jql"
```

There is no separate build script for the published package. If you change LF-ET sources under `lfet/`, regenerate the committed JavaScript with:

```sh
npm run lfet:install
npm run lfet:GenSrc
```

Tests and local rendering expect Jira Cloud credentials in `.env`. The current code reads `.env` on extension load and supports either:

- `JIRA_CLIENT_ID` + `JIRA_CLIENT_SECRET` + `JIRA_CLOUD_NAME`
- `JIRA_API_TOKEN` + `JIRA_CLOUD_NAME`

## High-level architecture

- `lib/asciidoctor-jira.js` is the public entry point. `register()` loads `.env`, patches the runtime context for Antora when `contentCatalog` is present, and registers three macros: the `jira` block macro, the `roadmap` block macro, and the `jira` inline macro.
- `lib/Jira.js` is the shared Jira client used by all macros. It handles OAuth/API-token auth, resolves the Atlassian Cloud ID and frontend URL, runs Jira search requests, and computes the output directory used for generated images.
- `lib/blockmacro/jiraIssuesBlockmacro.js` turns Jira issue search results into AsciiDoc table content and reparses it through Asciidoctor. Most table customization comes from document attributes such as header labels, default values, and column widths.
- `lib/blockmacro/roadmapBlockmacro.js` builds PlantUML Gantt content from Jira issues, hashes that content into a deterministic SVG filename, downloads the rendered diagram through `lib/common/fetch.js`, and emits an image macro.
- Antora support is not a separate extension: `lib/antora-adapter.js` swaps the default filesystem-backed VFS for one that reads from and writes generated images into Antora’s content catalog. `lib/node-fs.js` is the non-Antora fallback.
- Tests are split by runtime surface: `test/test.spec.js` covers direct Asciidoctor conversion, while `test/antora/antora.spec.js` generates a full Antora site from `test/antora/antora-playbook.yml` and asserts on rendered HTML plus generated roadmap SVG assets.

## Key conventions

- Several config modules are generated from LF-ET decision tables and are committed as generated artifacts: `lib/common/jiraConfig.js`, `lib/common/plantumlConfig.js`, `lib/common/plantumlGanttConfig.js`, and `lib/blockmacro/roadmapBlockmacroConfig.js`. Respect the `DO NOT MODIFY` header and edit the corresponding files under `lfet/` instead.
- Attribute precedence is consistent across the extension: macro attributes win, then document attributes, then hard-coded defaults. Preserve that order when changing roadmap, PlantUML, or table configuration logic.
- Dual runtime support matters. Changes that affect generated files or file access usually need to work in both plain Node/Asciidoctor and Antora, so related updates often span `lib/asciidoctor-jira.js`, `lib/antora-adapter.js`, `lib/node-fs.js`, and `lib/common/fetch.js`.
- The `jira` block macro accepts dotted field paths such as `reporter.displayName`, but document attribute overrides convert dots to hyphens and lower-case the key (for example `jira-table-header-reporter-displayname-label`).
- Roadmap output is expected to be deterministic. Tests assert on exact PlantUML-derived filenames and rendered markup, so avoid incidental changes to content ordering, default labels, or SVG naming.


## Typical workflow for a change is:
1. ask for the github issue to work on
2. assign the issue to yourself and move it to the "In Progress" column
3. create a new branch off `main` with a descriptive name
4. all configuration changes should be made through LF-ET decision tables under `lfet/`. Identify which table(s) to update based on the nature of the change:
   - For Jira config changes (for example, new default values or supported fields), update `lfet/jiraConfig.lfet`.
   - For PlantUML config changes (for example, new default labels or supported fields), update `lfet/plantumlConfig.lfet`.
   - For roadmap-specific config changes (for example, new Gantt settings or supported fields), update `lfet/plantumlGanttConfig.lfet` and/or `lfet/roadmapBlockmacroConfig.lfet` as appropriate.
5. If the change affects generated files, run the appropriate `npm run lfet:*`
6. Make code changes in `lib/` as needed, respecting the conventions above.
7. Update or add tests under `test/` or `test/antora/` as needed.
8. Run the full test suite and ensure all tests pass.
9. Check if documentation needs to be updated and make changes if necessary.
10. Commit your changes with a clear message that references any relevant issues or discussion, following the project's commit message guidelines if applicable.
11. Open a pull request with a clear description of the change and its motivation, referencing any relevant issues or discussions.
12. Address any feedback from code reviewers and iterate on the pull request until it is approved and merged.
13. After merging, monitor the main branch for any issues that may arise from the change and be prepared to address them promptly.