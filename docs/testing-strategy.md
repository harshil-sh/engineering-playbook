# Testing Strategy

## Philosophy

Testing is a first-class engineering concern, not an afterthought. Our goal is to write tests that give us confidence the system works correctly, support safe refactoring, and serve as living documentation of intended behaviour.

**Core principles:**

- **Test behaviour, not implementation.** Tests should verify what the code does, not how it does it. Coupling tests to internal implementation details makes refactoring painful and tests brittle.
- **Fast feedback loops.** Tests should be fast enough to run on every save or commit. Slow tests get skipped.
- **Deterministic and isolated.** Tests must produce the same result every run. Avoid shared mutable state, time dependencies, and external network calls in unit tests.
- **Test at the right level.** Not every test needs to be end-to-end. Choose the lowest level that gives you adequate confidence.
- **Delete tests that no longer add value.** Stale, duplicated, or trivial tests add maintenance burden without benefit.

---

## Test Pyramid

The test pyramid describes the ideal distribution of test types in a healthy codebase. More tests should live at the bottom (fast, cheap, isolated) and fewer at the top (slow, costly, end-to-end).

```
           /\
          /  \
         / E2E\          ← Few: full system, real browser/API
        /------\
       / Integr.\        ← Some: service boundaries, DB, external deps
      /----------\
     /  Unit Tests \     ← Many: pure logic, fast, isolated
    /--------------\
```

### Unit Tests

- Test a single function, method, or class in isolation.
- Dependencies are replaced with fakes, stubs, or mocks.
- Should run in milliseconds.
- Aim for high coverage of business logic and edge cases.

### Integration Tests

- Test the interaction between two or more components — e.g., a repository hitting a real database, or an HTTP client calling a real service.
- Slower than unit tests but catch wiring issues that mocks miss.
- Use test databases/containers (e.g., Testcontainers) rather than shared environments.

### End-to-End (E2E) Tests

- Test the full system from the user's perspective.
- Slowest and most brittle — reserve for critical user journeys only.
- Run in CI on merge, not on every commit.

---

## C# Examples

### Unit Test (xUnit + NSubstitute)

```csharp
// OrderService.cs
public class OrderService
{
    private readonly IInventoryRepository _inventory;

    public OrderService(IInventoryRepository inventory)
    {
        _inventory = inventory;
    }

    public Result PlaceOrder(int productId, int quantity)
    {
        var stock = _inventory.GetStock(productId);
        if (stock < quantity)
            return Result.Failure("Insufficient stock");

        _inventory.Reserve(productId, quantity);
        return Result.Success();
    }
}

// OrderServiceTests.cs
public class OrderServiceTests
{
    private readonly IInventoryRepository _inventory = Substitute.For<IInventoryRepository>();
    private readonly OrderService _sut;

    public OrderServiceTests()
    {
        _sut = new OrderService(_inventory);
    }

    [Fact]
    public void PlaceOrder_WhenStockSufficient_ReturnsSuccess()
    {
        _inventory.GetStock(1).Returns(10);

        var result = _sut.PlaceOrder(productId: 1, quantity: 5);

        Assert.True(result.IsSuccess);
        _inventory.Received(1).Reserve(1, 5);
    }

    [Fact]
    public void PlaceOrder_WhenStockInsufficient_ReturnsFailure()
    {
        _inventory.GetStock(1).Returns(2);

        var result = _sut.PlaceOrder(productId: 1, quantity: 5);

        Assert.False(result.IsSuccess);
        Assert.Equal("Insufficient stock", result.Error);
        _inventory.DidNotReceive().Reserve(Arg.Any<int>(), Arg.Any<int>());
    }
}
```

### Integration Test (xUnit + Testcontainers)

```csharp
public class ProductRepositoryTests : IAsyncLifetime
{
    private PostgreSqlContainer _postgres = new PostgreSqlBuilder().Build();
    private ProductRepository _sut = null!;

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();
        var connectionString = _postgres.GetConnectionString();
        // Run migrations
        var db = new AppDbContext(connectionString);
        await db.Database.MigrateAsync();
        _sut = new ProductRepository(db);
    }

    [Fact]
    public async Task GetById_WhenProductExists_ReturnsProduct()
    {
        var product = new Product { Name = "Widget", Price = 9.99m };
        await _sut.AddAsync(product);

        var found = await _sut.GetByIdAsync(product.Id);

        Assert.NotNull(found);
        Assert.Equal("Widget", found.Name);
    }

    public async Task DisposeAsync() => await _postgres.DisposeAsync();
}
```

---

## Python Examples

### Unit Test (pytest)

```python
# order_service.py
class OrderService:
    def __init__(self, inventory):
        self._inventory = inventory

    def place_order(self, product_id: int, quantity: int) -> dict:
        stock = self._inventory.get_stock(product_id)
        if stock < quantity:
            return {"success": False, "error": "Insufficient stock"}

        self._inventory.reserve(product_id, quantity)
        return {"success": True}


# test_order_service.py
from unittest.mock import MagicMock
import pytest
from order_service import OrderService


@pytest.fixture
def inventory():
    return MagicMock()


@pytest.fixture
def service(inventory):
    return OrderService(inventory)


def test_place_order_sufficient_stock(service, inventory):
    inventory.get_stock.return_value = 10

    result = service.place_order(product_id=1, quantity=5)

    assert result["success"] is True
    inventory.reserve.assert_called_once_with(1, 5)


def test_place_order_insufficient_stock(service, inventory):
    inventory.get_stock.return_value = 2

    result = service.place_order(product_id=1, quantity=5)

    assert result["success"] is False
    assert result["error"] == "Insufficient stock"
    inventory.reserve.assert_not_called()
```

### Integration Test (pytest + SQLAlchemy + pytest-postgresql)

```python
# test_product_repository.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from product_repository import ProductRepository
from models import Base, Product


@pytest.fixture(scope="function")
def db_session(postgresql):
    """Spin up a real PostgreSQL instance per test (pytest-postgresql)."""
    engine = create_engine(
        f"postgresql://{postgresql.info.user}@{postgresql.info.host}"
        f":{postgresql.info.port}/{postgresql.info.dbname}"
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
    Base.metadata.drop_all(engine)


@pytest.fixture
def repo(db_session):
    return ProductRepository(db_session)


def test_get_by_id_returns_product(repo, db_session):
    product = Product(name="Widget", price=9.99)
    db_session.add(product)
    db_session.commit()

    found = repo.get_by_id(product.id)

    assert found is not None
    assert found.name == "Widget"


def test_get_by_id_returns_none_when_missing(repo):
    assert repo.get_by_id(999) is None
```

### Parametrize for edge cases

```python
@pytest.mark.parametrize("quantity,stock,expected_success", [
    (5, 10, True),   # sufficient stock
    (10, 10, True),  # exact stock
    (11, 10, False), # over stock
    (0, 10, True),   # zero quantity edge case
])
def test_place_order_stock_scenarios(service, inventory, quantity, stock, expected_success):
    inventory.get_stock.return_value = stock

    result = service.place_order(product_id=1, quantity=quantity)

    assert result["success"] is expected_success
```

---

## What to Avoid

| Anti-pattern | Why it hurts | Better approach |
|---|---|---|
| Testing private methods directly | Couples tests to implementation | Test via public interface |
| `sleep()` in tests | Flaky, slow | Use proper async/await or event-driven assertions |
| Shared mutable state between tests | Race conditions, order-dependent failures | Isolate state per test with fixtures |
| Mocking everything | Tests pass but system still breaks | Use real implementations where practical |
| 100% coverage as a goal | Incentivises trivial tests | Cover behaviour and edge cases that matter |
