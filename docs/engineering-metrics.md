# Engineering Metrics

Engineering metrics should help teams make better decisions, not create surveillance or vanity reporting. Used well, they reveal delivery friction, production risk, quality trends, and investment opportunities. Used poorly, they reward local optimisation, inflate activity, and damage trust.

For Senior .NET/Azure engineering leadership, the goal is to connect measurable signals with business outcomes, operational readiness, and sustainable team performance.

## Measurement principles

| Principle | What it means in practice |
| --- | --- |
| Measure outcomes, not activity | Prefer customer impact, reliability, flow, and quality signals over commit counts or hours logged. |
| Pair metrics with context | Review trends alongside incidents, roadmap pressure, staffing changes, migrations, and dependency constraints. |
| Use metrics for learning | Treat metrics as prompts for investigation, not automatic judgement of individuals or teams. |
| Balance speed and safety | Delivery velocity matters only when quality, security, and operational confidence remain healthy. |
| Make ownership explicit | Every important metric should have a clear owner, review cadence, and improvement path. |

## Core metric categories

### Delivery flow

Delivery flow metrics show how efficiently ideas move from commitment to production.

- **Lead time for changes:** Time from code committed or pull request opened to successful production deployment.
- **Cycle time:** Time from work starting to completion, including review, validation, and release delays.
- **Deployment frequency:** How often the team releases valuable, production-ready changes.
- **Pull request age and review wait time:** Signals for collaboration bottlenecks, large changes, unclear ownership, or overloaded reviewers.
- **Build and pipeline duration:** Feedback-loop cost across restore, compile, test, security scanning, container build, and deployment stages.

Use these metrics to identify waiting time. Do not use them to pressure engineers into shipping larger riskier batches.

### Quality and maintainability

Quality metrics should highlight the cost of change and the confidence of the engineering system.

- **Escaped defects:** Defects found after release, grouped by severity, detection method, and missing control.
- **Change failure rate:** Percentage of deployments that cause incidents, rollbacks, hotfixes, or customer-visible degradation.
- **Rework rate:** Work reopened because requirements, implementation, tests, or review quality were insufficient.
- **Test reliability:** Flaky test rate, average test duration, and failed builds caused by test instability.
- **Technical debt signals:** Repeated defects in the same component, high change concentration, obsolete dependencies, and areas with low ownership clarity.

Quality measurement should drive better testing, design, review, and observability practices rather than blame.

### Operational excellence

Operational metrics show whether the team can detect, diagnose, and recover from production problems.

- **Availability and error rates:** Service-level indicators for critical customer journeys, APIs, workers, and integrations.
- **Latency and throughput:** Percentile-based performance for user-facing and background processing paths.
- **Mean time to detect and restore:** How quickly the team notices a problem and returns the system to an acceptable state.
- **Alert quality:** Actionable alerts versus noisy, duplicate, or unactionable notifications.
- **Incident recurrence:** Repeated failures that indicate weak corrective actions or unresolved systemic risk.

For Azure workloads, connect these signals to Application Insights, Azure Monitor, log analytics, dashboards, and runbooks owned by the delivery team.

### Product and customer impact

Engineering metrics are strongest when they connect technical work to user value.

- **Feature adoption:** Whether shipped capabilities are being used by the intended users or workflows.
- **Customer friction:** Support tickets, failed journeys, retries, abandonment, and manual operational workarounds.
- **Time to value:** How quickly a delivered change creates measurable business or user benefit.
- **Experiment learning rate:** How quickly the team validates assumptions and decides whether to continue, change, or stop an initiative.

This protects teams from optimizing only internal delivery speed while missing whether the work matters.

## DORA metrics in practice

DORA metrics are useful as a balanced view of delivery performance:

| Metric | Leadership question |
| --- | --- |
| Deployment frequency | Can we release small, valuable changes regularly? |
| Lead time for changes | How long does it take to turn a safe change into production value? |
| Change failure rate | Are we moving quickly without creating avoidable production risk? |
| Mean time to restore | Can we recover quickly when failure happens? |

Use DORA metrics as trend indicators across teams or systems with similar contexts. Avoid ranking individuals or comparing teams without understanding architecture, domain complexity, compliance constraints, and operational ownership.

## AI-assisted engineering metrics

AI tools can improve throughput, but the useful question is whether they improve validated outcomes.

Track signals such as:

- Reduction in mechanical work for scaffolding, tests, documentation, and refactoring support.
- Review findings in AI-assisted changes compared with manually authored changes.
- Defects or security issues introduced through generated code.
- Time saved in creating first drafts of ADRs, runbooks, test cases, and migration plans.
- Engineer confidence that generated output was understood, adapted, and validated.

The metric should never be “how much code was generated.” The useful metric is whether AI helped the team ship safer, clearer, better-tested software with less waste.

## Review cadence

A practical operating rhythm keeps metrics lightweight and actionable:

- **Weekly team review:** Flow, review wait time, blocked work, build health, and immediate delivery risks.
- **Monthly engineering review:** DORA trends, incident themes, quality investments, operational readiness, and platform constraints.
- **Quarterly leadership review:** Product impact, reliability posture, modernization progress, hiring or capability gaps, and strategic technical debt.

Each review should end with a small number of actions, clear owners, and a follow-up date.

## Anti-patterns to avoid

- Measuring individual commit counts, lines of code, or ticket throughput as a proxy for engineering value.
- Treating estimates as performance commitments instead of planning tools.
- Chasing deployment frequency while ignoring change failure rate and recovery capability.
- Creating dashboards that nobody owns or reviews.
- Using metrics to justify decisions already made instead of learning what the system is telling you.
- Ignoring qualitative signals from engineers, support teams, incident reviews, and customers.

## Metrics checklist

- [ ] Metrics are tied to customer outcomes, reliability, delivery flow, or quality improvement.
- [ ] Each metric has an owner, review cadence, and expected action path.
- [ ] Dashboards show trends and context rather than isolated snapshots.
- [ ] Metrics are reviewed alongside incidents, roadmap pressure, staffing, and architectural constraints.
- [ ] AI-assisted engineering is measured by validated quality and delivery impact, not generated volume.
- [ ] No metric is used to rank or punish individual engineers.

## Related sections

- [Developer Productivity](developer-productivity.md) for improving team flow and feedback loops.
- [Production Readiness Checklist](production-readiness-checklist.md) for validating operational maturity before release.
- [Code Review Guide](code-review-guide.md) for using review as a quality and leadership practice.
- [AI-Assisted Engineering](ai-assisted-engineering.md) for responsible use of AI in delivery workflows.
