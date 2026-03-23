# Code Review Guidelines

Code review is a technical discussion, not a ceremony. The goal is to improve the change, protect production, and help engineers level up over time. For teams shipping .NET Core and Python services, good review discipline prevents the same classes of failures from recurring: deadlocks, hidden N+1 queries, missing cancellation, weak validation, vague APIs, and unsafe operational assumptions.

## 1. Code Review Philosophy

### Purpose of code review

Code review exists to:

- catch defects before production;
- challenge design decisions before they calcify;
- spread context across the team;
- enforce engineering standards consistently; and
- improve maintainability for the next engineer, not just the current author.

Code review is **not** for:

- gatekeeping through personal preference;
- forcing stylistic rewrites already handled by formatters and linters;
- showing off expertise; or
- making the author guess what “good enough” means.

✅ **Good:** “This endpoint returns `200 OK` when the record is missing. I think this should be `404 Not Found` so API consumers can distinguish an empty result from a missing resource.”

❌ **Bad:** “This feels wrong.”

✅ **Good:** “I’m blocking on this because the query will evaluate in memory after `ToListAsync()`, which will hurt performance on large datasets.”

❌ **Bad:** “I don’t like this approach.”

### What good looks like

A good review produces one of two outcomes quickly:

1. the change is safe to merge; or
2. the author has a clear, prioritized list of issues to fix.

A good reviewed change is:

- correct under normal and failure conditions;
- readable without tribal knowledge;
- aligned with service boundaries and architecture;
- observable in production through logs, metrics, and traces where appropriate;
- tested at the right level; and
- deployable without avoidable risk.

A good review comment is:

- specific;
- actionable;
- tied to impact;
- explicit about severity; and
- respectful in tone.

### Tone and language guidelines

Write comments as if you are reviewing a teammate you will pair with next week.

#### Preferred language

- Use **questions** when intent is unclear.
- Use **direct statements** when there is a correctness, security, or reliability issue.
- Separate **must-fix** items from **optional suggestions**.
- Explain the **why**, especially for non-obvious feedback.

#### Comment labels

Use these labels consistently:

- **Blocker:** must be fixed before merge.
- **Should fix:** strong recommendation; usually fix before merge.
- **Nit:** optional polish.
- **Question:** clarification requested.

#### Good vs bad comments

✅ **Good:** “**Blocker:** `async void` here means exceptions will bypass normal task handling. This should return `Task` so callers can await it and failures are observable.”

❌ **Bad:** “Never use this.”

✅ **Good:** “**Should fix:** We create `HttpClient` inside the method. Prefer DI with `IHttpClientFactory` so connection pooling is handled correctly.”

❌ **Bad:** “Bad pattern.”

✅ **Good:** “**Question:** Is this `AsNoTracking()` intentionally omitted? If this is a read-only query, tracking adds overhead without benefit.”

❌ **Bad:** “Why?”

✅ **Good:** “**Nit:** Consider renaming `data` to `customerInvoices` so the next step reads more clearly.”

❌ **Bad:** “Variable names could be better.”

### Author responsibilities

Before requesting review, the author should:

- keep the pull request focused and reviewable;
- provide enough context for a reviewer to understand the business change;
- call out risky areas, migrations, or rollout concerns;
- include tests, or explain why tests are not appropriate;
- verify local checks pass before assigning reviewers;
- avoid mixing unrelated refactors with business changes; and
- respond to comments with either a code change or a clear rationale.

Authors should not outsource first-pass quality to reviewers. “Please review” is not a substitute for running tests, reading the diff, or checking for obvious edge cases.

✅ **Good author behavior:** “This PR adds pagination to the customer search endpoint. Main risks: query shape changed, DTO contract changed, and index migration is included. Tested with integration tests and manual checks against seeded data.”

❌ **Bad author behavior:** “Big refactor. Please review.”

### Reviewer responsibilities

Reviewers should:

- review for correctness, clarity, risk, and maintainability;
- respond within the team SLA even if only to acknowledge and schedule full review;
- avoid bikeshedding on formatter/linter concerns;
- distinguish preference from policy;
- verify tests are appropriate to the level of change;
- review the pull request description, not just the code;
- check for operational impact such as migrations, feature flags, and backwards compatibility; and
- close the loop promptly after author updates.

