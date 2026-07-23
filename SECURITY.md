# Security Policy

## Reporting

Please report suspected credential exposure, unsafe test behavior, or dependency vulnerabilities privately to the repository owner through the contact details linked from the engineering portfolio:

https://dmytropogribnyy.github.io/

Do not publish secrets, tokens, cookies, private test data, or exploit details in a public issue.

## Repository safeguards

- local `.env` files and generated evidence are excluded from source control;
- GitHub Actions uses read-only repository permissions;
- external credentials are read from environment variables or repository secrets;
- tests target public test services and do not perform destructive production actions;
- API keys, authenticated cookies, and private customer data must never be committed;
- dependency and workflow changes require the same lint, typecheck, and test validation as application code.

This repository does not define a separate release-support SLA. Security findings are reviewed according to severity and available evidence.
