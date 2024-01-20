const fs = require('fs').promises;
const path = require('path');

(async function writeFilesInfo() {
  const pathToFolder = path.join(__dirname, 'secret-folder');
  const files = await fs.readdir(pathToFolder, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const fileInfo = await fs.stat(path.join(pathToFolder, file.name));
      const fileSize = fileInfo.size;
      const fileName = path.parse(file.name).name;
      const fileExt = path.parse(file.name).ext.slice(1);
      console.log(`${fileName} - ${fileExt} - ${fileSize}b`);
    }
  }
})();