Reviewers are responsible for being decisive. If something is acceptable, approve it. Endless low-value churn slows the team down and trains authors to ignore review feedback.

### Time expectations and SLA

Code review latency is an engineering productivity problem. Set explicit expectations.

#### Team SLA

- [ ] **New pull requests acknowledged within 4 business hours.**
- [ ] **First substantive review within 1 business day.**
- [ ] **Re-review after author updates within 1 business day.**
- [ ] **Urgent production fixes reviewed as soon as possible and explicitly called out as urgent.**
- [ ] **If a reviewer cannot meet the SLA, they reassign or notify the author promptly.**

#### Review size expectations

- [ ] Aim for pull requests that can be reviewed in **30 minutes or less**.
- [ ] Split changes larger than roughly **400 changed lines** unless there is a strong reason not to.
- [ ] Separate mechanical refactors from behavior changes.

✅ **Good:** small, scoped PR with migration, API change, and tests clearly explained.

❌ **Bad:** one PR containing schema changes, business logic rewrite, formatting churn, and unrelated dependency upgrades.

## 2. C# and .NET Review Checklist

Use this checklist when reviewing ASP.NET Core services, background jobs, libraries, and data access code.

### Async/Await

- [ ] No `.Result` or `.Wait()` on tasks in request, job, or library code.
- [ ] No `async void` except for true event handlers.
- [ ] Public async methods accept and propagate `CancellationToken` where cancellation is meaningful.
- [ ] `CancellationToken` is passed to EF Core, HTTP, file, and other async I/O calls.
- [ ] Independent async operations use `Task.WhenAll` when parallelism is safe and improves latency.
- [ ] Async flows do not hide exceptions by ignoring returned tasks.
- [ ] Long-running work does not execute synchronously inside ASP.NET request paths.

✅ **Good:**

```csharp
public async Task<IReadOnlyList<OrderDto>> GetOrdersAsync(Guid customerId, CancellationToken cancellationToken)
{
    var orders = await _dbContext.Orders
        .Where(x => x.CustomerId == customerId)
        .AsNoTracking()
        .ToListAsync(cancellationToken);

    return orders.Select(Map).ToList();
}
```

❌ **Bad:**

```csharp
public List<OrderDto> GetOrders(Guid customerId)
{
    var orders = _dbContext.Orders
        .Where(x => x.CustomerId == customerId)
        .ToListAsync()
        .Result;

    return orders.Select(Map).ToList();
}
```

✅ **Good:** use `Task.WhenAll` for independent I/O.

```csharp
var customerTask = _customerClient.GetCustomerAsync(customerId, cancellationToken);
var ordersTask = _orderClient.GetOrdersAsync(customerId, cancellationToken);
await Task.WhenAll(customerTask, ordersTask);
```

❌ **Bad:** serial awaits for independent remote calls on a hot path.

```csharp
var customer = await _customerClient.GetCustomerAsync(customerId, cancellationToken);
var orders = await _orderClient.GetOrdersAsync(customerId, cancellationToken);
```

### LINQ and EF Core

- [ ] Query composition stays on `IQueryable` until the final materialization point.
- [ ] The code does not accidentally switch to `IEnumerable` too early and force in-memory filtering.
- [ ] Read-only queries use `AsNoTracking()` unless change tracking is actually needed.
- [ ] Includes and projections are intentional; the query is not loading entire entity graphs by default.
- [ ] Reviewer checked for N+1 query patterns caused by lazy loading or looping over queries.
- [ ] Pagination is present for list endpoints and administrative screens returning potentially unbounded data.
- [ ] Projection selects only required fields for read paths.
- [ ] Filtering, ordering, and pagination happen in the database, not after materialization.
- [ ] Raw SQL usage is parameterized and justified.

✅ **Good:** keep filtering server-side and project only what is needed.

```csharp
var page = await _dbContext.Customers
    .AsNoTracking()
    .Where(x => x.IsActive)
    .OrderBy(x => x.LastName)
    .Skip(request.Offset)
    .Take(request.Limit)
    .Select(x => new CustomerListItem(x.Id, x.FirstName, x.LastName))
    .ToListAsync(cancellationToken);
```

