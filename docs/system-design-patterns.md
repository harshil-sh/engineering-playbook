# System Design Patterns

This section captures practical patterns I rely on when designing systems that need to scale, remain observable, and evolve safely.

## Core areas
- Define clear service boundaries.
- Design for failure and recovery.
- Use asynchronous communication where it reduces coupling.
- Build observability into the first version.
- Optimise for maintainability before premature scale.

## Patterns to revisit
| Pattern | When to use it |
| --- | --- |
| API Gateway | Centralise cross-cutting concerns for external access |
| Event-driven workflows | Decouple services and improve resilience |
| Outbox pattern | Preserve reliability when publishing integration events |
| Caching | Reduce latency and protect downstream dependencies |
| Circuit breaker | Prevent cascading failures during partial outages |

## Decision lens
Evaluate trade-offs in terms of complexity, reliability, operability, and team cognitive load.
