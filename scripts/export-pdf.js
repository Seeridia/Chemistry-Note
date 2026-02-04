import { chromium } from 'playwright'
import fg from 'fast-glob'
import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../.vitepress/dist')

const args = process.argv.slice(2)
const listIndex = args.indexOf('--list')
const outIndex = args.indexOf('--out-dir')
const listPath = listIndex >= 0 ? args[listIndex + 1] : null
const outDirArg = outIndex >= 0 ? args[outIndex + 1] : null
if (listIndex >= 0 && !listPath) {
    throw new Error('Missing value for --list')
}
if (outIndex >= 0 && !outDirArg) {
    throw new Error('Missing value for --out-dir')
}
const outDir = outDirArg
    ? path.resolve(process.cwd(), outDirArg)
    : path.resolve(__dirname, '../pdf')

fs.mkdirSync(outDir, { recursive: true })

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
}

// 用本地 HTTP 服务替代 file:// 访问，确保 CSS/JS/图片/字体等资源按正常 URL 规则加载
// 同时避免浏览器对 file:// 的安全限制导致资源无法读取
const server = http.createServer((req, res) => {
    if (!req.url) {
        res.writeHead(400)
        res.end('Bad Request')
        return
    }

    // 去掉查询参数后再做 decode，防止路径中包含中文或空格时无法访问
    const decodedPath = decodeURIComponent(req.url.split('?')[0])
    const safePath = decodedPath.replace(/^\/+/, '')
    const filePath = path.resolve(distDir, safePath || 'index.html')

    if (!filePath.startsWith(distDir)) {
        res.writeHead(403)
        res.end('Forbidden')
        return
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404)
            res.end('Not Found')
            return
        }

        const ext = path.extname(filePath).toLowerCase()
        const contentType = mimeTypes[ext] || 'application/octet-stream'
        res.writeHead(200, { 'Content-Type': contentType })
        fs.createReadStream(filePath).pipe(res)
    })
})

let files = []
if (listPath) {
    const raw = fs.readFileSync(listPath, 'utf8')
    files = raw
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && line !== '404.html')
    files = Array.from(new Set(files))
    files = files.filter((file) => fs.existsSync(path.join(distDir, file)))
} else {
    files = await fg('**/*.html', {
        cwd: distDir,
        ignore: ['404.html']
    })
}

if (files.length === 0) {
    console.log('No pages to export.')
    process.exit(0)
}

const serverPort = await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port))
})

const browser = await chromium.launch()
const page = await browser.newPage()
await page.addStyleTag({
    content:
        'html, body { font-family: "Noto Sans CJK SC","Noto Sans SC","Source Han Sans SC","Microsoft YaHei","PingFang SC",sans-serif !important; }'
})

for (const file of files) {
    const inputPath = path.join(distDir, file)
    const outputPath = path.join(outDir, file.replace(/\.html$/, '.pdf'))

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })

    const urlPath = encodeURI(file.replace(/\\/g, '/'))
    const fileUrl = `http://127.0.0.1:${serverPort}/${urlPath}`

    console.log('Exporting:', file)

    await page.goto(fileUrl, { waitUntil: 'networkidle' })
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null))

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '10mm',
            bottom: '10mm',
            left: '10mm',
            right: '10mm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
            <style>
                .pdf-footer {
                    box-sizing: border-box;
                    width: 100%;
                    padding-right: 12mm;
                    display: flex;
                    justify-content: flex-end;
                    font-size: 10pt;
                    font-family: "Noto Sans CJK SC","Noto Sans SC","Source Han Sans SC","Microsoft YaHei","PingFang SC",sans-serif;
                }
            </style>
            <div class="pdf-footer">
                <span class="pageNumber"></span> / <span class="totalPages"></span>
            </div>
        `
    })
}

await browser.close()
await new Promise((resolve) => server.close(resolve))
