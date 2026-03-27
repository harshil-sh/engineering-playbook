# Engineering in the Age of AI

AI assistants are useful tools. They are not senior engineers, they do not understand your system, and they will confidently generate plausible-looking code that silently misbehaves. The question is not whether to use them — the question is where they add leverage and where they introduce risk.

This page documents my personal approach: where I reach for an LLM, where I don't, and how I verify what comes back.

---

## Where I Use LLMs

### Boilerplate and scaffolding

.NET Core and React both carry significant ceremony. Generating the skeleton for a new controller, a typed React hook, an xUnit test class, or an Azure Function binding is mechanical work. LLMs handle it well because the patterns are stable, well-represented in training data, and easy to verify at a glance.

What this looks like in practice:

- Scaffolding a new API controller with standard route, DI constructor, and cancellation token patterns
- Generating the shape of a React context + reducer before filling in real logic
- Producing the boilerplate for a new background service inheriting `BackgroundService`

The key property: I could write it myself without thinking. The LLM just removes the typing.

### Unit test scaffolding

Given a method signature and a brief description of intent, an LLM produces a reasonable set of test cases faster than I would manually. It's particularly useful for:

- Generating the Arrange/Act/Assert skeleton for a batch of edge cases I've already identified
- Producing parameterised test data for boundary conditions
- Drafting Moq setup code for common service dependencies

I treat the output as a draft. I review every assertion, confirm the mocks reflect real contract behaviour, and delete tests that assert implementation details rather than observable outcomes.

### Design rubber-ducking

Explaining an architectural problem to an LLM forces me to articulate it clearly — which is half the value. The other half is that the model often surfaces a consideration I hadn't weighted: a consistency implication, an alternative decomposition, a question about failure modes.

I use this most when I'm early in a design and haven't yet written anything down. The prompt is usually: *"Here is the problem. Here are my constraints. Here is what I'm leaning toward. What am I missing?"*

I don't adopt suggestions uncritically. I treat it like a first-pass peer review from someone who knows distributed systems theory but has never seen our codebase.

---

## Where I Don't Use LLMs

### Security decisions

LLMs do not have access to your threat model. They will generate code that *looks* secure and may miss the specific trust boundary or data sensitivity that makes the difference. I don't use AI assistance for:

- Authentication and authorisation logic
- Input validation at trust boundaries
- Cryptographic choices
- Secret handling and rotation
- CORS policy, rate limiting thresholds, or anything touching Azure API Management policy

These decisions are made deliberately, reviewed by at least one other engineer, and reasoned about against documented requirements — not generated and verified by eye.

### Production debugging

When something is broken in production, I need to understand the system — not have text predicted at me. LLMs don't have access to your logs, your traces, your deployment history, or your data. Feeding them stack traces and asking for a diagnosis is a pattern that wastes time and builds false confidence.

Production debugging is an empirical process: form a hypothesis, find the evidence, confirm or reject. Application Insights, structured logs, and distributed traces are the tools. The answer lives in the system, not in a language model.

### Architectural choices

The tradeoffs that matter in an architectural decision are almost always specific: this team's operational maturity, this organisation's Azure spending envelope, this service's SLA, this domain's consistency requirements. General-purpose models don't know any of that.

I use ADRs to make architectural decisions legible and revisable. Those decisions are made by engineers who understand the context, not generated and adopted because the output sounded reasonable.

---

## My Verification Process for AI-Generated Code

I treat AI-generated code as untrusted input, the same way I treat code from a contractor I've never worked with before. The review bar is higher than for code from a colleague I trust.

**1. Read every line before running it.**
This sounds obvious. It is frequently skipped. If I can't explain what a line does, I don't merge it.

**2. Confirm library and API usage against current documentation.**
LLM training data has a cutoff. Azure SDK APIs change. ASP.NET Core idioms evolve. I verify method signatures, deprecation status, and configuration keys against the actual SDK documentation or source, not the generated comment.

**3. Check for silent failure modes.**
Generated code often handles the happy path correctly and mishandles errors in ways that fail silently: swallowed exceptions, unchecked nulls, missing cancellation token propagation, fire-and-forget tasks. I specifically look for these.

**4. Confirm the tests test the right thing.**
Generated tests frequently assert that the mock was called, not that the outcome was correct. I check that each test would fail if the implementation were broken in the way the test is meant to catch.

**5. Run it.**
Static review catches logic errors; the runtime catches environment mismatches, missing configuration, and integration surprises. AI-generated code gets the same test run as everything else — no exceptions.

---

## The underlying principle

AI assistance compresses the time cost of mechanical work. It does not compress the cognitive cost of understanding what you're building. Those are different things, and conflating them is how you end up with fast-generated systems that nobody fully understands.

The engineer is still responsible. The model is a tool.
