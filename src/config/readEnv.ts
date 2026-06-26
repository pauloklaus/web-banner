interface AppEnv {
  appName: string
  author: string
  githubRepoUrl: string
  siteUrl: string
}

let cached: AppEnv | undefined

export function readEnv(): AppEnv {
  if (!cached) {
    cached = {
      appName: import.meta.env.VITE_APP_NAME || 'WebBanner',
      author: import.meta.env.VITE_AUTHOR || '',
      githubRepoUrl: import.meta.env.VITE_GITHUB_REPO_URL || '',
      siteUrl: (
        import.meta.env.VITE_SITE_URL || 'https://banner.pauloklaus.com.br'
      ).replace(/\/$/, ''),
    }
  }

  return cached
}
