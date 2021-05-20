import path from 'path'
import {babel} from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'

const configs = []

if (process.env.BUILD === 'size') {
  configs.push({
    input: './lib/micromark/index.js',
    output: {
      file: './micromark.min.js',
      format: 'umd',
      name: 'micromark',
      freeze: false,
      plugins: [
        // Running terser twice shaves a couple of bytes off.
        /* eslint-disable camelcase */
        terser({output: {ascii_only: true}, mangle: {safari10: true}}),
        terser({output: {ascii_only: true}, mangle: {safari10: true}})
        /* eslint-enable camelcase */
      ]
    },
    plugins: [
      nodeResolve({browser: true}),
      babel({
        babelHelpers: 'external',
        skipPreflightCheck: true,
        plugins: ['babel-plugin-unassert', 'babel-plugin-undebug'].concat([
          [
            'babel-plugin-inline-constants',
            {
              modules: [
                './lib/micromark-core-symbol/codes.js',
                './lib/micromark-core-symbol/constants.js',
                './lib/micromark-core-symbol/types.js',
                './lib/micromark-core-symbol/values.js'
              ]
            }
          ]
        ])
      }),
      commonjs({includes: /node_modules/})
    ]
  })
} else if (process.env.BUILD === 'dist') {
  configs.push({
    input: [
      './lib/micromark/index.js',
      './lib/micromark/stream.js',
      // Preserve compiled away constants for ecosystem packages
      './lib/micromark-core-symbol/codes.js',
      './lib/micromark-core-symbol/constants.js',
      './lib/micromark-core-symbol/types.js',
      './lib/micromark-core-symbol/values.js'
    ],
    output: [
      {
        dir: 'dist',
        format: 'esm',
        freeze: false,
        preserveModules: true,
        entryFileNames: '[name].js'
      }
    ],
    external,
    plugins: [
      babel({
        babelHelpers: 'external',
        skipPreflightCheck: true,
        plugins: ['babel-plugin-unassert', 'babel-plugin-undebug'].concat([
          [
            'babel-plugin-inline-constants',
            {
              modules: [
                './lib/micromark-core-symbol/codes.js',
                './lib/micromark-core-symbol/constants.js',
                './lib/micromark-core-symbol/types.js',
                './lib/micromark-core-symbol/values.js'
              ]
            }
          ]
        ])
      })
    ]
  })
}

export default configs

function external(id) {
  return !id.startsWith('.') && !path.isAbsolute(id)
}
