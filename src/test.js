const dotenv = require('dotenv');
dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;
const ydb_table_name = process.env.YDB_TABLE_NAME;


const ydb_api = require('ydb_api');

const { on_request } = require('./index.js');


const test_name = 'Mr. Laggy';


async function get_high_score() {
  const body = {
    httpMethod: 'GET',
  };
  const high_score = await on_request(body);
  console.log(high_score);
  for (let i = 0; i < high_score.length; i++) {
    console.log(`${high_score[i].name}, ${high_score[i].score}, ${high_score[i].date}`);
  }
}

async function submit_score(name, score) {
  const body = {
    httpMethod: 'POST',
    body: JSON.stringify({ name: name, score: score }),
  };
  return await on_request(body);
}


async function test() {

  console.log('-=-=-=-=-=-=- GET HIGH SCORE BEFORE -=-=-=-=-=--');
  await get_high_score();

  console.log('-=-=-=-=-=-=- SUBMIT SCORE -=-=-=-=-=--');
  await submit_score(test_name, 24);

  console.log('-=-=-=-=-=-=- GET HIGH SCORE AFTER -=-=-=-=-=--');
  await get_high_score();

  console.log('-=-=-=-=-=-=- CLEANUP -=-=-=-=-=--');

  const ydb = new ydb_api(ydb_endpoint, ydb_database_path);
  const query = `DELETE FROM \`${ydb_table_name}\` WHERE name = '${test_name}'`;
  await ydb.query(query)
  console.log('OK');

  console.log('-=-=-=-=-=-=- GET HIGH SCORE AFTER CLEANUP -=-=-=-=-=--');
  await get_high_score();

  process.exit(0);
}


test();
