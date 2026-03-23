# Engineering Principles

After 14 years building enterprise software across .NET Core, Python, React, and Azure, I have become less interested in fashionable engineering opinions and more interested in what still works at 2 a.m. during an incident, in a regulated audit trail, or in a programme that has to survive three rounds of team turnover. These are not abstract ideals. They are the standards I use when I design systems, review code, mentor engineers, and decide whether a trade-off is acceptable.

## My Core Engineering Beliefs

### 1. Write for the next engineer
I write code as if the next person to read it is intelligent, busy, and missing half the context I currently have. In enterprise systems, that next engineer is often me six months later, someone on another team, or an on-call engineer trying to diagnose a production issue under time pressure. I want them to understand the intent of the code without reverse-engineering my thought process. That means explicit names, predictable structure, small units of behaviour, and documentation for decisions that are not obvious from the code itself. On a healthcare integration platform, I once replaced a deeply nested eligibility-processing workflow with a pipeline of clearly named steps and decision objects. The business logic did not become simpler, but it became traceable. During a compliance review, we could explain exactly why a record was accepted, rejected, or routed for manual review without guessing what a dense block of conditional logic was trying to do.

### 2. Make the wrong thing hard to do
I do not trust process documents alone to keep systems safe. If something matters, I want the code, tooling, and platform to enforce it by default. In enterprise environments, the expensive failures are usually not caused by malice or incompetence; they come from reasonable people making easy mistakes in complex systems. So I design guardrails: strongly typed configuration, safe defaults, permission boundaries, validation at system edges, CI checks, and APIs that make invalid states awkward. In a financial services project, we handled outbound payment instructions where idempotency and auditability were non-negotiable. Rather than relying on developers to remember a checklist, we built idempotency keys into the API contract, rejected duplicate requests server-side, and made persistence of request metadata part of the standard handler template. The result was that replaying a request safely became the default path, and accidentally triggering duplicate payments became much harder.

### 3. Boring technology is often the right choice
I like good tools, but I do not confuse novelty with engineering value. In most enterprise programmes, the real work is not inventing a new stack; it is delivering reliable outcomes in an environment full of constraints: security reviews, procurement, patching, operational ownership, support models, and staff turnover. Boring technology tends to have better documentation, more predictable failure modes, stronger hiring markets, and fewer surprises during upgrades. I have seen teams burn months introducing eventing platforms, front-end state libraries, or niche ORMs that solved theoretical problems while creating practical ones. On an Azure-based internal operations platform, we deliberately chose ASP.NET Core APIs, Azure Functions only where asynchronous execution was genuinely needed, standard React patterns, and SQL Server with straightforward EF Core mappings. That decision looked conservative on paper, but it shortened onboarding time, reduced support risk, and kept our architecture explainable to security, operations, and auditors.

### 4. Precision over cleverness
I do not admire code for being compact; I admire it for being unambiguous. Clever code tends to concentrate meaning into fewer lines while spreading confusion into more heads. In regulated or high-consequence systems, ambiguity is a defect. Precision means choosing names that reflect business language, modelling domain rules explicitly, being exact about nullability, time zones, money, and error conditions, and avoiding abstractions that obscure what the system actually does. In an insurance pricing service, I pushed back on a generic rules engine abstraction that promised reuse but hid the calculation path behind configuration and dynamic dispatch. We replaced it with explicit domain services and clearly named pricing components because actuaries, testers, and engineers needed to trace how a premium was produced. The codebase became slightly more repetitive and dramatically easier to reason about, which is a trade I will make every time.

### 5. Test behaviour not implementation
I want tests to give me confidence to change a system, not handcuff me to a particular internal structure. Tests that mirror private method calls, mock every dependency into submission, or assert incidental details create false safety. They break when code is refactored responsibly and often miss the behaviour users actually care about. I prefer tests that focus on business outcomes, contracts, and observable side effects: what response is returned, what state changes, what message is published, what audit record is created. In a manufacturing compliance system, we had a batch release workflow with multiple checks around approval state, document completeness, and operator certification. The useful tests were the ones that described scenarios such as “a batch cannot be released if the operator certification has expired” and verified both the API response and audit entry. That let us refactor the internal orchestration freely while preserving the behaviour the plant actually depended on.

