#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

type BumpKind = 'patch' | 'minor' | 'major'

interface ParsedArgs {
  commit: string
  branch: string
  baseRef: string
  check: boolean
  shouldTag: boolean
}

function parseArgs(argv: string[]): ParsedArgs {
  let commit = ''
  let branch = ''
  let baseRef = ''
  let check = false
  let shouldTag = false
  for (let index = 2; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--commit' && argv[index + 1]) {
      commit = argv[++index] ?? ''
    } else if (arg === '--branch' && argv[index + 1]) {
      branch = argv[++index] ?? ''
    } else if (arg === '--base-ref' && argv[index + 1]) {
      baseRef = argv[++index] ?? ''
    } else if (arg === '--check') {
      check = true
    } else if (arg === '--should-tag') {
      shouldTag = true
    }
  }
  return { commit, branch, baseRef, check, shouldTag }
}

function resolveBumpFromCommit(commit: string): BumpKind | null {
  const line = commit.trim().split('\n')[0] ?? ''
  if (/^breaking(?::|\([^)]+\):)/i.test(line)) return 'major'
  if (/^(?:feat|feature|fix)(?:\([^)]+\))!:/i.test(line)) return 'major'
  if (/^fix(?::|\([^)]+\):)/i.test(line)) return 'patch'
  if (/^(?:feat|feature)(?::|\([^)]+\):)/i.test(line)) return 'minor'
  return null
}

function resolveBumpFromBranch(branch: string): BumpKind | null {
  if (/^breaking(?:\/|$)/i.test(branch)) return 'major'
  if (/^fix(?:\/|$)/i.test(branch)) return 'patch'
  if (/^(?:feat|feature)(?:\/|$)/i.test(branch)) return 'minor'
  return null
}

function resolveBump(commit: string, branch: string): BumpKind | null {
  return resolveBumpFromCommit(commit) ?? resolveBumpFromBranch(branch)
}

function readVersionAtRef(ref: string): string {
  const raw = execSync(`git show ${ref}:package.json`, { cwd: root, encoding: 'utf8' })
  return (JSON.parse(raw) as { version: string }).version
}

function readCurrentVersion(): string {
  const raw = readFileSync(join(root, 'package.json'), 'utf8')
  return (JSON.parse(raw) as { version: string }).version
}

function applyBump(version: string, kind: BumpKind): string {
  const segments = version.split('.').map((part) => Number.parseInt(part, 10))
  const major = segments[0] ?? 0
  const minor = segments[1] ?? 0
  const patch = segments[2] ?? 0
  if (kind === 'major') return `${major + 1}.0.0`
  if (kind === 'minor') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}

function main(): void {
  const { commit, branch, baseRef, check, shouldTag } = parseArgs(process.argv)

  if (shouldTag) {
    process.stdout.write(resolveBump(commit, branch) ? 'yes' : 'no')
    return
  }

  if (!check) {
    console.error('Use --check or --should-tag.')
    process.exit(2)
  }

  const bumpKind = resolveBump(commit, branch)
  if (!bumpKind) {
    return
  }

  if (!baseRef) {
    console.error('--base-ref is required with --check.')
    process.exit(2)
  }

  const expectedVersion = applyBump(readVersionAtRef(baseRef), bumpKind)
  const currentVersion = readCurrentVersion()

  if (currentVersion === expectedVersion) {
    return
  }

  console.error(
    `Release PR requires version ${expectedVersion} but package.json has ${currentVersion}.`,
  )
  console.error(`Run: npm version ${bumpKind} --no-git-tag-version`)
  process.exit(1)
}

main()
