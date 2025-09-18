const branch = process.env.GITHUB_REF?.replace('refs/heads/', '') || ''

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [{ name: 'main' }, { name: 'next', prerelease: true }],
  plugins: [
    branch === 'next'
      ? [
          '@semantic-release/commit-analyzer',
          {
            preset: 'conventionalcommits',
            releaseRules: [{ type: '*', release: 'patch' }],
          },
        ]
      : '@semantic-release/commit-analyzer',
    branch === 'next'
      ? undefined
      : [
          '@semantic-release/git',
          {
            assets: ['package.json', 'CHANGELOG.md'],
            // biome-ignore lint/suspicious/noTemplateCurlyInString: <ok>
            message: 'chore(release): ${nextRelease.version} --skip-ci',
          },
        ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
  ].filter(Boolean),
}
