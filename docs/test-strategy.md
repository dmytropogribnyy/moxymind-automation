# Test Strategy

## Purpose

This strategy defines how Moxymind Quality Automation builds practical confidence in critical retail browser journeys and REST API contracts. Coverage is selected by business and integration risk rather than by raw test count.

## Risk model

The highest-priority risks are:

1. authentication or session controls prevent legitimate access or allow invalid access;
2. users cannot create a correct cart and complete an order;
3. checkout validation permits incomplete data;
4. displayed product state, prices, or order summaries become inconsistent;
5. API consumers receive an incompatible status, header, payload, pagination model, or timestamp;
6. external test-service instability is mistaken for a product regression.

## Suite boundaries

### UI

Browser coverage is used when confidence depends on rendering, navigation, accessible controls, client-side state, or a multi-page user journey. Page Objects own locators and actions. Assertions stay in test specifications unless a narrowly reusable assertion clearly improves diagnostics.

### API

API coverage owns transport and contract behavior. The typed client performs requests, Zod validates response structures at runtime, and tests assert business-relevant invariants. Data-driven payloads are expanded into separate named tests so one failure does not mask the remaining cases.

## Execution groups

| Group         | Intent                                                  | Current examples                                                                                 |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `@smoke`      | Fast confidence after a change                          | valid login, complete checkout, paginated GET contract                                           |
| `@critical`   | Main outcome cannot be released confidently when broken | retail purchase path, principal API listing contract                                             |
| `@regression` | Wider behavior and defensive checks                     | access denial, logout, sorting, validation, cart state, negative API response, creation variants |

`@ui` and `@api` identify the technical boundary and can be combined with the risk tags.

## Test data

- public SauceDemo credentials are centralized in `test-data/users.ts`;
- product and customer inputs are centralized in `test-data/products.ts`;
- API payloads are checked against the same TypeScript types inferred from runtime schemas;
- tests do not depend on execution order or persistent state created by another test.

## Reliability policy

- no arbitrary sleeps;
- no `.only` in CI;
- zero retries locally and one retry in CI;
- failures are investigated rather than hidden with higher retry counts;
- selectors prefer roles and explicit test attributes;
- public-service latency is recorded, but it is not a functional gate unless explicitly enabled;
- a repeated intermittent failure should be isolated with evidence and corrected before expanding coverage.

## Evidence

Browser failures retain trace, screenshot, and video evidence. API tests attach structured timing records. All tests produce an HTML report, and CI adds a concise workflow summary. Evidence is associated with the workflow revision that generated it.

## Release-confidence criteria

For the repository's covered scope, confidence requires:

- lint, formatting, and strict typecheck passing;
- no focused tests or hardcoded private credentials;
- all selected smoke and critical tests passing;
- regression failures either corrected or explicitly understood before merge;
- generated evidence available for failed tests;
- external-service limitations distinguished from framework defects.

This is a risk-based signal for the covered journeys and contracts, not a claim of exhaustive product quality.
