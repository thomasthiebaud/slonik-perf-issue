const { createPool, sql } = require("slonik");
const { Pool } = require("pg");

const POSTGRES_USER = process.env.POSTGRES_USER || "test_user";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "test_password";
const POSTGRES_DB = process.env.POSTGRES_DB || "test_database";
const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || "5432");
const POSTGRES_HOST = process.env.POSTGRES_HOST || "localhost";
const NCC_PREFIX = process.env.USE_NCC ? "ncc-" : "";

function toConnectionString({
  user = POSTGRES_USER,
  password = POSTGRES_PASSWORD,
  host = POSTGRES_HOST,
  port = POSTGRES_PORT,
  database = POSTGRES_DB,
}) {
  return `postgres://${user}:${password}@${host}:${port}/${database}`;
}

async function run() {
  const dbConfig = {
    database: POSTGRES_DB,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  };
  const pgPool = new Pool(dbConfig);
  const slonikPool = createPool(toConnectionString(dbConfig));

  await slonikPool.query(sql`
    CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name varchar(200) NOT NULL,
        photo_url text
    );
  `);

  console.time(`${NCC_PREFIX}pg - query`);
  await pgPool.query(
    "INSERT INTO profile(name, photo_url) VALUES($1, $2) RETURNING id;",
    ["pgPool", null]
  );
  console.timeEnd(`${NCC_PREFIX}pg - query`);
  console.time(`${NCC_PREFIX}pg - end`);
  await pgPool.end();
  console.timeEnd(`${NCC_PREFIX}pg - end`);

  console.time(`${NCC_PREFIX}slonik - query`);
  await slonikPool.query(
    sql`INSERT INTO profile(name, photo_url) VALUES('slonikPool', ${null}) RETURNING id;`
  );
  console.timeEnd(`${NCC_PREFIX}slonik - query`);
  console.time(`${NCC_PREFIX}slonik - end`);
  await slonikPool.end();
  console.timeEnd(`${NCC_PREFIX}slonik - end`);
}

run();
