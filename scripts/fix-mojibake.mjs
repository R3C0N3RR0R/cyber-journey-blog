import fs from "fs"
import path from "path"

const MARKER_REGEX = /Ã|â€|â€�|â€œ|â€™|â€˜|â€“|â€”|â€¦|â”|ðŸ/

const TARGETED_REPLACEMENTS = [
  ["â”Œ", "┌"],
  ["â””", "└"],
  ["â”‚", "│"],
  ["â”€", "─"],
  ["â”œ", "├"],
  ["â”¤", "┤"],
  ["â•”", "╔"],
  ["â•", "═"],
  ["â•£", "╣"],
  ["â•š", "╚"],
  ["ã‰¿", "㉿"],
  ["âœ…", "✅"],
  ["âœ”", "✔"],
  ["âœ—", "✗"],
  ["ðŸ”§", "🔧"],
  ["ðŸ’¥", "💥"],
  ["ðŸ’»", "💻"],
  ["ðŸ”", "🔍"],
  ["Ã©", "é"],
  ["Ã¨", "è"],
  ["Ã ", "à"],
  ["Ã¢", "â"],
  ["Ãª", "ê"],
  ["Ã«", "ë"],
  ["Ã®", "î"],
  ["Ã¯", "ï"],
  ["Ã´", "ô"],
  ["Ã»", "û"],
  ["Ã§", "ç"],
  ["Ã‰", "É"],
  ["Ãˆ", "È"],
  ["Ã€", "À"],
  ["Ã‚", "Â"],
  ["ÃŠ", "Ê"],
  ["Ã‹", "Ë"],
  ["ÃŽ", "Î"],
  ["Ã", "Ï"],
  ["Ã”", "Ô"],
  ["Ã›", "Û"],
  ["Ã‡", "Ç"],
  ["???(nnbb?kali)-[", "┌──(nnbb㉿kali)-["],
  ["??$ ", "└──$ "],
  ["=== ?? Vulnerability Check", "=== 🔍 Vulnerability Check"],
  ["== ?? Running Exploit", "== 💥 Running Exploit"],
  ["=== ?? Interactive Root Shell", "=== 💻 Interactive Root Shell"],
]

function hasMarkers(text) {
  return MARKER_REGEX.test(text)
}

function stripBom(text) {
  return text && text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

function applyTargeted(content) {
  let updated = content
  for (const [bad, good] of TARGETED_REPLACEMENTS) {
    if (updated.includes(bad)) updated = updated.split(bad).join(good)
  }
  return updated
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  let content = stripBom(raw)
  if (!hasMarkers(content)) return false

  // 1) ciblé
  const targeted = applyTargeted(content)
  if (targeted !== raw) {
    fs.writeFileSync(filePath, targeted, "utf8")
    console.log(`Fixed (targeted): ${filePath}`)
    return true
  }

  // 2) fallback latin1->utf8
  const roundTripped = Buffer.from(content, "latin1").toString("utf8")
  if (roundTripped !== raw && !/\uFFFD/.test(roundTripped)) {
    fs.writeFileSync(filePath, roundTripped, "utf8")
    console.log(`Fixed (latin1->utf8): ${filePath}`)
    return true
  }

  return false
}

function walk(dir, exts, changed = { count: 0 }) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      if (/(^|\\|\/)node_modules(\\|\/|$)|(^|\\|\/)\.next(\\|\/|$)|(^|\\|\/)\.git(\\|\/|$)|(^|\\|\/)\.contentlayer(\\|\/|$)/.test(full)) continue
      walk(full, exts, changed)
    } else {
      if (exts.some((ext) => full.toLowerCase().endsWith(ext))) {
        if (processFile(full)) changed.count += 1
      }
    }
  }
  return changed.count
}

function main() {
  const targetDirs = [path.join(process.cwd(), "data")]
  const extensions = [".mdx"]

  let total = 0
  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) total += walk(dir, extensions)
  }

  console.log(`Fixed mojibake in ${total} file(s).`)
}

main()


