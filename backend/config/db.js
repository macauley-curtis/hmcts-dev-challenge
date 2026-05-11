const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	console.error(
		'Missing DATABASE_URL environment variable. Set it or create a .env file in backend/ with DATABASE_URL.'
	);
	throw new Error('DATABASE_URL not set');
}

const pool = new Pool({ connectionString });

module.exports = pool;
