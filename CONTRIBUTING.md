# Contributing

## Change principles

Changes should improve confidence, diagnostics, or maintainability for a concrete risk. Avoid adding layers, browser matrices, retries, or documents without a clear engineering benefit.

## Local validation

Use Node.js 20 or newer:

```bash
npm ci
npx playwright install chromium
npm run lint
npm run format:check
npm run typecheck
npm run test:all
```

Run the narrowest relevant suite during development, then run the full validation before opening a pull request.

## Test design

- map each scenario to a defined UI or API risk;
- keep Page Objects focused on selectors and actions;
- keep business assertions visible in test specifications;
- prefer role and `data-test` locators;
- do not add arbitrary waits;
- keep data-driven cases independently reported;
- add runtime schemas when introducing a new external API contract;
- treat public-service latency as diagnostic unless a controlled gate is explicitly required.

## Pull requests

A pull request should include:

- the risk or maintainability problem being addressed;
- the implementation summary;
- exact validation commands and results;
- any new evidence artifacts or environment controls;
- known external-service limitations.

Do not commit `.env`, reports, traces, screenshots, videos, or private credentials. CI rejects focused tests through Playwright's `forbidOnly` control.
