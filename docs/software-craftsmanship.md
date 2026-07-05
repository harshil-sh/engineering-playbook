# Software Craftsmanship

Software craftsmanship is the habit of building systems that are understandable, testable, secure, and operable long after the first release. It combines engineering discipline with practical judgement: write code that solves the current problem clearly while leaving the next engineer with fewer surprises.

For Senior .NET/Azure engineering work, craftsmanship is not aesthetic perfection. It is the consistent practice of reducing delivery risk through clear design, maintainable code, automated validation, and production-minded ownership.

## Craftsmanship principles

| Principle | What it means in practice |
| --- | --- |
| Clarity over cleverness | Prefer simple code, explicit names, and visible control flow over abstractions that hide intent. |
| Design for change | Keep boundaries small, dependencies deliberate, and business rules easy to test without infrastructure. |
| Quality is continuous | Build quality into daily development through tests, reviews, refactoring, and observability rather than late-stage cleanup. |
| Production is the standard | Treat logs, metrics, security, configuration, and failure handling as part of the feature, not optional extras. |
| AI accelerates, engineers own | Use AI tools to explore options and generate drafts, while engineers remain accountable for correctness and maintainability. |

## Code quality expectations

High-quality code should be easy to read, safe to change, and straightforward to operate.

Use these expectations during implementation and review:

- Names describe domain intent rather than technical mechanics.
- Methods and classes have focused responsibilities and clear boundaries.
- Business rules are separated from framework, database, messaging, and cloud infrastructure concerns where practical.
- Error handling is explicit, user-safe, and observable without leaking sensitive information.
- Configuration is externalized, validated, and documented for each environment.
- Dependencies are injected deliberately and kept close to the capabilities they support.
- Refactoring is done in small, reviewable steps with tests protecting existing behaviour.

## Testing as a design tool

Tests are not only a safety net; they are feedback on design quality. Code that is difficult to test is often carrying too many responsibilities or hiding important dependencies.

A practical testing approach includes:

- **Unit tests** for business rules, edge cases, and branching logic.
- **Integration tests** for databases, queues, identity providers, APIs, and Azure service boundaries.
- **Contract tests** where independent services or teams depend on stable request, response, or message shapes.
- **Regression tests** for defects that reached production or exposed important design gaps.
- **Smoke tests** that prove deployed environments can start, connect to dependencies, and serve critical paths.

See the [Testing Strategy](testing-strategy.md) for broader guidance on automated validation.

## Refactoring discipline

Refactoring should make future change safer without creating unnecessary churn.

Good refactoring practice:

1. Identify the behaviour that must remain stable.
2. Add or confirm tests around the affected behaviour.
3. Make one structural improvement at a time.
4. Keep commits and pull requests focused enough for meaningful review.
5. Validate the change through CI and, where relevant, production telemetry after release.

Avoid large rewrites unless the current design creates a measurable delivery, reliability, security, or cost problem that smaller improvements cannot address.

## Craftsmanship in AI-assisted development

AI-assisted engineering can improve speed, coverage, and learning when used with strong engineering judgement.

Use AI tools to:

- Generate test cases for edge conditions and failure modes.
- Draft refactoring options before choosing the smallest safe change.
- Review code for naming, complexity, security risks, and missing validation.
- Explain unfamiliar APIs, Azure services, or legacy code paths before making changes.
- Produce first-draft documentation that engineers refine with system-specific context.

Do not use AI output as a substitute for review, testing, threat modelling, or understanding the production impact of a change.

## Pull request craftsmanship checklist

Before requesting review, confirm:

- [ ] The change has a clear purpose and avoids unrelated cleanup.
- [ ] Code paths are covered by appropriate automated tests or a documented reason tests are not practical.
- [ ] Public APIs, message contracts, configuration, and data migrations are backward compatible or have a safe rollout plan.
- [ ] Logs, metrics, and error handling support production diagnosis.
- [ ] Security, privacy, and access-control implications have been considered.
- [ ] Documentation, runbooks, or ADRs are updated when the change affects team behaviour or system operation.

## Related sections

- [SOLID Principles](solid-principles.md) for object-oriented design habits.
- [Code Review Guidelines](code-review-guidelines.md) for collaborative quality gates.
- [Production Readiness Checklist](production-readiness-checklist.md) for release and operational readiness.
- [Architecture Decision Framework](architecture-decision-framework.md) for making design trade-offs explicit.
