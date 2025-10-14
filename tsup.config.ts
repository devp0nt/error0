import { defineConfig, type Options } from 'tsup'
import { fixImportsPlugin } from 'esbuild-fix-imports-plugin'

const general = {
  entry: ['src', '!src/**/*.test.*'],
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: false,
  minify: false,
  target: 'es2022',
  external: ['bun:test'],
  treeshake: false,
  bundle: false,
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  esbuildPlugins: [fixImportsPlugin()],
  platform: 'node',
  tsconfig: './tsconfig.build.json',
} satisfies Options

export default defineConfig([
  {
    ...general,
    format: 'esm',
    outDir: 'dist/esm',
  },
  {
    ...general,
    format: 'cjs',
    outDir: 'dist/cjs',
  },
])