### 6. Own the outcome not just the code
I do not believe my responsibility ends when the pull request is merged. Shipping code that technically works but fails operationally, confuses users, or creates manual work for another team is not a success. Owning the outcome means understanding the business process, thinking about operability, instrumenting what matters, participating in release planning, and following issues through to resolution. On a claims-processing platform, one service I worked on met its functional acceptance criteria but still generated a high volume of support tickets because failure messages were too generic for operations staff to act on. We reworked the error taxonomy, added correlation IDs, surfaced actionable diagnostics in dashboards, and improved runbooks. None of that changed the core business logic, but it materially improved the real outcome: fewer delayed claims, fewer escalations, and less friction between engineering and operations.

## Clean Code Standards

### Naming conventions in C# and Python
I use naming to reduce cognitive load, not to display style preferences.

In C#, I expect types, public members, and enums to use clear PascalCase names that reflect domain intent. Private fields should be simple and predictable, and asynchronous methods should end with `Async` because hiding async behaviour is a good way to confuse callers.

**Good C# examples**

```csharp
public class InvoiceApprovalService
{
    private readonly IApprovalPolicy _approvalPolicy;

    public Task<ApprovalDecision> EvaluateAsync(Invoice invoice, CancellationToken cancellationToken)
}
```

```csharp
public record PaymentRetryRequest(Guid PaymentId, DateTimeOffset RequestedAtUtc);
```

**Bad C# examples**

```csharp
public class DoStuff
{
    public Task<ApprovalDecision> Run(Invoice i, CancellationToken ct)
}
```

```csharp
public record data(Guid id, DateTime time);
```

In Python, I favour descriptive `snake_case` names, explicit module boundaries, and nouns for values that represent domain concepts. I avoid vague names like `data`, `info`, `helper`, and `util` unless the thing genuinely is generic. In data-heavy Python services, I am especially careful with names that distinguish raw input, validated data, transformed payloads, and persisted records.

**Good Python examples**

```python
def calculate_policy_excess(claim_amount: Decimal, policy_terms: PolicyTerms) -> Decimal:
    ...
```

```python
validated_customer_reference = normalise_customer_reference(raw_customer_reference)
```

**Bad Python examples**

```python
def calc(x, y):
    ...
```

```python
data2 = fix(data1)
```

If I cannot name something clearly, I take that as a design warning. Usually the problem is not vocabulary; it is that the code is doing too much or the model is still muddy.

### Function size and single responsibility
I do not enforce a magical line count, but I do expect a function to do one coherent thing at one level of abstraction. A function can coordinate several steps, or it can perform one detailed operation, but it should not jump back and forth between validation, persistence, formatting, logging, conditional business rules, and third-party integration logic all in one place. In practice, once a function becomes hard to summarize in a single sentence, it usually needs to be split.

For application services, I often accept a slightly larger orchestration method if each step is explicit and named well. What I will not accept is a 150-line function where domain rules are hidden between incidental mechanics. My rule of thumb is simple: if I need to scroll repeatedly to understand a function, or if a reviewer cannot tell which statements are the core decision path, it is too big.

### Class cohesion guidelines
I want classes to have a clear centre of gravity. A class should own behaviour and data that naturally belong together, not accumulate unrelated responsibilities because it was convenient. In enterprise codebases, low-cohesion classes often appear as “manager”, “processor”, or “service” types that validate inputs, query the database, call external APIs, transform models, and write audit logs all at once. Those classes become change magnets and incident hotspots.

A cohesive class usually has one reason to change from one part of the system. For example, an `InvoiceApprovalService` may coordinate approval rules, but it should not also know how CSV exports are generated. A repository should retrieve and persist aggregates, not decide whether a business rule passed. A React component should focus on rendering and user interaction, not embed complex data-fetching workflows that belong in hooks or service layers.

### Comment philosophy — when to comment and when not to
I comment to explain intent, constraints, and non-obvious decisions. I do not comment to narrate code that should have been made clearer instead.

Good comments answer questions like:
- Why is this rule legally or operationally required?
- Why was this implementation chosen over an apparently simpler alternative?
- What external system behaviour or production quirk are we compensating for?
- What must remain true if this code is changed later?

Bad comments merely translate syntax into English.

**Useful comment**

```csharp
// The upstream regulator feed can resend the same correction for up to 72 hours.
// We retain the deduplication key for 96 hours to avoid duplicate case creation.
```

**Useless comment**

```csharp
// Increment count by one.
count++;
```

When I see many explanatory comments in a method, I usually assume the code structure needs work. Comments should support clarity, not compensate for its absence.

### Magic numbers and constants
I avoid unexplained literals when they carry business meaning, operational thresholds, or domain rules. A raw `3`, `30`, or `5000` in enterprise software is rarely self-explanatory. If the number matters, it should have a name, and ideally that name should reflect the policy or operational rule behind it.