❌ **Bad:** materialize early, then paginate in memory.

```csharp
var customers = (await _dbContext.Customers.ToListAsync(cancellationToken))
    .Where(x => x.IsActive)
    .Skip(request.Offset)
    .Take(request.Limit)
    .ToList();
```

✅ **Good:** detect and question N+1 queries.

```csharp
var orders = await _dbContext.Orders
    .AsNoTracking()
    .Select(o => new OrderSummaryDto
    {
        Id = o.Id,
        CustomerName = o.Customer.Name,
        Total = o.Total
    })
    .ToListAsync(cancellationToken);
```

❌ **Bad:** loop with per-item queries.

```csharp
var orders = await _dbContext.Orders.ToListAsync(cancellationToken);
foreach (var order in orders)
{
    order.Customer = await _dbContext.Customers
        .SingleAsync(x => x.Id == order.CustomerId, cancellationToken);
}
```

### Memory and Performance

- [ ] The code avoids unnecessary allocations on hot paths.
- [ ] Reviewer considered object lifetime and GC pressure, especially in loops and high-volume endpoints.
- [ ] Large buffers, payloads, or strings are evaluated with awareness of the Large Object Heap threshold.
- [ ] `IDisposable` and `IAsyncDisposable` resources are disposed correctly.
- [ ] `StringBuilder` is used instead of repeated string concatenation in loops or high-volume assembly paths.
- [ ] Streams and file operations avoid loading large payloads into memory unnecessarily.
- [ ] Caching decisions are explicit, bounded, and invalidation-aware.
- [ ] Performance-sensitive code has evidence: benchmark, metrics, profiler output, or a strong reasoned argument.

✅ **Good:** use `await using` for async-disposable resources.

```csharp
await using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
```

❌ **Bad:** disposable resource created without deterministic cleanup.

```csharp
var stream = new FileStream(path, FileMode.Open);
return await ProcessAsync(stream);
```

✅ **Good:** use `StringBuilder` for repeated concatenation.

```csharp
var builder = new StringBuilder();
foreach (var line in lines)
{
    builder.AppendLine(line);
}
```

❌ **Bad:** repeated string concatenation in a loop.

```csharp
var output = string.Empty;
foreach (var line in lines)
{
    output += line + Environment.NewLine;
}
```

### Security

- [ ] No hardcoded secrets, tokens, passwords, or connection strings.
- [ ] Secrets come from approved configuration or secret management systems.
- [ ] JWT validation checks issuer, audience, expiry, signing key, and relevant claims.
- [ ] Authorization is enforced at the correct boundary, not inferred from UI behavior.
- [ ] SQL injection is prevented through EF Core parameterization or parameterized SQL.
- [ ] Inputs are validated and encoded appropriately for their sink.
- [ ] File upload, deserialization, and redirect flows were reviewed against common OWASP Top 10 risks.
- [ ] Sensitive data is not written to logs.
- [ ] Error responses do not leak stack traces, secrets, or internal identifiers.
- [ ] Any cryptographic usage relies on framework-approved primitives rather than custom implementations.

✅ **Good:** parameterized SQL when raw SQL is unavoidable.

```csharp
var users = await _dbContext.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE Email = {email}")
    .ToListAsync(cancellationToken);
```

❌ **Bad:** string interpolation into SQL.

```csharp
var sql = $"SELECT * FROM Users WHERE Email = '{email}'";
var users = await _dbContext.Users.FromSqlRaw(sql).ToListAsync(cancellationToken);
```

### Architecture

- [ ] Responsibilities are separated cleanly; the change does not add obvious SOLID violations.
- [ ] Business logic depends on abstractions and injected collaborators where appropriate.
- [ ] Business logic is not instantiating infrastructure directly with `new` when DI should own the dependency.
- [ ] HTTP endpoints return correct status codes and error shapes.
- [ ] Validation, orchestration, and persistence responsibilities are not collapsed into a single class.
- [ ] Domain concepts are named clearly; the code does not leak transport or ORM concerns into core logic unnecessarily.
- [ ] Feature flags, migrations, and backwards compatibility are handled when the change spans versions.
- [ ] Cross-cutting concerns such as logging, retries, and resilience are implemented in the right layer.

