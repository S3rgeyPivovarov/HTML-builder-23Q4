const { error } = require('console');
const fs = require('fs');
const path = require('path');

async function mergeStyles(sourceDir, destinationDir, bundleFileName) {
  fs.readdir(sourceDir, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      if (path.extname(file) === '.css') {
        fs.createReadStream(path.join(sourceDir, file), 'utf8').pipe(
          fs.createWriteStream(
            path.join(__dirname, destinationDir, bundleFileName),
            { flags: 'a', encoding: 'utf8' },
          ),
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
