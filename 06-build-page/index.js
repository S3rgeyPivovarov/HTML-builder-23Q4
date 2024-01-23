const fs = require('fs').promises;
const path = require('path');

async function createProject(directories, targets) {
  try {
    await fs.mkdir(directories.project, { recursive: true });

    let htmlContent = await fs.readFile(directories.template, 'utf-8');
    const componentFiles = (
      await fs.readdir(directories.components, { withFileTypes: true })
    ).filter((file) => file.isFile() && path.extname(file.name) === '.html');

    const componentContents = await Promise.all(
      componentFiles.map((file) =>
        fs.readFile(path.join(directories.components, file.name), 'utf-8'),
      ),
    );

    for (let i = 0; i < componentFiles.length; i++) {
      const placeholder = `{{${path.parse(componentFiles[i].name).name}}}`;
      htmlContent = htmlContent.replaceAll(placeholder, componentContents[i]);
    }

    await fs.writeFile(targets.html, htmlContent);

    const styleFiles = (
      await fs.readdir(directories.styles, { withFileTypes: true })
    ).filter((file) => file.isFile() && path.extname(file.name) === '.css');

    const styleContents = await Promise.all(
      styleFiles.map((file) =>
        fs.readFile(path.join(directories.styles, file.name), 'utf8'),
      ),
    );

    for (const styleContent of styleContents) {
      await fs.appendFile(targets.css, styleContent);
    }

    await copyDir(directories.assets, targets.assets);
  } catch (err) {
    throw new Error(err);
  }
}

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
  } catch (error) {
    console.error(`Failed to copy directory ${sourceDir}: ${error}`);
  }
}
const directories = {
  project: path.join(__dirname, 'project-dist'),
  components: path.join(__dirname, 'components'),
  styles: path.join(__dirname, 'styles'),
  template: path.join(__dirname, 'template.html'),
  assets: path.join(__dirname, 'assets'),
};

const targets = {
  assets: path.join(directories.project, 'assets'),
  html: path.join(__dirname, 'project-dist', 'index.html'),
  css: path.join(__dirname, 'project-dist', 'style.css'),
};

createProject(directories, targets);
