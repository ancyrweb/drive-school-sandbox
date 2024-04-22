# Drive School

Drive School is, as the name suggest, an app to help driving schools manage their schedule.
It is intended as a demo for DDD principles.

Featuring :
- Proper folder structure
- Integration using a real database
- Fully tested both with unit tests & integration tests
- Integration are automatized using testcontainers
- Containerization of the dependencies (except NodeJS & PNPM)
- Usage of `tiny-types` for value objects
- Implementation of a rich Domain Model
- Mediator & CQRS pattern

Notes :
- The project makes the voluntary choice to depend on a specific ORM to simplify domain modeling

# Accounts

There's three type of accounts or, more specifically, an account can be either of 3 roles :
- Administrator
- Instructor
- Student

## Administrator
Can administrator can 
- Create, Update & Delete accounts
- Schedule lessons
- See student & instructor schedules
- Cancel a lesson anytime
- Assign another instructor to a lesson
- Add credit points to a student

## Instructor
An instructor can
- See his schedule
- Update his information
- Cancel a lesson anytime

## Student
A student can
- See his schedule
- Update his information
- Schedule a lesson and trade credit points for it
- Cancel a lesson and get back credits point if its within 48 hours
- Buy credit points

# Other resources
- [Do you need a persistent domain model ? Khorikov](https://khorikov.org/posts/2020-04-20-when-do-you-need-persistence-model/)

# Development Notes
## Account class

First use Typescript discriminated unions to represent the various type of accounts.
Then show how to refactor using classes.

## Lesson scheduling

Show how to program by wishful thinking by writing the code (even with errors) that you would
like to use.
Then glue the code using interfaces, delete all the pseudo-code and start writing tests.