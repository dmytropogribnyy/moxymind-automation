# CI and Evidence

## Workflow goals

The workflow is designed to provide fast, reviewable confidence without an unnecessarily expensive browser matrix. It uses Node.js 20 and Chromium as the default execution profile.

## Triggers

- pull requests validate proposed changes;
- pushes to `main` validate the integrated revision;
- manual runs allow `all`, `smoke`, `ui`, or `api` selection.

Concurrency cancellation stops superseded work on the same ref. Repository permissions remain read-only.

## Validation sequence

Every execution performs the same quality baseline before tests:

```text
npm ci
npm run lint
npm run format:check
npm run typecheck
```

The selected Playwright suite then runs with CI focus protection and bounded retries. Chromium installation is skipped for API-only manual execution.

## Evidence lifecycle

### Always retained

- Playwright HTML report;
- GitHub Job Summary with suite, trigger, commit, and result.

### Retained on browser failure

- trace archive;
- screenshot;
- video.

### Retained on any test failure

- `test-results` artifact containing available diagnostics.

### API diagnostics

Each API request records elapsed time as:

- a Playwright annotation visible in the test result;
- a JSON attachment containing the operation, elapsed time, configured threshold, and whether the optional gate was enabled.

This provides evidence without treating uncontrolled public-network latency as a functional defect.

## Reading a failure

1. Open the failed GitHub Actions run and review the Job Summary.
2. Download or open the Playwright HTML report.
3. Identify the failed step and assertion.
4. For UI failures, inspect the trace first, then screenshot or video where useful.
5. For API failures, inspect status, headers, schema validation diagnostics, and the timing attachment.
6. Distinguish an external-service outage or contract change from a framework regression before rerunning.

## Artifact policy

Generated reports and test evidence are not committed to source control. Artifacts remain connected to the exact workflow run and commit that produced them. The default retention period is intentionally limited to control storage use while preserving near-term investigation evidence.

## Performance boundary

`API_PERFORMANCE_GATE=false` is the default. Enabling the gate is appropriate only when the target environment, network path, and threshold have been deliberately controlled. A public ReqRes timing observation is not load testing and does not establish capacity, throughput, or production service-level compliance.
