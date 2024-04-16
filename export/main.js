"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var child_process_1 = require("child_process");
var path = require("path");
var content = ["01 原子结构与元素性质", "02 微粒间作用力与物质性质", "03 分子空间结构与物质性质", "04 有机化学基础", "05 化学物质基本概念", "06 元素及其化合物", "07 化学实验"];
// 删除tmp目录
if ((0, fs_extra_1.existsSync)(path.join(process.execPath, "..", "./tmp"))) {
    (0, fs_extra_1.removeSync)(path.join(process.execPath, "..", "./tmp"));
}
(0, fs_extra_1.mkdirSync)(path.join(process.execPath, "..", "./tmp"));
for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var dirname = content_1[_i];
    var files = (0, fs_extra_1.readdirSync)(path.join(process.execPath, "..", "../".concat(dirname)));
    (0, fs_extra_1.mkdirSync)(path.join(process.execPath, "..", "./tmp/".concat(dirname)));
    if ((0, fs_extra_1.existsSync)(path.join(process.execPath, "..", "../".concat(dirname, "/images"))))
        (0, fs_extra_1.copySync)(path.join(process.execPath, "..", "../".concat(dirname, "/images")), path.join(process.execPath, "..", "./tmp/".concat(dirname, "/images/")));
    for (var _a = 0, files_1 = files; _a < files_1.length; _a++) {
        var filename = files_1[_a];
        if (!filename.endsWith(".md")) {
            continue;
        }
        var context = (0, fs_extra_1.readFileSync)(path.join(process.execPath, "..", "../".concat(dirname, "/").concat(filename)), "utf-8");
        context = context + "\n<script>\nwindow.MathJax = {\ntex: {\n  inlineMath: [['$', '$'], ['\\(', '\\)']]\n},\nsvg: {\n  fontCache: 'global'\n}\n};\n</script>\n<script async src=\"".concat(path.join(process.execPath, "..", "../mathjax/es5/tex-mml-chtml.js"), "\"></script>");
        context = context.replace(/\\/g, '\\\\');
        var tmpfilepath = path.join(process.execPath, "..", "./tmp/".concat(dirname, "/").concat(filename));
        var tmppath = path.join(process.execPath, "..", "./tmp/".concat(dirname, "/"));
        (0, fs_extra_1.writeFileSync)(tmpfilepath, context, "utf-8");
        (0, child_process_1.execSync)("mdout \"".concat(tmpfilepath, "\" -o \"").concat(tmppath).concat(filename.split(".md")[0], ".pdf\""));
        (0, fs_extra_1.removeSync)(tmpfilepath);
    }
}
(0, fs_extra_1.moveSync)(path.join(process.execPath, "..", "./tmp"), path.join(process.execPath, "..", "../output"), { overwrite: true });