I am comfortable with obvious values that are effectively language syntax, such as `0`, `1`, or simple collection indexing where no business meaning is implied. But a retry limit, paging default, timeout threshold, retention window, or status transition code should be expressed through a constant, configuration setting, or domain type.

```csharp
private const int MaxPaymentRetryAttempts = 3;
private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);
```

That naming matters because it gives reviewers and future maintainers a place to ask, “Why is this value correct?”

## API Design Standards

### REST resource naming conventions
I prefer resource-oriented APIs with plural nouns, stable paths, and domain language that business stakeholders would recognise. I use paths like `/customers/{customerId}/policies` and `/invoices/{invoiceId}/approvals`, not verbs like `/getCustomerPolicies` or `/approveInvoiceNow`. Actions that do not map cleanly to CRUD still deserve clear modelling; if an action represents a meaningful domain event, I expose it as a sub-resource or command-style endpoint with explicit intent, such as `POST /payments/{paymentId}/retries`.

I keep naming consistent across the API surface. If the domain says “policy”, I do not switch to “contract” in one controller because it sounds technical. If identifiers are UUIDs externally, I do not expose internal integer keys in some endpoints. Consistency does more for usability than most API documentation.

### HTTP status code usage
I use status codes to communicate meaning precisely, not loosely.

- `200 OK` for successful reads and updates where a response body is returned.
- `201 Created` when a new resource is created, ideally with a `Location` header.
- `202 Accepted` when work is genuinely asynchronous and completion will happen later.
- `204 No Content` for successful operations that intentionally return no body.
- `400 Bad Request` when the request is malformed or structurally invalid.
- `401 Unauthorized` when authentication is missing or invalid.
- `403 Forbidden` when the caller is authenticated but not permitted.
- `404 Not Found` when the resource does not exist or must not be disclosed.
- `409 Conflict` when the request is valid but clashes with current state, such as a concurrency or duplicate-processing condition.
- `422 Unprocessable Entity` when the payload is well-formed but violates business rules.
- `429 Too Many Requests` when throttling is enforced.
- `500`-class responses only for failures the client cannot reasonably fix.

I am deliberate about the difference between validation failures and business-rule failures because clients and support teams rely on that distinction.

### Versioning strategy
My default strategy is explicit versioning in the URL for externally consumed APIs, such as `/api/v1/customers`, combined with strong backward-compatibility discipline within a major version. For internal APIs with a tightly coordinated set of consumers, header-based versioning can work, but only if the operational overhead is worth it. In practice, URL versioning is easier to reason about in logs, dashboards, gateway rules, and support tickets.

I do not create a new version for every additive field. I version when I need to make a breaking change to resource shape, semantics, or behaviour. Even then, I prefer a measured deprecation window with clear communication, telemetry on old version usage, and migration guides before I remove anything.

### Error response structure with C# example
I want error responses to be predictable, machine-readable, and useful to humans under pressure. Every API error should include a stable error code, a human-readable message, a correlation identifier, and enough structured detail for clients to act appropriately without parsing prose.

A typical shape I use looks like this:

```json
{
  "errorCode": "invoice_already_approved",
  "message": "The invoice has already been approved and cannot be re-approved.",
  "correlationId": "2c6c2385-6c8f-4b3b-9f7a-d9d46c7de6f6",
  "details": {
    "invoiceId": "INV-10452",
    "currentStatus": "Approved"
  }
}
```

In ASP.NET Core, I typically model that explicitly rather than returning ad hoc anonymous objects:

```csharp
public record ApiError(
    string ErrorCode,
    string Message,
    string CorrelationId,
    IReadOnlyDictionary<string, object?>? Details = null);

return Conflict(new ApiError(
    ErrorCode: "invoice_already_approved",
    Message: "The invoice has already been approved and cannot be re-approved.",
    CorrelationId: httpContext.TraceIdentifier,
    Details: new Dictionary<string, object?>
    {
        ["invoiceId"] = request.InvoiceId,
        ["currentStatus"] = invoice.Status.ToString()
    }));
```

This approach makes logging, support diagnostics, and client handling much cleaner than improvising response formats endpoint by endpoint.

### Idempotency requirements
If an operation can create financial, legal, or workflow side effects, I assume clients will retry and design accordingly. POST endpoints that trigger non-trivial side effects should support idempotency keys when duplicate submission is a real risk, especially for payments, case creation, outbound messaging, and partner-facing integrations. The server should persist enough request metadata to recognise equivalent retried requests and either return the original result or a safe representation of the current state.

