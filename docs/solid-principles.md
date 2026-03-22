# SOLID Principles

A concise reference for applying SOLID principles in production systems.

## Single Responsibility Principle
Each module or class should have one clear reason to change. Separate domain logic, infrastructure concerns, and presentation behaviour.

## Open/Closed Principle
Prefer extension through composition, interfaces, and configuration instead of modifying stable code paths for every variation.

## Liskov Substitution Principle
Subtypes should honour the contract of their base type. If a replacement changes expected behaviour, the abstraction is wrong.

## Interface Segregation Principle
Design focused interfaces that fit specific consumers. Small interfaces reduce accidental coupling and make testing easier.

## Dependency Inversion Principle
Depend on abstractions that represent behaviour, not concrete implementation details. This improves testability and adaptability.

## Practical checklist
- Keep classes small and cohesive.
- Inject dependencies at boundaries.
- Favour composition over inheritance.
- Validate abstractions with real use cases.
- Refactor when behaviour starts spreading across layers.
