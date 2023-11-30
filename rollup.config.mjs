import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const isProd = process.env.NODE_ENV === 'production';

writeFileSync('./dist/config.json', JSON.stringify(dotenv.config().parsed));

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.min.js',
    format: 'esm',
    inlineDynamicImports: true,
    externalImportAttributes: true
  },
  plugins: [resolve(), commonjs(), json(), isProd && terser()]
}