I do not treat idempotency as a nice-to-have in regulated workflows. Networks retry, users double-click, jobs replay, queues redeliver, and upstream systems misbehave. If duplication would be expensive, I want protection in the contract and persistence layer, not as a vague consumer responsibility.

### Pagination standards
For collection endpoints, I default to server-enforced pagination. I prefer cursor-based pagination for large or frequently changing datasets because it avoids the consistency problems of offset pagination under concurrent writes. For simpler internal use cases with stable ordering and modest data volume, offset pagination is acceptable if the ordering is deterministic and documented.

I always define:
- a default page size,
- a maximum page size,
- a stable sort order,
- and response metadata that makes navigation explicit.

A paged response should tell the client what it received and how to request the next page. I do not leave consumers to infer paging behaviour from examples.

## Database Standards

### Migration strategy and tooling
I treat schema changes as first-class code changes. Every structural database change should be represented in version-controlled migrations, reviewed like application code, and tested in realistic deployment flows. In .NET services, I commonly use EF Core migrations where the model-to-schema mapping is straightforward, and I fall back to explicit SQL migration scripts when I need precise control over data movement, indexing strategy, or zero-downtime rollout behaviour.

My rule is that migrations must be repeatable, auditable, and safe to deploy in environments where data volume and uptime matter. That means avoiding hand-applied “just run this in production” scripts, separating destructive changes into staged rollouts where necessary, and being explicit about backfills. In regulated systems, I also want a clear record of when a schema changed, why it changed, and which release introduced it.

### Index guidelines
I add indexes to support specific access patterns, not because a table feels important. Every index carries a write and maintenance cost, so I want a reason tied to actual query behaviour. I pay particular attention to:
- columns used in joins,
- foreign keys on frequently queried relationships,
- predicates used in high-volume filters,
- and compound indexes that match real query shapes and sort orders.

I do not assume the ORM generated acceptable performance. I look at execution plans, query patterns, and cardinality. In one case on a case-management system, a dashboard query was timing out because we had separate indexes on `Status` and `CreatedUtc` but the real workload filtered on status and date range together. A composite index aligned to the actual predicate shape fixed more than pages of application-side “optimisation” ever would have.

### Naming conventions for tables and columns
I prefer names that are explicit, stable, and easy to query without translation. My default is singular or plural naming used consistently across the schema, but I care more about consistency than ideology. In practice, if a schema already uses plural table names like `Customers` and `Invoices`, I stay with that. If it uses singular aggregate-style names, I stay with that too.

For columns, I favour full words over abbreviations, primary keys named predictably, and foreign keys that clearly reference the parent entity, such as `CustomerId` and `InvoiceId`. Audit columns should be standardized across tables where possible, for example `CreatedUtc`, `CreatedBy`, `UpdatedUtc`, and `UpdatedBy`. I avoid names that require tribal knowledge, because database investigations are often done by people outside the original team.

### Transaction boundary rules
Transactions should be as small as they can be while still protecting a single business unit of work. I do not hold database transactions open across network calls, message publication to external brokers without an outbox pattern, or user-driven workflows. Long-lived transactions create lock contention, unpredictable latency, and operational pain.

My general rule is:
- enforce consistency for changes that must succeed or fail together within one service boundary,
- keep the transaction inside the persistence layer of that unit of work,
- and use patterns such as outbox/inbox, retries, and compensating actions across distributed boundaries.

If a workflow spans multiple systems, I design for eventual consistency deliberately rather than pretending a distributed transaction will save me.

### When to use stored procedures vs ORM
I am pragmatic here. ORMs are useful for most routine CRUD, aggregate persistence, and developer productivity, especially when the domain model is clear and query requirements are not exotic. EF Core and similar tools are perfectly acceptable when used with discipline.

I use stored procedures selectively when one of the following is true:
- the query is performance-critical and benefits from carefully tuned SQL,
- the operation is inherently set-based and awkward through the ORM,
- the database is the right place for controlled bulk processing,
- or there is an administrative or security requirement to encapsulate data access tightly.

What I avoid is the worst of both worlds: a fragile ORM layer on top of a database full of hidden business logic in procedures that only one person understands. If logic belongs in the domain, I keep it in the application. If the database is genuinely the best execution engine for the job, I say so explicitly and document it.

## On Technical Debt

### How I identify technical debt
I do not define technical debt as “code I dislike”. I define it as a condition in the system that increases the cost, risk, or lead time of future change. That can include poor modularity, missing tests around critical behaviour, obsolete dependencies, duplicated business rules, fragile deployment pipelines, misleading names, or architecture that no longer matches the problem.

