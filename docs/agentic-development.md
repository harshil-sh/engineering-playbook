# Agentic Development

Agentic development is the disciplined use of AI agents to plan, edit, validate, and explain software changes under human engineering control. It extends AI-assisted engineering from single prompts into multi-step workflows where an agent can inspect a repository, propose a plan, modify files, run checks, and summarize the result.

For Senior .NET/Azure engineers, agentic development should improve delivery throughput while preserving architecture ownership, production safety, and codebase maintainability. The engineer remains accountable for the final design, implementation, review quality, and operational impact.

## When to use an agentic workflow

Agentic workflows are most effective when the task has clear boundaries, a verifiable outcome, and enough repository context for the agent to reason from existing patterns.

Good candidates include:

- Adding small API endpoints, validation rules, mapping code, or background worker behavior that follows established .NET patterns.
- Creating or updating tests for known business rules, regressions, and edge cases.
- Refactoring localized code to improve naming, dependency boundaries, cancellation token usage, or error handling.
- Updating documentation, runbooks, ADR drafts, or production readiness checklists from existing source material.
- Investigating a defect by gathering evidence from code paths, tests, logs, and configuration before a human decides the fix.

Avoid using agents for broad rewrites, unclear product requirements, security-sensitive decisions, or changes where the team cannot objectively validate correctness.

## Operating model

A reliable agentic workflow should be explicit, reviewable, and easy to stop.

1. **Define the objective.** State the desired outcome, scope, files or modules in play, and what must not change.
2. **Provide context.** Include architecture constraints, coding standards, production expectations, and relevant links to issues or ADRs.
3. **Ask for a plan first.** Review the proposed approach before implementation when the change affects design, data, security, or operations.
4. **Keep changes small.** Prefer focused pull requests that a reviewer can understand without trusting the agent.
5. **Run validation.** Require build, test, lint, documentation, or deployment checks appropriate to the change.
6. **Review the diff.** Treat generated code as untrusted until a human has inspected behavior, maintainability, and failure modes.
7. **Capture learning.** Update prompts, checklists, or documentation when the workflow reveals a repeatable pattern.

## Guardrails for production systems

Agentic development must strengthen, not weaken, production engineering discipline.

| Guardrail | Why it matters |
| --- | --- |
| Least-privilege access | Agents should only access the repositories, tools, and environments required for the task. |
| No sensitive data exposure | Do not provide secrets, customer data, credentials, private keys, or raw production payloads to an AI tool. |
| Human approval for risky actions | Database migrations, infrastructure changes, releases, rollbacks, and permission changes require explicit engineer approval. |
| Evidence-based debugging | Incident or defect analysis should use logs, metrics, traces, and deployment history rather than speculation. |
| Reproducible validation | The final summary should list the exact commands, tests, and checks that were run. |
| Clear ownership | The submitting engineer owns the change after merge, including monitoring, rollback readiness, and follow-up fixes. |

## Prompt pattern

Use prompts that define the role, scope, constraints, validation, and expected output.

```text
You are working in a .NET 8 Azure service. Make a focused change only in the
OrderProcessing module to add idempotency for Service Bus message handling.
Follow existing repository patterns, preserve public contracts, add tests for
retry and duplicate-message scenarios, run the available test command, and
summarize changed files plus validation results. Do not modify infrastructure
or authentication code.
```

Strong prompts make it easier to review whether the agent followed instructions and whether the resulting pull request is safe to merge.

## Review checklist

Before merging an agent-authored or agent-assisted change, confirm:

- The pull request solves the stated problem without unrelated rewrites.
- The design follows existing architecture boundaries and dependency direction.
- Tests cover success paths, failure paths, and important edge cases.
- Security-sensitive behavior was reviewed by a human engineer.
- Logs, metrics, retries, timeouts, and cancellation behavior are appropriate for production.
- The validation commands are documented and reproducible.
- The engineer can explain every meaningful line in the diff.

## Leadership expectations

Technical leaders should make agentic development a team capability rather than an individual shortcut. This includes defining approved tools, documenting safe workflows, coaching engineers on prompt quality, and measuring whether AI-assisted delivery improves lead time without increasing defects, review burden, or operational risk.

The goal is not autonomous code delivery. The goal is a faster engineering loop where agents handle bounded execution while experienced engineers provide judgement, context, and accountability.

## Related sections

- [AI-Assisted Engineering](ai-assisted-engineering.md) for foundational principles and review standards.
- [Software Craftsmanship](software-craftsmanship.md) for maintainability expectations.
- [Production Readiness Checklist](production-readiness-checklist.md) for release validation.
- [Architecture Decision Framework](architecture-decision-framework.md) for documenting significant trade-offs.
