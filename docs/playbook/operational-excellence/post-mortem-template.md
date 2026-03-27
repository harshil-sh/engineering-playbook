# Post-Mortem Template

Post-mortems are blameless by design. The goal is to understand what happened, why the system allowed it to happen, and what changes will reduce the likelihood or impact of recurrence. Individual actions are recorded as facts, not as failures.

---

## Template

### Incident Summary

| Field | Value |
|---|---|
| **Incident ID** | |
| **Date / Time (UTC)** | |
| **Duration** | |
| **Severity** | P1 / P2 / P3 |
| **Service(s) affected** | |
| **Author** | |
| **Review date** | |

**One-paragraph summary:** What happened, when it was detected, and how it was resolved.

---

### Timeline

All times in UTC. Record facts as they occurred — do not reconstruct or tidy the sequence.

| Time (UTC) | Event |
|---|---|
| | |

---

### Contributing Factors

List the conditions that made this incident possible. Each factor should be a system or process property, not a person. A contributing factor explains *why* the system behaved the way it did, not *who* caused it.

- **Factor 1:** ...
- **Factor 2:** ...
- **Factor 3:** ...

---

### Customer Impact

Describe what customers or internal users experienced. Be specific: which journeys were affected, whether data was lost or delayed, and whether the impact was visible to end users.

- **User-facing impact:** ...
- **Data integrity impact:** None / Partial / Full — describe
- **Estimated users/requests affected:** ...

---

### Detection Gap

How long between the fault occurring and the team becoming aware? What surfaced the issue — an alert, a customer report, a manual check? What would have caught it sooner?

- **Time to detection:** ...
- **Detection mechanism:** ...
- **Gap identified:** ...

---

### Action Items

Each action item should have a single owner and a committed due date. Items without owners are not action items.

| # | Action | Owner | Due Date | Status |
|---|---|---|---|---|
| 1 | | | | Open |
| 2 | | | | Open |
| 3 | | | | Open |

---

---

## Worked Example (Redacted)

### Incident Summary

| Field | Value |
|---|---|
| **Incident ID** | INC-2024-047 |
| **Date / Time (UTC)** | 2024-09-12, 09:14 UTC |
| **Duration** | 2 hours 11 minutes |
| **Severity** | P2 |
| **Service(s) affected** | Order Fulfilment Background Processor |
| **Author** | [Redacted] |
| **Review date** | 2024-09-16 |

**One-paragraph summary:** Between 09:14 and 11:25 UTC on 12 September 2024, the Order Fulfilment Background Processor silently stopped processing messages from its Azure Service Bus queue. Affected messages were moved to the dead-letter sub-queue after exceeding the `MaxDeliveryCount` threshold, which had been incorrectly set to 1 during a configuration change deployed the previous evening. No alert fired during the two-hour window. The incident was identified via a customer support report at 11:19 UTC. The service was restored by correcting the configuration value and replaying dead-lettered messages.

---

### Timeline

| Time (UTC) | Event |
|---|---|
| 2024-09-11 18:42 | Configuration change deployed to production; `MaxDeliveryCount` set to 1 (intended value: 10) |
| 2024-09-12 09:14 | First message delivery attempted post-restart; message immediately dead-lettered after single processing attempt |
| 09:14 – 11:19 | Messages continued to arrive and dead-letter silently; no alert triggered |
| 11:19 | Customer support receives report of unprocessed orders; ticket raised internally |
| 11:31 | On-call engineer identifies dead-letter queue depth at 847 messages |
| 11:38 | Root cause identified: `MaxDeliveryCount = 1` in production configuration |
| 11:44 | Configuration corrected and service restarted |
| 11:52 | Dead-lettered messages replayed via Service Bus Explorer |
| 11:58 | Message processing confirmed healthy; dead-letter queue draining |
| 12:25 | Queue fully drained; incident closed |

---

### Contributing Factors

- **No dead-letter queue depth alert existed.** The monitoring setup covered queue lag on the main topic but not dead-letter accumulation. A spike in dead-letter depth was not observable without a manual check.
- **The configuration change was not reviewed against the service's processing contract.** `MaxDeliveryCount` controls how many times a message is attempted before dead-lettering. Setting it to 1 was consistent with valid Service Bus configuration syntax, so no validation error was raised at deployment time.
- **The deployment pipeline did not include a post-deploy smoke test that would have surfaced the misconfiguration.** A single end-to-end message processed successfully after deploy would have caught this within minutes.
- **The dead-letter replay path was not documented.** The engineer on call had to locate the correct tooling and procedure during the incident, adding time to resolution.

---

### Customer Impact

- **User-facing impact:** Orders submitted between 09:14 and 11:52 UTC were not fulfilled. Users received no error — the checkout flow completed normally, but fulfilment was not triggered.
- **Data integrity impact:** No data was lost. All messages were recoverable from the dead-letter sub-queue and successfully replayed.
- **Estimated users/requests affected:** 847 orders affected. All subsequently processed.

---

### Detection Gap

- **Time to detection:** 2 hours 5 minutes
- **Detection mechanism:** Customer support report, not automated alerting
- **Gap identified:** No alert existed for dead-letter queue depth. The system failed silently within its operational boundary — Service Bus behaved correctly given the configuration it was given. The gap was in observability, not in the message broker.

---

### Action Items

| # | Action | Owner | Due Date | Status |
|---|---|---|---|---|
| 1 | Add Azure Monitor alert for dead-letter queue depth > 10 on all production Service Bus queues | [Redacted – Platform Engineer] | 2024-09-19 | Completed |
| 2 | Add post-deploy smoke test to fulfilment processor pipeline: publish one synthetic message and assert it is consumed within 60 seconds | [Redacted – Backend Engineer] | 2024-09-26 | Completed |
| 3 | Document dead-letter replay procedure in the service runbook; link from the team wiki | [Redacted – Tech Lead] | 2024-09-20 | Completed |
| 4 | Add configuration schema validation step to deployment pipeline to check `MaxDeliveryCount` is within expected range (1–10 is valid; flag anything below 3 for manual review) | [Redacted – Platform Engineer] | 2024-10-04 | In Progress |