✅ **Good:** controller delegates business logic and returns an appropriate status code.

```csharp
[HttpGet("{id:guid}")]
public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
{
    var customer = await _service.GetByIdAsync(id, cancellationToken);
    return customer is null ? NotFound() : Ok(customer);
}
```

❌ **Bad:** controller embeds persistence, mapping, and status code mistakes.

```csharp
[HttpGet("{id:guid}")]
public async Task<Customer> Get(Guid id)
{
    var context = new AppDbContext();
    return await context.Customers.SingleAsync(x => x.Id == id);
}
```

## 3. Python Review Checklist

Use this checklist for Python APIs, workers, scripts promoted into production paths, and internal libraries.

- [ ] Type hints are present on all functions and methods, including return types.
- [ ] Pydantic models are used for input validation and boundary contracts where structured data enters the system.
- [ ] No bare `except:` clauses.
- [ ] Exceptions are caught narrowly and handled intentionally.
- [ ] Async code uses `async`/`await` correctly and does not block the event loop with synchronous I/O or CPU-heavy work.
- [ ] No mutable default arguments such as `[]`, `{}`, or `set()`.
- [ ] Logging uses the configured logger, not `print` statements.
- [ ] Tests are included at the right level for the change.
- [ ] Functions are small enough to understand and compose; hidden side effects are called out.
- [ ] Data access and external calls are isolated behind testable interfaces or modules.

✅ **Good:** typed function, validated input, structured logging.

```python
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class CreateUserRequest(BaseModel):
    email: str
    display_name: str


def create_user(request: CreateUserRequest) -> dict[str, str]:
    logger.info("Creating user", extra={"email": request.email})
    return {"email": request.email, "display_name": request.display_name}
```

❌ **Bad:** untyped function, print debugging, no validation.

```python
def create_user(data={}):
    print("creating user")
    return {"email": data["email"], "display_name": data["display_name"]}
```

✅ **Good:** narrow exception handling.

```python
try:
    payload = json.loads(raw_body)
except json.JSONDecodeError as exc:
    raise ValueError("Invalid JSON payload") from exc
```

❌ **Bad:** bare except that hides unrelated failures.

```python
try:
    payload = json.loads(raw_body)
except:
    payload = {}
```

✅ **Good:** immutable default and explicit logger.

```python
def build_headers(extra_headers: dict[str, str] | None = None) -> dict[str, str]:
    headers = {"Accept": "application/json"}
    if extra_headers:
        headers.update(extra_headers)
    return headers
```

❌ **Bad:** mutable default argument.

```python
def build_headers(extra_headers={}):
    extra_headers["Accept"] = "application/json"
    return extra_headers
```

✅ **Good:** async path avoids blocking calls.

```python
async def fetch_user(client: httpx.AsyncClient, user_id: str) -> dict:
    response = await client.get(f"/users/{user_id}")
    response.raise_for_status()
    return response.json()
```

❌ **Bad:** blocking I/O in async function.

```python
async def fetch_user(user_id: str) -> dict:
    response = requests.get(f"https://api.example.com/users/{user_id}")
    return response.json()
```

## 4. Architecture Review Checklist

These questions apply when the pull request changes system boundaries, persistence, contracts, or scale characteristics.

### API design review points

- [ ] Endpoint names and resource structure are consistent with existing API conventions.
- [ ] Request and response contracts are explicit, version-safe, and documented where required.
- [ ] Validation rules are enforced at the boundary.
- [ ] Error responses are consistent and actionable for clients.
- [ ] Idempotency is considered for create, retry, and webhook-style operations.
- [ ] Pagination, filtering, and sorting are defined for collection endpoints.
- [ ] Breaking changes are identified and migration strategy is documented.
- [ ] Authentication and authorization requirements are clear at the API boundary.

✅ **Good:** `GET /customers/{id}` returns `404` when missing and uses a stable response contract.

