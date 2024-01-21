const fs = require('fs').promises;
const path = require('path');

console.log('Hello');

(async function createFileAndAddText() {
  const filePath = path.join(__dirname, 'text-02-task.txt');
  try {
    await fs.writeFile(filePath, '');
    console.log('File created');
  } catch (error) {
    console.error(error);
  }

  console.log('Waiting for input...\n');

  process.stdin.on('data', (input) => {
    (async () => {
      if (input.toString().trim() === 'exit') {
        process.exit();
      } else {
        try {
          await fs.appendFile(filePath, input + '\n');
          console.log('\nText added to file');
          console.log('Waiting for input...\n');
        } catch (error) {
          console.error(error);
        }
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
