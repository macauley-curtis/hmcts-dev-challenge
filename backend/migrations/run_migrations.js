require("dotenv").config();

const { execFileSync } = require("child_process");
const { readdirSync } = require("fs");
const path = require("path");

const migrationsDir = __dirname;

// 2 databases only
const databases = [process.env.DATABASE_URL, process.env.TEST_DATABASE_URL];

if (!databases[0] || !databases[1]) {
  throw new Error("Both DATABASE_URL and TEST_DATABASE_URL are required");
}

function runSqlFile(dbUrl, filePath) {
  execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", filePath], {
    stdio: "inherit",
  });
}

function getMigrationFiles() {
  return readdirSync(migrationsDir)
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort();
}

function runMigrations(dbUrl, label) {
  console.log(`\n=== Running migrations for ${label} ===`);

  const files = getMigrationFiles();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`→ ${file}`);
    runSqlFile(dbUrl, filePath);
  }

  console.log(`=== Done: ${label} ===`);
}

function main() {
  const [devDb, testDb] = databases;

  runMigrations(devDb, "DEV DB");
  runMigrations(testDb, "TEST DB");

  console.log("\nAll migrations complete.");
}

main();
