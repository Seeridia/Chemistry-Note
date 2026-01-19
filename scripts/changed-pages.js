import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const args = process.argv.slice(2)
const getArgValue = (flag) => {
    const index = args.indexOf(flag)
    if (index === -1) {
        return null
    }
    return args[index + 1] || null
}

const base = getArgValue('--base') || process.env.GIT_BASE
const head = getArgValue('--head') || process.env.GIT_HEAD || 'HEAD'
const outDirInput = getArgValue('--out-dir')
const outDir = outDirInput
    ? path.resolve(process.cwd(), outDirInput)
    : path.resolve(__dirname, '../.github/changed-pages')

const zeroSha = /^0+$/
const isGlobalChange = (filePath) => {
    if (!filePath) {
        return false
    }
    const normalized = filePath.replace(/\\/g, '/')
    return (
        normalized.startsWith('.vitepress/') ||
        normalized.startsWith('public/') ||
        normalized.startsWith('data/') ||
        normalized === 'package.json' ||
        normalized === 'package-lock.json' ||
        normalized === 'bun.lock'
    )
}

const mdToHtml = (filePath) => {
    if (!filePath) {
        return null
    }
    const normalized = filePath.replace(/\\/g, '/')
    if (!/\.md$/i.test(normalized)) {
        return null
    }
    const dir = path.posix.dirname(normalized)
    const baseName = path.posix.basename(normalized)
    const lower = baseName.toLowerCase()
    const targetName =
        lower === 'readme.md' || lower === 'index.md'
            ? 'index.html'
            : baseName.replace(/\.md$/i, '.html')
    return dir === '.' ? targetName : `${dir}/${targetName}`
}

const outputs = {
    forceAll: false,
    changed: new Set(),
    deleted: new Set()
}

if (!base || zeroSha.test(base)) {
    outputs.forceAll = true
} else {
    let diffOutput = ''
    try {
        diffOutput = execFileSync('git', ['diff', '--name-status', `${base}..${head}`], {
            encoding: 'utf8'
        }).trim()
    } catch (error) {
        outputs.forceAll = true
    }

    if (!outputs.forceAll && diffOutput) {
        const lines = diffOutput.split('\n').filter(Boolean)
        for (const line of lines) {
            const parts = line.split('\t')
            const status = parts[0]
            if (status.startsWith('R')) {
                const oldPath = parts[1]
                const newPath = parts[2]
                if (isGlobalChange(oldPath) || isGlobalChange(newPath)) {
                    outputs.forceAll = true
                }
                const deleted = mdToHtml(oldPath)
                const added = mdToHtml(newPath)
                if (deleted) {
                    outputs.deleted.add(deleted)
                }
                if (added) {
                    outputs.changed.add(added)
                }
                continue
            }

            const filePath = parts[1]
            if (isGlobalChange(filePath)) {
                outputs.forceAll = true
            }

            const htmlPath = mdToHtml(filePath)
            if (!htmlPath) {
                continue
            }
            if (status === 'D') {
                outputs.deleted.add(htmlPath)
            } else {
                outputs.changed.add(htmlPath)
            }
        }
    }
}

fs.mkdirSync(outDir, { recursive: true })

const changedList = outputs.forceAll ? [] : Array.from(outputs.changed).sort()
const deletedList = Array.from(outputs.deleted).sort()

fs.writeFileSync(path.join(outDir, 'export-all.txt'), outputs.forceAll ? 'true' : 'false')
fs.writeFileSync(path.join(outDir, 'changed-pages.txt'), changedList.join('\n'))
fs.writeFileSync(path.join(outDir, 'deleted-pages.txt'), deletedList.join('\n'))

console.log(
    JSON.stringify({
        forceAll: outputs.forceAll,
        changed: changedList.length,
        deleted: deletedList.length
    })
)
