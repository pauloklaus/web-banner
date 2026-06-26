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
  expectedOnly: boolean
}

function parseArgs(argv: string[]): ParsedArgs {
  let commit = ''
  let branch = ''
  let baseRef = ''
  let expectedOnly = false
  for (let index = 2; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--commit' && argv[index + 1]) {
      commit = argv[++index] ?? ''
    } else if (arg === '--branch' && argv[index + 1]) {
      branch = argv[++index] ?? ''
    } else if (arg === '--base-ref' && argv[index + 1]) {
      baseRef = argv[++index] ?? ''
    } else if (arg === '--expected-only') {
      expectedOnly = true
    }
  }
  return { commit, branch, baseRef, expectedOnly }
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

function restoreFromRef(ref: string): void {
  execSync(`git checkout ${ref} -- package.json package-lock.json`, { cwd: root })
}

function main(): void {
  const { commit, branch, baseRef, expectedOnly } = parseArgs(process.argv)
  const bumpKind = resolveBump(commit, branch)

  if (!bumpKind) {
    console.error(
      'No release prefix found in commit or branch; version unchanged.',
    )
    return
  }

  const baseVersion = baseRef ? readVersionAtRef(baseRef) : readCurrentVersion()
  const nextVersion = applyBump(baseVersion, bumpKind)

  if (expectedOnly) {
    process.stdout.write(nextVersion)
    return
  }

  if (baseRef) {
    restoreFromRef(baseRef)
  }

  const taggedVersion = execSync(
    `npm version ${bumpKind} --no-git-tag-version`,
    {
      cwd: root,
      encoding: 'utf8',
    },
  ).trim()

  process.stdout.write(taggedVersion.replace(/^v/, ''))
}

main()
