const fs = require('fs');
const path = require('path');

async function mergeStyles(sourceDir, destinationDir, bundleFileName) {
  await fs.promises.rm(path.join(destinationDir, bundleFileName), {
    force: true,
    recursive: true,
  });
  fs.readdir(sourceDir, (error, files) => {
    if (error) {
      console.log('ss');
    }

    files.forEach((file) => {
      if (path.extname(file) === '.css') {
        fs.createReadStream(path.join(sourceDir, file), 'utf8').pipe(
          fs.createWriteStream(path.join(destinationDir, bundleFileName), {
            flags: 'a',
            encoding: 'utf8',
          }),
        );
      }
    });
  });
}

mergeStyles(
  path.join(__dirname, 'styles'),
  path.join(__dirname, 'project-dist'),
  'bundle.css',
);
