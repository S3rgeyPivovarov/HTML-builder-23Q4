const fs = require('fs').promises;
const path = require('path');

async function copyDir(sourceDir, destinationDir) {
  try {
    await fs.rm(destinationDir, { force: true, recursive: true });
  } catch (err) {
    console.error(`Failed to remove directory ${destinationDir}: ${err}`);
  }

  const directoryEntries = await fs.readdir(sourceDir, { withFileTypes: true });
  await fs.mkdir(destinationDir, { recursive: true });

  try {
    await Promise.all(
      directoryEntries.map(async (item) => {
        const existItem = path.join(sourceDir, item.name);
        const newItem = path.join(destinationDir, item.name);
        if (item.isFile()) {
          await fs.copyFile(existItem, newItem);
        } else if (item.isDirectory()) {
          await copyDir(existItem, newItem);
        }
      }),
    );
    console.log(`\n${sourceDir} copied to\n${destinationDir} successfully`);
  } catch (error) {
    console.error(`Failed to copy directory ${sourceDir}: ${error}`);
  }
}

const sourceDirectory = path.join(__dirname, 'files');
const destinationDirectory = path.join(__dirname, 'file-copy');

copyDir(sourceDirectory, destinationDirectory);
