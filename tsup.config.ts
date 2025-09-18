import { defineConfig, type Options } from 'tsup'

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
    outExtension: () => ({ js: '.js' }),
    outDir: 'dist/cjs',
  },
])