❌ **Bad:** endpoint sometimes returns `200`, sometimes `500`, and sometimes an empty object for the same missing-resource case.

### Database schema review points

- [ ] New tables and columns use clear names and appropriate data types.
- [ ] Nullability matches real business rules rather than convenience.
- [ ] Indexes support expected query patterns.
- [ ] Unique constraints exist where the business domain requires uniqueness.
- [ ] Foreign keys and delete behavior are intentional.
- [ ] Migrations are safe for production data volume and deployment order.
- [ ] Backfills and default values are considered for existing rows.
- [ ] Schema changes avoid long locks or high-risk rewrites without a rollout plan.

✅ **Good:** add index before routing high-volume reads through a new query path.

❌ **Bad:** add a frequently filtered column with no index, then paginate across millions of rows.

### Security review points

- [ ] Threat model is proportionate to the change.
- [ ] Trust boundaries are explicit.
- [ ] Sensitive data classification is understood and handled correctly.
- [ ] Authentication, authorization, and audit requirements are met.
- [ ] Input validation and output encoding are appropriate for every boundary.
- [ ] Secrets management, key rotation, and token lifetime concerns are handled.
- [ ] Logs, traces, and metrics avoid exposing sensitive data.
- [ ] Third-party dependencies and external integrations are reviewed for security impact.

✅ **Good:** reviewer asks where the new webhook signature is validated and how replay attacks are prevented.

❌ **Bad:** reviewer approves auth-related changes without checking claim validation or permission boundaries.

### Scalability review points

- [ ] Expected traffic, concurrency, payload size, and data growth are considered.
- [ ] Hot paths avoid unnecessary remote calls, serialization overhead, and repeated allocations.
- [ ] The design degrades gracefully under partial failure.
- [ ] Timeouts, retries, and circuit-breaking behavior are appropriate.
- [ ] Batch operations, queue consumers, and scheduled jobs are safe at scale.
- [ ] Caching, if introduced, has a clear eviction and consistency strategy.
- [ ] Read/write amplification is understood.
- [ ] Observability is sufficient to detect regressions after rollout.

✅ **Good:** reviewer asks how a new fan-out workflow behaves when one downstream dependency is slow.

❌ **Bad:** reviewer approves a synchronous chain of five service calls on a user-facing request path without questioning latency or failure mode.

## 5. Pull Request Template

Create or update `.github/pull_request_template.md` with the following content.

```md
## Description

### What changed?
- [ ] Describe the behavior change clearly.
- [ ] Link the ticket, incident, or design note if relevant.
- [ ] Call out any risky areas, migrations, or rollout concerns.

### Why is this change needed?
Explain the problem being solved and the user or system impact.

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Performance improvement
- [ ] Security improvement
- [ ] Dependency update
- [ ] Documentation only
- [ ] Breaking change

## Testing

- [ ] Unit tests added or updated
- [ ] Integration tests added or updated
- [ ] Manual testing completed
- [ ] Linters/formatters passed
- [ ] Relevant CI jobs passed
- [ ] No tests were added because this change does not justify them, and I explained why

### Test evidence
List the commands run and summarize the outcome.

## Review checklist

### Author checklist
- [ ] PR is focused and reasonably sized
- [ ] Code is self-reviewed
- [ ] Logging, metrics, and traces were considered where relevant
- [ ] Error handling paths were reviewed
- [ ] Security impact was reviewed
- [ ] Database/query impact was reviewed
- [ ] API contract impact was reviewed
- [ ] Documentation was updated if needed

### Reviewer checklist
- [ ] Correctness verified
- [ ] Maintainability verified
- [ ] Security concerns reviewed
- [ ] Performance concerns reviewed
- [ ] Tests are appropriate for the change
- [ ] Rollout and operational impact reviewed

## Screenshots

- [ ] Screenshots attached if the change affects UI or developer-facing output
- [ ] Not applicable
```

## Related sections

- [Engineering Principles](engineering-principles.md) for the broader standards that should inform review feedback.
- [SOLID Principles](solid-principles.md) for the design signals reviewers should look for in object-oriented code.
- [Architecture Decision Records](architecture-decision-records.md) for documenting larger design choices that surface during review.
