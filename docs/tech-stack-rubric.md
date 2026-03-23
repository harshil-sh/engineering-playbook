# Tech Stack Rubric

## How I choose a tech stack

When I choose a tech stack, I do not start with what is fashionable. I start with what will help a team ship useful software quickly, run it reliably, and pay for it without regret. As a senior full-stack engineer working primarily with .NET Core, React, and Azure, I treat stack selection as a practical decision, not an identity statement. I want a stack that lets me deliver cleanly today and still feel confident about owning it a year from now.

I evaluate that choice through three lenses: developer velocity, system reliability, and cost. I rarely optimise one of them in isolation because every stack decision creates second-order effects. A framework that speeds up prototyping but slows down hiring, a platform choice that improves resilience but multiplies operational spend, or a cheap option that creates recurring delivery drag is not actually a good decision. I want balance, and I want that balance to be explicit.

### 1. Developer velocity

I prioritise the stack that helps a good team move with clarity and consistency. Velocity is not just about how fast I can scaffold a project on day one. It is about how quickly the team can understand the codebase, add features safely, onboard new engineers, review pull requests, debug issues, and make changes without unintended damage.

That is one of the main reasons I default toward ASP.NET Core for backend services, React for front-end applications, and Azure-native services where they remove plumbing rather than add mystery. In practice, this combination gives me mature tooling, strong community support, predictable deployment paths, and a large hiring market. It also means I can keep the cognitive load focused on domain problems instead of spending time fighting weak frameworks or exotic infrastructure.

When I assess developer velocity, I ask myself questions like:

- How quickly can a new engineer become productive?
- How much boilerplate will the team maintain over time?
- Are the debugging, testing, and local development workflows straightforward?
- Does the ecosystem support the patterns I actually need, not just the ones in conference talks?
- Will this stack make common work easy and risky work visible?

I favour stacks that are boring in the best possible way: well documented, well understood, and hard to misuse. If a simpler combination of .NET Core, React, PostgreSQL or SQL Server, and standard Azure services solves the problem, I will choose that over a more fragmented stack every time.

### 2. System reliability

I choose technology with production behaviour in mind, not just development experience. A tech stack is only as good as its failure modes. I want to know how it behaves under load, during dependency outages, during partial failures, during deployments, and during the kind of messy incidents that never appear in a vendor demo.

This lens usually pushes me toward technologies with strong operational characteristics: predictable hosting, mature observability, clear security models, and proven runtime behaviour. ASP.NET Core on Azure App Service, Azure Container Apps, or AKS can all be good choices, but only when the operational model matches the team. I do not choose a more distributed platform unless the scale, isolation, or deployment requirements justify the extra complexity.

For reliability, I care about:

- Operational maturity and proven runtime stability.
- First-class support for logging, tracing, metrics, health checks, and alerts.
- Clear identity, secrets, and configuration management.
- Safe deployment patterns such as slot swaps, rolling deployments, and automated rollback.
- Compatibility with resilience patterns like retries, circuit breakers, queues, and idempotency.

I also look carefully at integration boundaries. A stack that works beautifully in isolation but becomes fragile when it touches Entra ID, service buses, databases, storage accounts, or third-party APIs is not reliable enough for serious systems. I want platform choices that let me build for graceful degradation and observable recovery, not just nominal-path success.

### 3. Cost

I treat cost as an engineering constraint, not a finance-only concern. A stack decision affects cloud spend, licence spend, support effort, maintenance overhead, and staffing flexibility. Cheap infrastructure can become expensive if it demands specialist knowledge or constant manual work. Expensive managed services can be worthwhile if they remove entire categories of operational burden.

My job is not to minimise the monthly Azure invoice at all costs. My job is to find the best total cost of ownership for the stage and shape of the system.

When I evaluate cost, I look at:

- The infrastructure cost at current scale and plausible near-term growth.
- The engineering effort required to operate the platform safely.
- The cost of specialist skills versus broadly available team capability.
- Vendor lock-in risk compared with delivery speed and support quality.
- Whether the architecture can scale incrementally instead of forcing large early commitments.

This is why I often prefer managed Azure services when they meaningfully reduce operational labour, but I still challenge them when they are oversized for the workload. For example, I might choose Azure SQL Database, App Service, and Azure Monitor for a line-of-business application because they keep the platform lean and supportable. I would be slower to justify AKS, Cosmos DB, or a heavily event-driven architecture unless I had a concrete scaling, latency, or autonomy reason to absorb the extra cost and complexity.

## Comparison rubric

| Lens | What I optimise for | What I usually prefer | What makes me cautious |
| --- | --- | --- | --- |
| Developer velocity | Fast onboarding, simple workflows, predictable delivery, maintainable code | ASP.NET Core, React, TypeScript, standard CI/CD, managed Azure hosting, familiar data stores | Excessive boilerplate, niche frameworks, fragmented tooling, difficult local setup |
| System reliability | Stable runtime behaviour, strong observability, safe deployments, secure defaults | Mature platform services, health checks, structured logging, managed identity, queues where needed, proven hosting model | Distributed complexity without need, unclear failure modes, weak monitoring, fragile integrations |
| Cost | Sensible total cost of ownership across cloud spend and team effort | Right-sized Azure services, managed offerings that remove toil, mainstream tooling with strong hiring market | Premium services without clear value, over-engineered platforms, lock-in without delivery benefit, specialist-only stacks |

## My default decision pattern

If several stacks could work, I choose the one that gives me the highest confidence across all three lenses instead of the one that wins a single category. In most enterprise delivery contexts, that means I favour a pragmatic baseline: ASP.NET Core for APIs and back-end services, React with TypeScript for the front end, Azure-native hosting and identity, and a mainstream relational database unless there is a strong reason to do otherwise.

I will move away from that baseline when the context demands it, but I want the reason to be concrete. If I am choosing a different database, runtime, front-end framework, or hosting model, I expect to be able to explain exactly which velocity, reliability, or cost constraint it solves better than the default. If I cannot explain that clearly, I treat the change as unnecessary complexity.

That is ultimately how I choose a tech stack: I back the option that helps the team deliver quickly, operate confidently, and spend responsibly. I am not trying to build the most interesting system on paper. I am trying to build the most effective one in production.
