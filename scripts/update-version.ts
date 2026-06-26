#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

type BumpKind = 'patch' | 'minor' | 'major'

function parseArgs(argv: string[]): { commit: string; branch: string } {
  let commit = ''
  let branch = ''
  for (let index = 2; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--commit' && argv[index + 1]) {
      commit = argv[++index] ?? ''
    } else if (arg === '--branch' && argv[index + 1]) {
      branch = argv[++index] ?? ''
    }
  }
  return { commit, branch }
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

function main(): void {
  const { commit, branch } = parseArgs(process.argv)
  const bumpKind = resolveBump(commit, branch)

  if (!bumpKind) {
    console.error(
      'No release prefix found in commit or branch; version unchanged.',
    )
    return
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
