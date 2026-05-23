import fs from 'fs';
import path from 'path';

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = getFiles('src');

let totalChanges = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;

  // rgba gold replacements -> blue (59,130,246)
  content = content.replace(/201\s*,\s*168\s*,\s*76/g, '59, 130, 246');
  content = content.replace(/255\s*,\s*209\s*,\s*102/g, '59, 130, 246');
  
  // Font replacements
  content = content.replace(/--font-syne/g, '--font-inter');
  content = content.replace(/--font-dm-sans/g, '--font-inter');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    totalChanges++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Updated ${totalChanges} files.`);
