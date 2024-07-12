const dotenv = require('dotenv');

const ydb_api = require('ydb_api');


dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;
const ydb_table_name = process.env.YDB_TABLE_NAME;

const ydb = new ydb_api(ydb_endpoint, ydb_database_path);


async function get_max_id() {
  const query = `SELECT MAX(id) as max FROM \`${ydb_table_name}\``;
  const response = await ydb.query(query);

  return response[0]['max'];
}


async function get_high_score() {
  const query = `SELECT name, score, date FROM \`${ydb_table_name}\` ORDER BY score DESC LIMIT 10`;
  const response = await ydb.query(query);

  return response;
}

async function submit_score(name, score) {
  const next_id = await get_max_id() + 1;

  const query = `INSERT INTO \`${ydb_table_name}\` (id, name, score, date) VALUES (${next_id}, '${name}', ${score}, CurrentUtcDate())`;
  await ydb.query(query);

  return 'OK';
}


module.exports = { get_high_score, submit_score };
