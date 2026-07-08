# AI-Assisted Engineering

AI-assisted engineering is the disciplined use of AI tools to improve delivery speed, technical discovery, and engineering quality without weakening accountability. Used well, AI reduces the cost of routine work and expands the number of options an engineer can evaluate. Used poorly, it creates unreviewed complexity, hidden security risk, and code that nobody truly understands.

For Senior .NET/Azure engineering teams, the goal is not to replace engineering judgement. The goal is to combine AI acceleration with strong architecture, testing, review, observability, and production ownership.

## Operating principles

| Principle | What it means in practice |
| --- | --- |
| Engineers remain accountable | AI output is treated as a draft. The engineer who submits the change owns correctness, maintainability, and production impact. |
| Context beats generic output | Prompts should include business rules, architecture constraints, coding standards, and operational expectations. |
| Verification is mandatory | Generated code must be reviewed, tested, and validated through the same quality gates as manually written code. |
| Small changes are safer | Use AI to support focused changes rather than large rewrites that are difficult to understand or review. |
| Security is deliberate | Authentication, authorization, secrets, privacy, and compliance decisions require explicit human review. |

## High-value use cases

AI assistance works best when the work is bounded, easy to verify, and based on patterns the engineer already understands.

Use AI to accelerate:

- Drafting unit test cases for edge conditions, validation rules, and failure paths.
- Scaffolding repetitive .NET APIs, background workers, dependency injection setup, and documentation templates.
- Explaining unfamiliar code before refactoring, especially in legacy modules with limited documentation.
- Generating first-pass options for architecture trade-offs, ADRs, rollout plans, and production readiness checks.
- Reviewing pull requests for naming clarity, missed null handling, missing cancellation tokens, and logging gaps.
- Producing concise documentation that engineers refine with accurate system context.

The best tasks have a clear definition of done, a narrow scope, and objective validation through tests, build output, or review criteria.

## Where to be careful

AI output becomes risky when the model lacks the context needed to reason about real-world consequences.

Avoid relying on AI as the primary decision-maker for:

- Authentication and authorization design.
- Cryptography, key management, and secret handling.
- Data privacy, retention, and regulatory compliance decisions.
- Production incident diagnosis without direct evidence from logs, metrics, traces, and deployment history.
- Large-scale architecture changes without ADRs, stakeholder review, and operational impact analysis.
- Performance-sensitive code where real profiling data is required.

AI can help prepare questions and options in these areas, but engineers must make and document the final decision.

## Review workflow for AI-generated changes

Treat AI-generated code as untrusted input until it is proven safe.

1. **Read the full diff.** Confirm every line is necessary, understandable, and consistent with the surrounding code.
2. **Check current APIs.** Verify Azure SDK, ASP.NET Core, NuGet, and framework usage against current documentation or existing repository patterns.
3. **Validate behaviour.** Add or update tests that prove observable outcomes rather than implementation details.
4. **Inspect failure modes.** Look for swallowed exceptions, missing cancellation tokens, weak validation, retry storms, duplicate processing, and unsafe defaults.
5. **Confirm operability.** Ensure logs, metrics, configuration, feature flags, and rollback paths match production expectations.
6. **Document material decisions.** Capture architecture or operational trade-offs in an ADR or linked design note when the change affects future teams.

## Prompting standards

Good prompts make constraints explicit. A useful engineering prompt should include:

- The role of the component or service.
- Relevant technologies, such as .NET, C#, Azure Functions, Service Bus, SQL Server, or Application Insights.
- Existing patterns that should be followed.
- Non-functional requirements for security, reliability, observability, and performance.
- The expected output format, such as test cases, a refactoring plan, a checklist, or a small code change.
- Boundaries for what must not be changed.

Example prompt structure:

```text
You are helping review a .NET 8 API change. Focus on correctness, security,
observability, cancellation token usage, and production failure modes. Do not
suggest broad rewrites. Return only concrete review comments with the risk and
recommended fix.
```

## Team guardrails

AI-assisted development should be visible and governable without becoming bureaucratic.

Recommended guardrails:

- Keep pull requests small enough for reviewers to understand the generated and human-written parts together.
- Require tests or explicit validation notes for AI-assisted implementation changes.
- Do not paste secrets, customer data, private credentials, or sensitive production logs into AI tools.
- Prefer repository-aware tools only when access controls, auditability, and data handling are approved.
- Use code review to challenge generated abstractions that increase complexity without measurable benefit.
- Record repeatable prompts, review checklists, and lessons learned in team documentation.

## Senior engineer expectations

A senior engineer using AI effectively should be able to explain:

- Why AI was useful for the task.
- What constraints were provided to the tool.
- Which parts of the output were accepted, changed, or rejected.
- How correctness, security, and production readiness were verified.
- What residual risks remain and how they are monitored or mitigated.

AI-assisted engineering is successful when the team ships faster while preserving trust in the codebase, the delivery process, and the production system.

## Related sections

- [Software Craftsmanship](software-craftsmanship.md) for maintainability and review expectations.
- [Production Readiness Checklist](production-readiness-checklist.md) for release and operational validation.
- [Architecture Decision Framework](architecture-decision-framework.md) for evaluating technical trade-offs.
- [Code Review Guidelines](code-review-guidelines.md) for collaborative quality gates.
- [Agentic Development](agentic-development.md) for using coding agents within controlled delivery workflows.
- [Developer Productivity](developer-productivity.md) for measuring AI assistance against real delivery outcomes.
