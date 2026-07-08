# Incident Response

Incident response is the discipline of restoring customer trust when production systems fail. A strong response is calm, time-boxed, evidence-led, and focused on reducing impact before assigning root cause. For Senior .NET/Azure engineers, this means combining technical diagnosis with clear leadership, customer-aware communication, and durable follow-up.

This guide defines a pragmatic operating model for cloud services, APIs, background workers, integrations, and AI-assisted engineering teams.

## Response principles

| Principle | What it means in practice |
| --- | --- |
| Protect customers first | Prioritize containment, rollback, degradation, or failover before deep investigation. |
| Establish one incident lead | Give one person authority to coordinate decisions, owners, updates, and escalation. |
| Work from evidence | Use telemetry, recent changes, dependency status, and customer impact instead of assumptions. |
| Communicate early and clearly | Share known facts, impact, next update time, and uncertainty without speculation. |
| Learn without blame | Treat incidents as system feedback and convert findings into accountable improvements. |

## Severity model

Use severity to align urgency, communication, and escalation.

| Severity | Typical impact | Expected response |
| --- | --- | --- |
| SEV1 | Major outage, data integrity risk, security exposure, or critical customer journey unavailable | Immediate incident lead, executive/customer updates, war room, continuous mitigation work. |
| SEV2 | Significant degradation, partial outage, failed integration, or high-priority customer impact | Named owner, frequent updates, active mitigation, same-day follow-up actions. |
| SEV3 | Limited customer impact, workaround available, or non-critical operational issue | Triage during business hours or on-call window with tracked remediation. |
| SEV4 | Low-impact defect, noisy alert, documentation gap, or improvement item | Backlog with owner and priority based on risk. |

Severity can change as evidence improves. Downgrade or escalate explicitly so responders and stakeholders stay aligned.

## Incident roles

Clear roles prevent duplicated effort and missed communication.

- **Incident lead:** Owns coordination, severity, timeline, decisions, and escalation.
- **Technical lead:** Drives diagnosis, mitigation options, rollback decisions, and validation.
- **Communications owner:** Sends stakeholder updates, customer-facing summaries, and support notes.
- **Scribe:** Captures timeline, commands, dashboards, hypotheses, decisions, and action items.
- **Subject matter experts:** Join only when their system, dependency, or domain knowledge is needed.

In smaller teams, one person may cover multiple roles, but the responsibilities should still be explicit.

## Response workflow

### 1. Detect and declare

- Confirm the alert, customer report, deployment signal, or dependency failure.
- Open an incident channel or call and name the incident lead.
- State severity, affected services, known impact, and the next update time.
- Start a timeline immediately, including detection time and first customer impact if known.

### 2. Triage impact

- Identify affected user journeys, tenants, regions, APIs, queues, jobs, and integrations.
- Compare dashboards for availability, latency, error rate, saturation, queue depth, and dependency failures.
- Review recent changes: deployments, feature flags, configuration, infrastructure, certificates, secrets, and data migrations.
- Decide whether to roll back, disable a feature, scale out, drain queues, fail over, or apply a hotfix.

### 3. Mitigate and restore

- Prefer the safest reversible mitigation that reduces customer impact quickly.
- Validate recovery through telemetry and representative user journeys, not only green deployments.
- Keep communication updates short: current impact, mitigation underway, confidence level, and next update time.
- Avoid speculative root cause statements until the system is stable and evidence is reviewed.

### 4. Close and follow up

- Confirm service health has remained stable for an agreed observation window.
- Share a closure update with impact, duration, mitigation, and next steps.
- Create follow-up work for code fixes, tests, alerts, dashboards, runbooks, resilience patterns, or dependency ownership.
- Schedule a post-incident review for SEV1/SEV2 incidents and recurring SEV3 issues.

## Azure and .NET operational checklist

For Azure-hosted .NET systems, responders should know where to find:

- Application Insights logs, traces, exceptions, dependency calls, and live metrics.
- Azure Monitor alerts, metric charts, action groups, and availability tests.
- Deployment history for App Service, Azure Functions, containers, pipelines, and infrastructure as code.
- Azure Service Bus queue depth, dead-letter counts, retry behaviour, duplicate detection, and message age.
- Database health for Azure SQL, PostgreSQL, Cosmos DB, connection pools, locks, DTU/vCore pressure, and slow queries.
- Key Vault, managed identity, certificate expiry, configuration, and secret rotation status.
- Feature flags, release toggles, rollback procedures, and emergency access paths.

## AI-assisted incident response

AI tools can accelerate response when used as an assistant, not as the decision-maker.

Use AI to:

- Summarize incident timelines, logs, traces, and deployment diffs for human review.
- Generate hypotheses from symptoms, recent changes, and known failure modes.
- Draft stakeholder updates, post-incident review notes, and remediation tickets.
- Review runbooks for missing validation steps, rollback commands, or observability gaps.

Do not paste secrets, customer data, or sensitive logs into tools that are not approved for that data. Engineers remain accountable for validating every AI-generated recommendation before acting on it.

## Post-incident review questions

A useful review should answer:

- What happened, when did it start, and how was it detected?
- Which customers, workflows, data, or integrations were affected?
- What reduced impact, and what delayed recovery?
- Which controls failed or were missing: tests, alerts, dashboards, runbooks, rollout strategy, or ownership?
- What changes will reduce likelihood, blast radius, detection time, or recovery time?
- Who owns each action, what is the due date, and how will completion be verified?

## Incident readiness checklist

- [ ] Critical services have dashboards for availability, latency, errors, saturation, and dependencies.
- [ ] Alerts are actionable, owned, severity-mapped, and linked to runbooks.
- [ ] Rollback, feature flag, and emergency mitigation paths are documented and tested.
- [ ] On-call engineers can access logs, traces, deployment history, and cloud resources safely.
- [ ] SEV1/SEV2 incidents produce a timeline, review, and tracked corrective actions.
- [ ] Repeated incidents trigger architecture or reliability investment, not only local fixes.

## Related sections

- [Production Readiness Checklist](production-readiness-checklist.md) for validating operational controls before launch.
- [Engineering Metrics](engineering-metrics.md) for tracking recovery, alert quality, and recurrence trends.
- [System Design](system-design.md) for designing failure handling and observability into architecture.
- [AI-Assisted Engineering](ai-assisted-engineering.md) for responsible AI use in engineering workflows.
