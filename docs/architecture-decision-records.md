# Architecture Decision Records

Architecture Decision Records (ADRs) capture the context, trade-offs, and consequences behind technical decisions that shape a system over time. They are intentionally lightweight: the goal is not bureaucracy, but a durable decision trail that helps engineers understand why the system works the way it does.

For a Senior .NET/Azure engineering context, ADRs are especially useful when decisions affect service boundaries, cloud platform choices, data ownership, security posture, reliability targets, or long-term delivery speed.

## Why ADRs matter

Good ADRs help teams:

- Preserve architectural reasoning after people, priorities, or constraints change.
- Make trade-offs explicit instead of hiding them in pull request comments or chat threads.
- Support onboarding by explaining the system through decisions, not just diagrams.
- Reduce repeated debates by recording the options that were considered and rejected.
- Create a professional audit trail for production-critical and compliance-sensitive systems.

## When to write an ADR

Create an ADR when a decision is meaningful, hard to reverse, or likely to influence other teams. Examples include:

- Choosing between a modular monolith, microservices, or event-driven architecture.
- Selecting Azure services such as Azure App Service, Azure Functions, AKS, Service Bus, Event Grid, Cosmos DB, or SQL Database.
- Defining API versioning, authentication, authorization, or tenant isolation standards.
- Introducing AI-assisted engineering workflows, code-generation guardrails, or review requirements.
- Changing deployment, observability, resilience, or incident-response patterns.
- Establishing a reusable engineering standard that future teams should follow.

Do not write an ADR for routine implementation details, small refactors, or decisions that are obvious from existing team standards.

## ADR template

```markdown
# ADR-0001: Decision title

## Status
Proposed | Accepted | Superseded | Deprecated

## Date
YYYY-MM-DD

## Context
What problem are we solving? What constraints, risks, business goals, and technical realities matter?

## Options considered
1. Option A — benefits, drawbacks, and risks.
2. Option B — benefits, drawbacks, and risks.
3. Option C — benefits, drawbacks, and risks.

## Decision
What did we choose, and why is it the best fit for the current context?

## Consequences
What improves, what becomes harder, and what follow-up work is required?

## Validation plan
How will we confirm the decision works in production? Include observability, rollout, rollback, and success metrics where relevant.

## Related links
- Pull request:
- Architecture diagram:
- Production readiness checklist:
```

## Decision quality checklist

Before accepting an ADR, confirm that it answers these questions:

- **Business alignment:** Does the decision connect to delivery goals, cost, risk, compliance, or customer outcomes?
- **Technical trade-offs:** Are rejected options documented honestly, including why they were not chosen?
- **Operational readiness:** Does the decision cover monitoring, deployment, resilience, security, and support ownership?
- **Azure/.NET fit:** Does the decision match the team's platform capabilities, runtime model, and cloud operating model?
- **Reversibility:** Does the ADR explain whether this is a one-way door or a decision that can be revisited cheaply?
- **AI governance:** If AI-assisted tooling is involved, are review, privacy, IP, and accountability expectations explicit?

## Example ADR summary

| Field | Example |
| --- | --- |
| Decision | Use Azure Service Bus for asynchronous order processing |
| Why | The workflow requires reliable queueing, retries, dead-letter handling, and decoupling between services |
| Rejected | Direct synchronous API calls because they increase coupling and amplify downstream outages |
| Consequences | Teams must define message contracts, idempotency rules, monitoring dashboards, and replay procedures |
| Validation | Track queue depth, dead-letter count, processing latency, retry rates, and incident frequency |

## Operating model

ADRs work best when they are part of normal engineering flow:

1. Draft the ADR before implementation when the decision is still open to challenge.
2. Review it with the same seriousness as production code.
3. Link the ADR from the related pull request, design document, or architecture diagram.
4. Update the status when a decision is superseded rather than deleting historical context.
5. Revisit accepted ADRs during incidents, migrations, and platform reviews.

## Related sections

- [Architecture Decision Framework](architecture-decision-framework.md) for structured decision-making criteria.
- [System Design](system-design.md) for architecture patterns and trade-off analysis.
- [Production Readiness Checklist](production-readiness-checklist.md) for operational validation before release.
- [Code Review Guide](code-review-guide.md) for reviewing architecture-impacting pull requests.
