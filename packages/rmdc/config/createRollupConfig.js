/* eslint-disable @typescript-eslint/camelcase */

const path = require('path')
const { terser } = require('rollup-plugin-terser')
const { DEFAULT_EXTENSIONS } = require('@babel/core')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const sourceMaps = require('rollup-plugin-sourcemaps')
const typescript = require('rollup-plugin-typescript2')
const scss = require('rollup-plugin-scss')

const paths = require('./paths')
const { safePackageName, safeVariableName } = require('./utils')

const external = id => !id.startsWith('.') && !path.isAbsolute(id)

const shebang = {}

const createRollupConfig = opts => {
  const shouldMinify = opts.env === 'production'

  const outputName = [
    `${paths.appDist}/${safePackageName(opts.name)}`,
    opts.format,
    opts.env,
    shouldMinify ? 'min' : '',
    'js',
  ]
    .filter(Boolean)
    .join('.')

  const typescriptPath = require.resolve('typescript', {
    paths: paths.appNodePath,
  })

  return {
    // Tell Rollup the entry point to the package
    input: paths.appIndex,
    // Tell Rollup which packages to ignore
    external: id => {
      if (id === 'babel-plugin-transform-async-to-promises/helpers') {
        return false
      }
      return external(id)
    },
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: outputName,
      // Pass through the file format
      format: opts.format,
      // Do not let Rollup call Object.freeze() on namespace import objects
      // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Do not let Rollup add a `__esModule: true` property when generating exports for non-ESM formats.
      esModule: false,
      // Rollup has treeshaking by default, but we can optimize it further...
      treeshake: {
        // We assume reading a property of an object never has side-effects.
        // This means tsdx WILL remove getters and setters defined directly on objects.
        // Any getters or setters defined on classes will not be effected.
        //
        // @example
        //
        // const foo = {
        //  get bar() {
        //    console.log('effect');
        //    return 'bar';
        //  }
        // }
        //
        // const result = foo.bar;
        // const illegalAccess = foo.quux.tooDeep;
        //
        // Punchline....Don't use getters and setters
        propertyReadSideEffects: false,
      },
      name: safeVariableName(opts.name),
      sourcemap: true,
      globals: { react: 'React', 'react-native': 'ReactNative' },
      exports: 'named',
    },
    plugins: [
      resolve({
        mainFields: ['module', 'main'],
      }),
      opts.format === 'umd' &&
        commonjs({
          // use a regex to make sure to include eventual hoisted packages
          include: /\/node_modules\//,
        }),
      json(),
      {
        // Custom plugin that removes shebang from code because newer
        // versions of bublé bundle their own private version of `acorn`
        // and I don't know a way to patch in the option `allowHashBang`
        // to acorn. Taken from microbundle.
        // See: https://github.com/Rich-Harris/buble/pull/165
        transform(code) {
          const reg = /^#!(.*)/
          const match = code.match(reg)

          shebang[opts.name] = match ? '#!' + match[1] : ''

          code = code.replace(reg, '')

          return {
            code,
            map: null,
          }
        },
      },
      typescript({
        typescript: require(typescriptPath),
        cacheRoot: `./.rts2_cache_${opts.format}`,
        tsconfig: paths.appTsConfig,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx'],
        passPerPreset: true,
        runtimeHelpers: true,
        babelrc: false,
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-proposal-class-properties',
        ],
      }),
      scss({
        includePaths: paths.appNodePath,
        output: 'rmdc.css',
      }),
      opts.env !== undefined &&
        replace({
          'process.env.NODE_ENV': JSON.stringify(opts.env),
        }),
      sourceMaps(),
      shouldMinify &&
        terser({
          sourcemap: true,
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 5,
          toplevel: opts.format === 'cjs',
          warnings: true,
        }),
    ],
  }
}

module.exports = createRollupConfig
