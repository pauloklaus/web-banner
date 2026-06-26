interface AppEnv {
  appName: string
  githubRepoUrl: string
  siteUrl: string
}

let cached: AppEnv | undefined

export function readEnv(): AppEnv {
  if (!cached) {
    cached = {
      appName: import.meta.env.VITE_APP_NAME || 'WebBanner',
      githubRepoUrl: import.meta.env.VITE_GITHUB_REPO_URL || '',
      siteUrl: (
        import.meta.env.VITE_SITE_URL || 'https://banner.dataplain.com.br'
      ).replace(/\/$/, ''),
    }
  }

  return cached
}
