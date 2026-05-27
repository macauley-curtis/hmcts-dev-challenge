import { config } from "dotenv";
import path from "node:path";

// Ensure all node tests (backend) use the test database only.
process.env.NODE_ENV = "test";

config();

if (!process.env.TEST_DATABASE_URL) {
  config({ path: path.resolve(__dirname, "../backend/.env") });
}

if (!process.env.TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required for node test runs.");
}

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
