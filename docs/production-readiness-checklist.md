# Production Readiness Checklist

Production readiness is the discipline of proving that a system can be safely deployed, operated, observed, and recovered before it carries real user or business impact.

This checklist is designed for Senior .NET/Azure engineering teams shipping APIs, event-driven services, background workers, data integrations, and AI-assisted delivery workflows. Use it before go-live, major releases, platform migrations, and architectural changes that affect reliability, security, or operational ownership.

## How to use this checklist

Use the checklist as a release gate, not as paperwork after the decision is already made.

- Start during design so reliability, security, and supportability are built in early.
- Keep evidence lightweight: links to dashboards, pull requests, ADRs, runbooks, and test reports are enough.
- Assign clear owners for every open risk before release.
- Prefer measurable acceptance criteria over subjective confidence.
- Revisit the checklist after incidents, scale changes, or major dependency changes.

## 1. Ownership and operational model

- [ ] Service ownership is documented, including primary team, escalation path, and support expectations.
- [ ] The system has a named technical owner for architecture, reliability, and production change decisions.
- [ ] Support hours, incident severity definitions, and response expectations are agreed with stakeholders.
- [ ] Runbooks exist for common operational tasks, known failure modes, and manual recovery steps.
- [ ] Dependencies on external teams, vendors, shared platforms, or cloud services are documented.

## 2. Architecture and dependencies

- [ ] The architecture has been reviewed against the [Architecture Decision Framework](architecture-decision-framework.md).
- [ ] Critical dependencies are identified, including Azure services, databases, queues, APIs, identity providers, and third-party integrations.
- [ ] Failure modes are understood for downstream outages, partial failures, retries, duplicate messages, throttling, and stale data.
- [ ] Timeouts, retries, circuit breakers, idempotency, and graceful degradation are implemented where appropriate.
- [ ] Important architectural decisions are captured in an ADR or linked design note.

## 3. Security, identity, and compliance

- [ ] Authentication and authorization paths are tested for valid users, invalid users, expired credentials, and least-privilege access.
- [ ] Secrets are stored in managed secret stores such as Azure Key Vault and are not committed to source control.
- [ ] Sensitive data is classified, encrypted in transit and at rest, and excluded from logs unless explicitly approved.
- [ ] Audit requirements are implemented for high-risk actions, administrative access, and data changes.
- [ ] Data retention, residency, privacy, and compliance obligations are documented and testable.

## 4. Quality gates and automated validation

- [ ] Unit, integration, contract, and end-to-end tests cover the highest-risk behaviours.
- [ ] CI validates formatting, static analysis, dependency checks, tests, and build output before merge.
- [ ] Database migrations, message contracts, and API changes are backward compatible or have a safe migration plan.
- [ ] Performance-sensitive paths have baseline measurements and clear regression thresholds.
- [ ] AI-assisted code changes receive the same human review, test evidence, and security scrutiny as manually written code.

## 5. Observability and diagnostics

- [ ] Structured logs include correlation identifiers and enough context to diagnose failures without exposing sensitive data.
- [ ] Metrics exist for availability, latency, throughput, error rate, saturation, queue depth, and business-critical outcomes.
- [ ] Distributed tracing is enabled across service boundaries where request flow matters.
- [ ] Dashboards show service health, dependency health, deployment markers, and release-specific indicators.
- [ ] Alerts are actionable, routed to the right owner, and include links to dashboards and runbooks.

## 6. Deployment and release safety

- [ ] Infrastructure, configuration, and application changes are versioned and reproducible.
- [ ] Environments are aligned closely enough that production behaviour can be predicted from lower-environment validation.
- [ ] Feature flags, staged rollout, blue-green deployment, or canary release strategies are used for high-risk changes.
- [ ] Rollback and roll-forward paths are documented and tested before release.
- [ ] Release notes identify user impact, operational risks, validation steps, and post-release monitoring actions.

## 7. Resilience, recovery, and continuity

- [ ] Recovery time objective and recovery point objective are defined for the service or business capability.
- [ ] Backups, restore procedures, and data recovery paths are tested rather than assumed.
- [ ] The service handles dependency failure without cascading avoidable failures across the platform.
- [ ] Queue-based and event-driven workloads can recover safely from poison messages, replay, duplication, and ordering issues.
- [ ] Capacity limits, autoscaling rules, quotas, and cost guardrails are understood before production load increases.

## Go-live decision record

Before release, capture a short decision record:

| Question | Answer |
| --- | --- |
| What is being released? |  |
| Who owns production support? |  |
| What are the top three risks? |  |
| What evidence proves readiness? |  |
| What is the rollback or mitigation plan? |  |
| What will be monitored after release? |  |

## Related sections

- [Architecture Decision Framework](architecture-decision-framework.md) for evaluating design trade-offs before release.
- [Testing Strategy](testing-strategy.md) for automated validation practices.
- [Code Review Guidelines](code-review-guidelines.md) for reviewing production-quality implementation.
- [Incident Response](playbook/operational-excellence/incident-response.md) for responding when production behaviour does not match expectations.
