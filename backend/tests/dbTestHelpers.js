const pool = require("../src/test_db");

async function resetTasksTable() {
  await pool.query("TRUNCATE TABLE tasks RESTART IDENTITY CASCADE");
}

async function closePool() {
  await pool.end();
}

module.exports = {
  pool,
  resetTasksTable,
  closePool,
};
