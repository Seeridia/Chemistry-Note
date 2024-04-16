import { readFileSync, writeFileSync, readdirSync, existsSync, removeSync, mkdirSync, copySync, copyFile, copyFileSync, moveSync } from 'fs-extra'
import { execSync } from 'child_process'
import * as path from 'path'
const content = ["01 原子结构与元素性质", "02 微粒间作用力与物质性质", "03 分子空间结构与物质性质", "04 有机化学基础", "05 化学物质基本概念", "06 元素及其化合物", "07 化学实验"]
// 删除tmp目录
if (existsSync(path.join(process.execPath,`..`, `./tmp`))) {
    removeSync(path.join(process.execPath,`..`, `./tmp`));
}
mkdirSync(path.join(process.execPath,`..`, `./tmp`));
for (let dirname of content) {
    let files = readdirSync(path.join(process.execPath,`..`, `../${dirname}`));
    mkdirSync(path.join(process.execPath,`..`, `./tmp/${dirname}`))
    for (let filename of files) {
        if (!filename.endsWith(`.md`)) {
            continue;
        }
        let context = readFileSync(path.join(process.execPath,`..`, `../${dirname}/${filename}`), "utf-8")
        context = context + `
<script>
window.MathJax = {
tex: {
  inlineMath: [['$', '$'], ['\\(', '\\)']]
},
svg: {
  fontCache: 'global'
}
};
</script>
<script async src="${path.join(process.execPath,`..`, `../mathjax/es5/tex-mml-chtml.js`)}"></script>`
        context = context.replace(/\\/g,'\\\\');
        let tmpfilepath = path.join(process.execPath,`..`, `./tmp/${dirname}/${filename}`);
        let tmppath = path.join(process.execPath,`..`, `./tmp/${dirname}/`)
        writeFileSync(tmpfilepath, context, "utf-8");
        execSync(`mdout "${tmpfilepath}" -o "${tmppath}${filename.split(`.md`)[0]}.pdf"`);
        removeSync(tmpfilepath);
    }
}
moveSync(path.join(process.execPath,`..`, `./tmp`),path.join(process.execPath,`..`, `../output`),{ overwrite: true });

