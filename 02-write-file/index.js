const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

console.log('Hello');

(async function createFileAndAddText() {
  await writeFile('text-02-task.txt', '', (error) => {
    if (error) throw error;
  });
  console.log('File created');

  console.log('Waiting for input...\n');

  process.stdin.on('data', (input) => {
    (async () => {
      if (input.toString().trim() === 'exit') {
        process.exit();
      } else {
        await appendFile('text-02-task.txt', input + '\n');
        console.log('\nText added to file');
        console.log('Waiting for input...\n');
      }
    })();
  });

  process.on('SIGINT', () => {
    process.exit();
  });

  process.on('exit', () => {
    console.log('\nEnd.\n');
  });
})();
