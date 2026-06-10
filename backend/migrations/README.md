# Database

In the migrations folder the contents are the requirements for setting up the database.
Can be run by either `npm run db:migrate` from `root` or from `\backend`.

## Files

### bootstrap/create_db.sql

- Create the database once. This is required to be the first run instance ONLY once.

### 001_create_table.sql

- Creates the tasks table to hold all task data as well as some constraints on
  types.

### 0002_due_date_constraints.sql

- Constraints of implimentation of due dates. NB: Bug that raises error in
  database when past data dates are < current date.
