import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.js',
  output: {
    file: 'src/index.min.js',
    format: 'esm',
    inlineDynamicImports: true,
    externalImportAttributes: true
  },
  plugins: [resolve(), commonjs(), json(), isProd && terser()]
}
