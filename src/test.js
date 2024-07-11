const { get_high_score, submit_score } = require('./index.js');


async function test() {
  await get_high_score();
  await submit_score();
}


test();
