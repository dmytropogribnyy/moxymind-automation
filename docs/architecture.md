# Architecture

## Design goals

The framework favors explicit Playwright primitives, typed boundaries, and useful failure evidence. It deliberately avoids building a large internal abstraction layer over Playwright.

## Main layers

### Playwright configuration

`playwright.config.ts` defines two independent projects:

- `ui` targets SauceDemo in Chromium and retains browser evidence on failure;
- `api` targets ReqRes with optional API-key headers.

Shared execution behavior includes strict CI focus protection, bounded retries, controlled worker count, HTML reporting, and environment-driven endpoints.

### Typed environment

`config/environment.ts` is the single boundary for environment variables. Boolean and positive-integer controls fail early when malformed, while stable defaults keep local execution straightforward.

### Fixtures

`fixtures/test.ts` wires Page Objects and the API client into Playwright's lifecycle. Tests declare only the dependencies they use, which keeps setup readable and avoids shared mutable state.

### Page Objects

The Page Objects under `pages/` contain locators and UI actions. They do not hide large business assertions or duplicate Playwright's waiting model. Tests retain ownership of scenario intent and expected outcomes.

### API client and schemas

`clients/reqres.client.ts` owns endpoint calls and elapsed-time measurement. `schemas/reqres.schemas.ts` validates runtime payloads and infers TypeScript types from the same source of truth.

The separation is intentional:

- the client knows how to communicate;
- schemas know what a valid contract looks like;
- tests know which statuses, headers, values, and invariants matter to the scenario.

### Evidence utilities

`utils/api-observability.ts` records API timings as Playwright annotations and JSON attachments. The response-time threshold becomes a failing assertion only when explicitly enabled.

## Dependency direction

```text
tests
  ├─ fixtures
  │   ├─ page objects
  │   └─ API client
  │       └─ runtime schemas
  ├─ typed test data
  └─ evidence utilities
          └─ typed environment
```

Lower layers do not import test specifications. External-service details are kept at configuration, client, and Page Object boundaries.

## Why this stays compact

- no generic base page;
- no custom assertion framework;
- no global mutable session state;
- no duplicated wrapper for standard Playwright actions;
- no browser matrix without a defined confidence need;
- no performance claim based on one public API request.

This keeps the codebase approachable for review while leaving clear extension points for additional services, fixtures, schemas, and risk-based suites.