I look for recurring signals: the same area breaking repeatedly, changes taking longer than they should, engineers being afraid to touch a module, defects caused by inconsistent rules, or operational workarounds becoming permanent. If the team keeps paying interest in delay, incidents, or complexity, that is debt whether or not it looks dramatic in a code review.

### How I communicate it to non-technical stakeholders
I do not explain technical debt to non-technical stakeholders as a craftsmanship issue. I explain it in terms they already manage: risk, delivery speed, cost of change, compliance exposure, and operational overhead. Saying “the architecture is messy” is rarely useful. Saying “every policy-rule change takes twice as long because the logic is duplicated in three services, which increases release risk and audit effort” usually is.

I try to make debt visible through outcomes. If an outdated integration approach adds two days to every partner onboarding, or brittle manual release steps create avoidable production risk, I frame the remediation in those terms. Stakeholders do not need to love refactoring; they need to understand the business case for reducing drag and risk.

### How I prioritise paying it down
I prioritise debt the same way I prioritise feature work: by impact, urgency, and timing. The most important debt is usually one of three things:
- debt that threatens reliability or compliance,
- debt on the critical path of upcoming roadmap work,
- or debt with a compounding operational cost.

I do not believe in vague promises to “clean it up later”. If I know a part of the system will block the next quarter of delivery, I want debt work planned explicitly into that roadmap. I also prefer small, continuous debt reduction over dramatic clean-up programmes that never survive contact with delivery pressure.

### The Boy Scout Rule applied to a codebase
I take the Boy Scout Rule seriously: leave the code a little better than I found it. In a mature enterprise codebase, that does not mean opportunistically rewriting everything that looks old. It means making focused improvements while I am already in the area: clarifying names, extracting duplicated logic, adding missing tests around a risky path, tightening validation, improving logs, or documenting a hidden assumption.

That discipline matters because large systems rarely improve through one heroic rewrite. They improve through repeated acts of local responsibility. Over time, those small improvements change the character of a codebase from fragile and mysterious to manageable and trustworthy.

## On Mentoring Junior Engineers

### My approach to code review feedback
I use code reviews to teach judgment, not to perform status. I want my feedback to be direct, respectful, and specific about the why behind the comment. “Rename this” is weaker than “rename this to reflect the business rule, because right now the method sounds like a persistence concern rather than an approval decision.” I try to separate must-fix issues from stylistic preferences so junior engineers learn what really matters.

I also avoid turning reviews into trivia contests. If I leave ten comments on formatting and none on coupling, test quality, or domain clarity, I am teaching the wrong lesson. My goal is to help a junior engineer build better instincts: how to structure code, how to think about edge cases, how to make changes safely, and how to communicate intent.

### How I explain complex concepts
I explain complex concepts by anchoring them in a concrete problem first. Junior engineers usually do not struggle because they are incapable of understanding abstraction; they struggle because abstraction arrives before context. So I start with the failure mode, user need, or business rule, then show how the technical concept helps. Eventual consistency makes more sense when framed as “we cannot hold a database transaction open across three external systems, so we need a way to make progress safely even when one step happens later.”

I also reuse examples from the actual codebase wherever possible. Teaching dependency injection, API contracts, or transaction boundaries using the team’s real services is far more effective than inventing toy examples that never resemble production.

### Pairing and knowledge sharing habits
I like pairing for work that is risky, novel, or important to spread. I do not use pairing as constant supervision. The best pairing sessions I have had involve narrating trade-offs, asking the other engineer to drive part of the solution, and making invisible decisions visible: why we are choosing this seam for a refactor, why this test belongs at an integration level, why this log line should include a domain identifier.

Beyond pairing, I prefer lightweight, repeatable knowledge sharing: architecture walk-throughs, short design notes, brown-bag sessions on real incidents, and post-release reviews that focus on what we learned rather than who was right. In distributed teams, these habits matter even more because so much context disappears if it lives only in meetings.

### Signs a junior engineer is ready to step up
I know a junior engineer is ready for more scope when they start demonstrating judgment, not just productivity. The signs I look for are consistent: they ask better questions, they identify edge cases before being prompted, they can explain the business impact of their change, they seek feedback early on risky work, and they leave an area cleaner than they found it.

Another strong signal is when they begin to think beyond their assigned ticket. If they notice a gap in observability, a missing test around a critical rule, or a naming problem that will confuse the next engineer, and they address it thoughtfully, that tells me they are moving from task execution toward engineering ownership. That is the transition I care about most.
