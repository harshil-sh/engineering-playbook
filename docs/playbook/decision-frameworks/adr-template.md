# ADR Template

## Template

# ADR: _Decision title_

## Context
I describe the situation that forced this decision. I explain the business pressure, technical constraints, assumptions, and the trade-offs that matter right now. I write enough detail so that someone reading this months later can understand why this was not an abstract debate but a real decision with real consequences.

## Decision
I state the decision clearly and directly. I say what I chose, what scope it applies to, and what I expect teams to do because of it. If there are guardrails, exceptions, or follow-up implementation rules, I put them here instead of leaving them implied.

## Consequences

### Positive
I call out the benefits I expect from this decision. I include the outcomes I want to optimize for, such as speed, reliability, cost, operability, or team alignment.

### Negative
I acknowledge the downsides without softening them. I document the new risks, limitations, dependencies, operational burdens, or future constraints that come with the decision.

## Alternatives Considered
I list the serious options I evaluated and why I rejected them. I do not pretend every alternative was equally strong; I explain what was attractive about each option and why it still lost.

---

## Example: Choosing Azure Service Bus over RabbitMQ for an event-driven .NET microservices system

## Context
I am building an event-driven .NET microservices platform that already runs primarily in Azure. The system needs asynchronous messaging for domain events, background workflows, and service-to-service integration. I care more about operational simplicity, secure cloud integration, and predictable platform support than I do about maximizing low-level broker flexibility. I also want the development team to spend its time designing message contracts and resiliency policies, not patching and operating messaging infrastructure.

RabbitMQ is a credible option because it is mature, flexible, and widely understood. Still, using it would mean I own more of the operational surface area: clustering, upgrades, monitoring, failover behavior, scaling patterns, and security hardening. For this system, that looks like the wrong place to spend engineering energy.

## Decision
I will use Azure Service Bus as the primary message broker for this event-driven .NET microservices system.

I am making this choice because the platform is already Azure-centric, the team works in .NET, and I want managed messaging capabilities that integrate cleanly with Azure identity, networking, observability, and operations. I value native features like queues, topics, subscriptions, dead-lettering, retry support, and managed availability more than I value the extra protocol-level flexibility RabbitMQ gives me.

I am explicitly optimizing for managed operations and ecosystem fit, even if that means accepting tighter vendor alignment with Azure.

## Consequences

### Positive
- I reduce infrastructure ownership because Azure operates the broker for me.
- I get tighter integration with Azure services, security controls, and deployment workflows.
- I simplify operations for the team by relying on a managed service with built-in enterprise messaging features.
- I align the messaging platform with the rest of the .NET and Azure stack, which should speed up delivery and reduce accidental complexity.

### Negative
- I accept stronger vendor lock-in to Azure than I would with RabbitMQ.
- I give up some flexibility in exchange types, protocol customization, and broker-level tuning.
- I may pay more for managed convenience than I would for a self-managed RabbitMQ deployment at scale.
- I depend on Azure Service Bus quotas, feature boundaries, and regional availability characteristics.

## Alternatives Considered

### RabbitMQ
I considered RabbitMQ because it is proven, portable, and gives me excellent control over broker behavior. I rejected it for this system because that control comes with operational responsibility I do not want. For a platform optimized around Azure-managed services, RabbitMQ feels like extra infrastructure work without enough strategic upside.

### Azure Storage Queues
I considered Azure Storage Queues because they are simple and inexpensive. I rejected them because this system needs richer pub/sub patterns, better enterprise messaging semantics, and more sophisticated routing and delivery behavior than Storage Queues are designed to provide.

### Apache Kafka
I considered Kafka because it is powerful for high-throughput event streaming and replayable logs. I rejected it because this system needs application messaging and workflow coordination more than it needs a distributed event log. Kafka would solve a different problem and add more platform complexity than I want.
