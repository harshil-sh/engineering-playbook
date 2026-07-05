# Architecture Decision Framework

Strong architecture is not about choosing the newest technology. It is about making decisions that are explicit, reversible where possible, and aligned with product goals, operational constraints, and long-term maintainability.

This framework is the decision model I use when evaluating system changes as a Senior .NET/Azure Engineer, especially for cloud platforms, regulated domains, integration-heavy systems, and teams adopting AI-assisted delivery practices.

## Decision principles

| Principle | What it means in practice |
| --- | --- |
| Business outcome first | Tie the decision to user value, compliance needs, delivery risk, cost, or measurable engineering improvement. |
| Prefer simple, proven designs | Choose boring, observable, well-supported technology unless the problem genuinely requires novelty. |
| Make trade-offs visible | Document what improves, what becomes harder, and who is affected by the decision. |
| Optimize for operability | Design for deployment, monitoring, incident response, rollback, and ownership from the beginning. |
| Keep reversibility in mind | Prefer decisions that can be changed safely unless the value of committing is clearly justified. |
| Use AI as an accelerator, not an authority | Let AI tools generate options, risks, and review prompts, while engineers remain accountable for judgement. |

## When to use this framework

Use this framework for decisions that are expensive to reverse, establish a team pattern, affect production reliability, or introduce meaningful delivery risk.

Typical examples include:

- Selecting a cloud service, data store, messaging pattern, or integration style.
- Splitting a monolith into services or consolidating duplicated services.
- Introducing Azure Functions, Service Bus, Event Grid, API Management, or Kubernetes.
- Changing authentication, authorization, audit, or data retention behaviour.
- Defining cross-team standards for APIs, observability, testing, or deployment.
- Adopting AI-assisted engineering workflows in delivery pipelines.

For smaller choices, use the same thinking but keep the documentation lightweight.

## Decision workflow

### 1. Define the problem clearly

Start with the constraint or outcome, not the preferred solution.

Ask:

- What user, operational, or business problem are we solving?
- What happens if we do nothing?
- What constraints are fixed: compliance, budget, latency, team capability, deadlines, or platform standards?
- What quality attributes matter most: reliability, security, maintainability, scalability, cost, or speed of change?

A good problem statement should be understandable by engineers, product stakeholders, and future maintainers.

### 2. Establish decision criteria

Agree on the criteria before comparing options. This prevents the team from retrofitting the criteria around a favourite solution.

Common criteria:

- **Reliability:** failure modes, retry strategy, graceful degradation, recovery time.
- **Security and compliance:** identity, access control, secrets, auditability, data residency.
- **Maintainability:** code clarity, testability, documentation, team familiarity.
- **Scalability:** load patterns, throughput limits, partitioning, queue depth, future growth.
- **Delivery risk:** implementation complexity, migration path, dependencies, time to validate.
- **Cost:** infrastructure spend, licensing, support burden, opportunity cost.
- **Observability:** logs, metrics, traces, dashboards, alerts, and diagnostic depth.

### 3. Compare realistic options

Evaluate two or three credible options. Include the option to do nothing when it is a real alternative.

For each option, capture:

- Summary of the approach.
- Benefits.
- Risks and trade-offs.
- Operational impact.
- Migration or rollout complexity.
- Evidence from prototypes, incidents, benchmarks, or platform guidance.

Avoid false precision. A short comparison table is usually more useful than a long document with unsupported claims.

### 4. Choose and document the decision

Record the decision in an Architecture Decision Record when it affects future engineering behaviour.

A strong decision record includes:

- Context and problem statement.
- Options considered.
- Decision and rationale.
- Consequences and known risks.
- Rollout, validation, and rollback plan.
- Owner and review date when the decision may need revisiting.

See [Architecture Decision Records](architecture-decision-records.md) and the [ADR template](playbook/decision-frameworks/adr-template.md) for a lightweight structure.

### 5. Validate in production-minded increments

Architecture is only successful when it works under real delivery and operational conditions.

Before broad rollout, define:

- The smallest safe slice to prove the decision.
- Automated tests and quality gates required before release.
- Observability needed to confirm expected behaviour.
- Rollback or mitigation steps if the decision performs poorly.
- A review point after production usage.

## Architecture review checklist

Use this checklist in design reviews or pull requests that implement architectural decisions.

- [ ] The problem statement is clear and tied to business or operational value.
- [ ] Quality attributes and constraints are explicit.
- [ ] At least two realistic options were considered.
- [ ] Security, compliance, and data handling risks are addressed.
- [ ] The design has a clear ownership and support model.
- [ ] Failure modes, retries, timeouts, and rollback paths are defined.
- [ ] Observability requirements are included before production release.
- [ ] Migration and compatibility risks are understood.
- [ ] The decision is captured in an ADR when it establishes a durable pattern.

## AI-assisted decision support

AI tools can improve the speed and breadth of architecture analysis when used deliberately.

Useful prompts include:

- "List failure modes for this Azure Service Bus integration and suggest mitigations."
- "Compare Azure Functions and containerized workers for this workload using reliability, cost, and operability criteria."
- "Review this ADR for missing risks, unclear assumptions, and rollback gaps."
- "Generate test scenarios for this event-driven workflow, including duplicate messages and partial failures."

The engineer remains responsible for validating suggestions against system context, production constraints, and organizational standards.

## Related sections

- [System Design Patterns](system-design-patterns.md) for common architectural building blocks.
- [Engineering Principles](engineering-principles.md) for the engineering values behind these decisions.
- [Testing Strategy](testing-strategy.md) for validating architectural choices through automated quality gates.
- [Code Review Guidelines](code-review-guidelines.md) for reviewing implementation quality and trade-offs.
