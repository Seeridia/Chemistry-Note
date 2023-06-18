const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getChangedFiles() {
  const { stdout } = await exec('git log --name-only --pretty=format: --max-count=3');
  const files = stdout.split('\n');
  const uniqueFiles = [...new Set(files)].filter(file => file.trim() !== '');
  return uniqueFiles;
}

function updateReadme(files) {
  const readmeContent = fs.readFileSync('./README.md', 'utf8');
  const startIndex = readmeContent.indexOf('<!-- readme: recent-changes -start -->') + '<!-- readme: recent-changes -start -->'.length;
  const endIndex = readmeContent.indexOf('<!-- readme: recent-changes -end -->');

  let newContent = readmeContent.substring(0, startIndex) + '\n';
  files.forEach((file, index) => {
    newContent += `${index+1}. ${file}\n`;
  });
  newContent += readmeContent.substring(endIndex);

  fs.writeFileSync('./README.md', newContent);
}

getChangedFiles()
  .then(files => updateReadme(files))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
