# Mentoring

Mentoring is a leadership practice that turns individual engineering experience into team capability. In a senior engineering role, the goal is not to create dependency on one expert, but to help engineers build judgement, confidence, and repeatable delivery habits.

Effective mentoring connects technical depth with product context, operational discipline, and professional growth. It should help engineers make better decisions in code, architecture, production support, and stakeholder communication.

## Mentoring principles

- **Coach for judgement, not just answers:** Explain the trade-offs behind a recommendation so the engineer can apply the reasoning later.
- **Make standards visible:** Use checklists, examples, ADRs, and review notes to clarify what good engineering looks like.
- **Create safe stretch opportunities:** Assign work that is slightly beyond current comfort while keeping support, feedback, and escalation paths clear.
- **Tie growth to outcomes:** Connect learning goals to reliability, maintainability, delivery flow, customer impact, and team ownership.
- **Respect different learning styles:** Combine pairing, written feedback, diagrams, code examples, and independent discovery.

## Mentoring model

| Practice | Purpose | Example |
| --- | --- | --- |
| Pair design sessions | Build architectural thinking before implementation starts. | Walk through API boundaries, Azure service choices, failure modes, and rollback paths. |
| Code review coaching | Improve craftsmanship through real delivery work. | Highlight testability, readability, domain modelling, observability, and security concerns. |
| Production readiness reviews | Teach operational ownership. | Review alerts, dashboards, runbooks, retry behaviour, and incident response before release. |
| Career goal check-ins | Align technical growth with long-term direction. | Identify goals such as leading a feature, owning a service, improving cloud skills, or mentoring others. |
| Reflection after delivery | Convert experience into learning. | Discuss what went well, what was risky, and what should become a reusable team practice. |

## Mentoring conversations

Strong mentoring conversations are specific, actionable, and grounded in evidence.

### Questions to ask

- What problem are we solving, and what outcome matters most?
- What trade-offs did you consider before choosing this approach?
- How would this design behave under failure, load, retries, or partial outages?
- What would make this easier for the next engineer to understand or operate?
- Which part of the work stretched your skills the most?
- What feedback would help you move faster next time?

### Feedback pattern

Use a simple structure for feedback:

1. **Observation:** Describe the behaviour, decision, or artifact without judgement.
2. **Impact:** Explain how it affects maintainability, reliability, delivery, or collaboration.
3. **Recommendation:** Offer a concrete next step.
4. **Ownership:** Agree who will act and how progress will be reviewed.

## Growing engineers through delivery

Mentoring is most effective when growth is built into normal engineering work:

- Let engineers lead scoped design discussions while a senior engineer supports risk identification.
- Ask mentees to draft ADRs for meaningful technical decisions.
- Encourage ownership of tests, observability, deployment notes, and support documentation.
- Use AI-assisted engineering for exploration, test generation, and review preparation while maintaining human accountability.
- Rotate facilitation of retrospectives, incident reviews, and technical demos.
- Celebrate improvements in clarity, reliability, and collaboration, not only feature throughput.

## Mentoring outcomes

Healthy mentoring should produce visible team-level improvements:

- Engineers explain trade-offs clearly and make decisions with less escalation.
- Pull requests become smaller, better tested, and easier to review.
- Production changes include stronger observability, rollback thinking, and operational ownership.
- Architecture discussions become more evidence-based and less personality-driven.
- Junior and mid-level engineers start mentoring others, creating a multiplier effect.

## Related sections

- [Code Review Guide](code-review-guide.md) for turning reviews into coaching moments.
- [Architecture Decision Records](architecture-decision-records.md) for teaching decision discipline.
- [Production Readiness Checklist](production-readiness-checklist.md) for mentoring operational ownership.
- [AI-Assisted Engineering](ai-assisted-engineering.md) for responsible use of AI in learning and delivery.
