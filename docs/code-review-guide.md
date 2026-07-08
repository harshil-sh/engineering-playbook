# Code Review Guide

Code review is a leadership practice as much as a quality gate. A strong review protects production, improves system design, and helps engineers build better judgement over time. For Senior .NET/Azure engineering teams, review should make correctness, operational risk, security, and maintainability visible before the code reaches customers.

This guide defines a practical review model for production software, AI-assisted delivery, and technical leadership.

## Review outcomes

Every review should quickly produce one of three outcomes:

| Outcome | Meaning | Reviewer action |
| --- | --- | --- |
| Approve | The change is safe to merge and consistent with team standards. | Approve with a brief note if useful. |
| Request changes | There is a correctness, security, reliability, or maintainability issue. | State the blocking reason and expected fix. |
| Comment | There are questions, non-blocking improvements, or trade-offs to clarify. | Label comments clearly as questions, suggestions, or nits. |

Avoid leaving authors with ambiguous feedback. If a concern is important enough to block, say why. If it is optional, make that explicit.

## Reviewer priorities

Review in this order, from highest to lowest impact:

1. **Correctness:** Does the change satisfy the requirement under normal, edge, and failure conditions?
2. **Security and privacy:** Are identity, authorization, secrets, input validation, and data handling safe?
3. **Reliability:** Are timeouts, retries, idempotency, cancellation, and fallback behaviour appropriate?
4. **Operability:** Can the team observe, deploy, roll back, and support the change in production?
5. **Architecture:** Does the change respect boundaries, contracts, data ownership, and long-term maintainability?
6. **Testing:** Are tests meaningful at the right level, and do they cover the riskiest behaviour?
7. **Readability:** Will another engineer understand and safely modify this code later?
8. **Style:** Are formatter, lint, and naming conventions satisfied without excessive subjective debate?

## Pull request author checklist

Before requesting review, the author should confirm:

- [ ] The pull request has a clear purpose, scope, and summary of user or business impact.
- [ ] Risky areas are called out, including migrations, concurrency, permissions, or integration changes.
- [ ] Tests, linting, and build checks have been run locally or in CI.
- [ ] New configuration, feature flags, secrets, dashboards, alerts, or runbooks are documented where needed.
- [ ] The diff is focused and avoids unrelated formatting or refactoring.
- [ ] AI-generated code has been read, tested, and adapted by the engineer responsible for the change.

## Senior reviewer checklist

Use these prompts when reviewing APIs, services, background workers, and cloud infrastructure changes.

### .NET and API design

- [ ] Async code avoids `.Result`, `.Wait()`, and fire-and-forget tasks unless explicitly managed.
- [ ] `CancellationToken` is accepted and propagated through EF Core, HTTP, queue, and file operations where meaningful.
- [ ] API contracts use clear status codes, validation responses, pagination, versioning, and error models.
- [ ] Dependency injection lifetimes are appropriate and avoid hidden shared mutable state.
- [ ] Logging includes correlation context without leaking sensitive data.

### Azure and cloud operations

- [ ] Managed identity, Key Vault, and least-privilege access are preferred over static credentials.
- [ ] Infrastructure changes are reproducible through code or documented deployment steps.
- [ ] Queue, event, and worker processing includes retry limits, dead-letter handling, and idempotency.
- [ ] Application Insights, OpenTelemetry, metrics, and alerts cover the new or changed production path.
- [ ] Cost, scale, and regional availability assumptions are explicit for new Azure resources.

### Data and integration safety

- [ ] Database migrations are backward compatible or include a safe rollout and rollback plan.
- [ ] Queries are bounded, indexed where necessary, and avoid accidental N+1 behaviour.
- [ ] External calls have timeouts, resilient error handling, and clear ownership for failures.
- [ ] Message contracts are versioned or evolved in a way that protects existing consumers.
- [ ] Personally identifiable, financial, or regulated data is minimized, protected, and auditable.

### AI-assisted engineering

- [ ] AI-generated suggestions were validated against project standards and runtime behaviour.
- [ ] The change does not introduce unreviewed dependencies, licenses, generated secrets, or copied proprietary code.
- [ ] Tests demonstrate behaviour rather than only confirming the generated implementation.
- [ ] Prompts, assumptions, or generated design alternatives are captured when they affect durable decisions.

## Commenting standards

Use comment labels to reduce ambiguity:

- **Blocker:** Must be fixed before merge because it affects correctness, security, reliability, or production safety.
- **Should fix:** Important improvement that should normally be addressed before merge.
- **Question:** Clarification needed before deciding whether a change is required.
- **Suggestion:** Non-blocking improvement that the author may accept or decline.
- **Nit:** Small readability or naming improvement that should not delay delivery.

Good review comments are specific, respectful, and tied to impact.

> **Blocker:** This worker can process the same message twice after a retry. Please add an idempotency key or unique constraint before acknowledging the message.

> **Question:** Is this endpoint expected to return partial results when the downstream service times out, or should the request fail fast?

> **Suggestion:** Consider extracting the authorization rule into a named policy so the controller stays focused on request handling.

## Review operating model

A healthy review process needs explicit team norms:

- Acknowledge new pull requests within four business hours.
- Complete first review within one business day for normal changes.
- Prioritize hotfixes, incident follow-ups, and security changes explicitly.
- Split large changes when review would take more than about 30 minutes.
- Separate mechanical refactors from behaviour changes.
- Prefer pairing or a design discussion when comments become lengthy or repetitive.

The goal is not to maximize comments. The goal is to merge safe, understandable changes with shared ownership.

## Related sections

- [Code Review Guidelines](code-review-guidelines.md) for a deeper language-specific checklist.
- [Software Craftsmanship](software-craftsmanship.md) for maintainability and engineering standards.
- [Production Readiness Checklist](production-readiness-checklist.md) for deployment and operational review.
- [AI-Assisted Engineering](ai-assisted-engineering.md) for responsible use of AI during delivery.
