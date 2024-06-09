import pkg, { remove } from 'fs-extra';
const { readFileSync, writeFileSync, readdirSync, existsSync, removeSync, mkdirSync, copySync, moveSync } = pkg; import { execSync } from 'child_process'
import path from 'path'
const content = ["01 原子结构与元素性质", "02 微粒间作用力与物质性质", "03 分子空间结构与物质性质", "04 有机化学基础", "05 化学物质基本概念", "06 元素及其化合物", "07 化学实验"]
console.log(__dirname);
// 删除tmp目录
if (existsSync(path.join(__dirname, `./tmp`))) {
    removeSync(path.join(__dirname, `./tmp`));
}
mkdirSync(path.join(__dirname, `./tmp`));
for (let dirname of content) {
    let files = readdirSync(path.join(__dirname, `../${dirname}`));
    mkdirSync(path.join(__dirname, `./tmp/${dirname}`))
    if (existsSync(path.join(__dirname, `../${dirname}/images`)))
        copySync(path.join(__dirname, `../${dirname}/images`), path.join(__dirname, `./tmp/${dirname}/images/`))
    for (let filename of files) {
        if (!filename.endsWith(`.md`)) {
            continue;
        }
        let context = readFileSync(path.join(__dirname, `../${dirname}/${filename}`), "utf-8")
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
<script async src="${path.join(__dirname, `./mathjax/es5/tex-mml-chtml.js`)}"></script>`
        context = context.replace(/\\/g, '\\\\');
        let tmpfilepath = path.join(__dirname, `./tmp/${dirname}/${filename}`);
        let tmppath = path.join(__dirname, `./tmp/${dirname}/`)
        writeFileSync(tmpfilepath, context, "utf-8");
        execSync(`mdout "${tmpfilepath}" -o "${tmppath}${filename.split(`.md`)[0]}.pdf"`);
        removeSync(tmpfilepath);
    }
}

copySync(path.join(__dirname, `./tmp`), path.join(__dirname, `./output`), { overwrite: true });
console.log(`Waiting For finish...`);
setTimeout(()=>
{
    remove(path.join(__dirname, `./tmp`));
    setTimeout(()=>{
        console.log(`文件导出结束，渲染的 pdf 文件在 ${path.join(__dirname,`./output`)} 内`);
    },1000);
},1000);

