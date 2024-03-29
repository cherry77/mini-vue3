import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

// rollup天然支持esm
export default {
  input: './src/index.ts',
  output: [
    // 1.cjs -> commonjs
    {
      format: 'cjs',
      file: pkg.main
    },
    // 2. esm
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [
    // 编译ts
    typescript()
  ]
}