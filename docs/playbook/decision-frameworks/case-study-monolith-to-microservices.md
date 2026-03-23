# Case Study: Migrating a Monolithic .NET Application to Microservices While Still Shipping

## Problem

I inherited a .NET application that had started as a healthy monolith and then become a delivery bottleneck. One ASP.NET codebase handled onboarding, billing, reporting, and notifications against a shared SQL Server database. That simplicity had helped early on, but once three teams were shipping into the same application, releases became crowded and risky. A delay in one area blocked everyone else.

I could not stop feature work for a long rewrite. The business still needed delivery, so the challenge was to improve team autonomy without adding so much deployment complexity that we moved slower. I also had to think carefully about latency. In the monolith, most calls were in-process. A distributed architecture would add network hops, timeout risk, and new debugging overhead.

## Options Considered

The first option was to keep the monolith and improve internal modularity. That would preserve the simplest deployment model and keep latency low. It was attractive because the teams could continue shipping immediately. The trade-off was organizational: autonomy would remain limited because every change still depended on the same release process and shared database.

The second option was a full microservices rewrite. That offered the cleanest picture of independent ownership, but it was unrealistic. We would have taken on service discovery, distributed tracing, security between services, and much more operational work before proving the business value. I expected feature velocity to collapse.

The third option was incremental extraction. We would tighten boundaries inside the monolith first, then extract only the areas with clear interfaces and different scaling needs.

## Decision

I chose the incremental approach. We kept the monolith for core transactional workflows and extracted notifications first, then reporting. Those domains had looser coupling, different performance profiles, and fewer immediate consistency requirements.

We introduced explicit APIs instead of shared database access. For non-blocking workflows, we published events asynchronously. Just as importantly, we refused to split latency-sensitive paths too early. Customer-facing requests that depended on fast, predictable response times stayed in the monolith until we had better telemetry and confidence in service-to-service communication.

This was a conscious trade-off. I accepted more deployment complexity because each service brought its own pipeline, monitoring, and ownership model. In return, the reporting and notifications teams could deploy independently and stop waiting for a shared release window.

## Outcome

Within two quarters, the release process was noticeably healthier. The reporting team could scale and ship on its own cadence, and a notification issue no longer threatened the main transaction flow. We kept shipping features during the migration because each extraction was delivered in small slices instead of a big-bang rewrite.

The costs were real. Local development became harder, observability work increased, and some requests were slower because they crossed service boundaries. Still, the latency trade-off was acceptable in the domains we extracted, and the improvement in team autonomy justified the extra operational work.

## Retrospective

The biggest lesson for me was that microservices only helped because we were selective. If I had optimized only for autonomy, I would have created too many services and paid for it in latency and complexity. If I had optimized only for simple deployments, the teams would have stayed tangled together.

What worked was treating architecture as a sequencing problem, not a purity exercise. I did not need to choose monolith or microservices in one move. I needed to decide where extra deployment complexity created enough autonomy to outweigh the latency and operational cost. For this system, a gradual hybrid model was the right answer.
