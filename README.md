# Drive School

Drive School is, as the name suggest, an app to help driving schools manage their schedule.
It is intended as a demo for DDD principles.

Featuring :
- Proper folder structure
- Integration using a real database
- Fully tested both with unit tests & integration tests
- Integratation are automatized using testcontainers
- Containerization of the dependencies (except NodeJS & PNPM)
- Usage of `tiny-types` for value objects
- Implementation of a rich Domain Model
- Mediator & CQRS pattern

Notes :
- The project makes the voluntary choice to depend on a specific ORM to simplify domain modeling

# Other resources
- [Do you need a persistent domain model ? Khorikov](https://khorikov.org/posts/2020-04-20-when-do-you-need-persistence-model/)