# AI Agent Instructions

This repository is a small Node.js application using ESM modules.

## Key details

- Entry point: `src/index.js`
- Runtime: Node.js with `type: module` enabled in `package.json`
- Dependencies: `express`
- Current app: simple Express server with a single `GET /` route and JSON body parsing

## Useful commands

- `npm start` - run the app normally
- `npm run dev` - run the app with Node's file watcher
- `npm test` - placeholder test script; there are no real tests yet

## Guidance for changes

- Preserve ESM semantics when editing source files (`import` / `export` instead of `require`)
- Keep the main server file under `src/index.js` unless adding a clear reason to restructure
- If new routes or features are added, update `package.json` only as needed for new dependencies
- The current project is small; prefer simple, readable Express code and avoid unnecessary abstractions

## When working on this repository

- Look at `package.json` for runtime and script behavior
- Assume this is a learning/course project rather than a production system
- Do not create a large framework unless the user explicitly asks for one
