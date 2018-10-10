const process = require('process');
const fs = require('fs');
const program = require('commander');
const axios = require('axios');

program
  .version('1.0')
  .option('-f, --file <value>', 'input csv file')
  .option('-u, --url <value>', 'server endpoint')
  .option('-a, --auth', 'authentication token')
  .option('-n, --dry-run', 'perform a dry run')
  .parse(process.argv);

const postParams = fs
      .readFileSync(program.file || './input.csv', 'utf8')
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line
           .split(',')
           .reduce((acc, cur, index) => {
             switch(index) {
             case 0: acc.name = cur; break;
             case 1: acc.param1 = cur; break;
             case 2: acc.param2 = cur; break;
             }
             return acc;
           }, {
             authentication: program.auth || 'no-token'
           })
          );

if (!program.dryRun) {
  Promise.all(
    postParams
      .map(param => axios.post(program.url, param))
  ).then(responses => {
    responses.forEach(res => {
      console.log(res);
    });
  });
}
else {
  console.log('performing a dry run');
  postParams.forEach(param => {
    console.log(param);
  });
}


