const dotenv = require('dotenv');

const ydb_api = require('ydb_api');

const { get_high_score, submit_score } = require('./index.js');


const test_name = 'Mr. Laggy';

dotenv.config();
const ydb_endpoint = process.env.YDB_ENDPOINT;
const ydb_database_path = process.env.YDB_DATABASE_PATH;
const ydb_table_name = process.env.YDB_TABLE_NAME;


async function test() {

  console.log('-=-=-=-=-=-=- GET HIGH SCORE BEFORE -=-=-=-=-=--');

  const high_score = await get_high_score();
  console.log(high_score);
  for (let i = 0; i < high_score.length; i++) {
    console.log(`${high_score[i].name}, ${high_score[i].score}, ${high_score[i].date}`);
  }

  console.log('-=-=-=-=-=-=- SUBMIT SCORE -=-=-=-=-=--');

  console.log(await submit_score(test_name, 24));

  console.log('-=-=-=-=-=-=- GET HIGH SCORE AFTER -=-=-=-=-=--');

  const high_score_after = await get_high_score();
  console.log(high_score_after);
  for (let i = 0; i < high_score_after.length; i++) {
    console.log(`${high_score_after[i].name}, ${high_score_after[i].score}, ${high_score_after[i].date}`);
  }

  console.log('-=-=-=-=-=-=- CLEANUP -=-=-=-=-=--');

  const ydb = new ydb_api(ydb_endpoint, ydb_database_path);
  const query = `DELETE FROM \`${ydb_table_name}\` WHERE name = '${test_name}'`;
  await ydb.query(query)
  console.log('OK');

  console.log('-=-=-=-=-=-=- GET HIGH SCORE AFTER CLEANUP -=-=-=-=-=--');

  const high_score_after_cleanup = await get_high_score();
  console.log(high_score_after_cleanup);
  for (let i = 0; i < high_score_after_cleanup.length; i++) {
    console.log(`${high_score_after_cleanup[i].name}, ${high_score_after_cleanup[i].score}, ${high_score_after_cleanup[i].date}`);
  }

  process.exit(0);
}


test();
