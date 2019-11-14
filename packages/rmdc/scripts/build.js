const path = require('path')
const { promises: fsp } = require('fs')
const { rollup } = require('rollup')

const { safePackageName } = require('../config/utils')
const paths = require('../config/paths')
const createRollupConfig = require('../config/createRollupConfig')

function writeCjsEntryFile(name) {
  const baseLine = `module.exports = require('./${safePackageName(name)}`
  const contents = `
'use strict'
if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.production.min.js')
} else {
  ${baseLine}.cjs.development.js')
}
`
  return fsp.writeFile(path.join(paths.appDist, 'index.js'), contents)
}

const ensureDistFolder = () => {
  return fsp.mkdir(paths.appDist, { recursive: true })
}

const build = async () => {
  const packageJson = await fsp
    .readFile(paths.appPackageJson)
    .then(buf => buf.toString())
    .then(JSON.parse)

  const buildConfigs = [
    {
      env: 'development',
      format: 'cjs',
    },
    {
      env: 'production',
      format: 'cjs',
    },
    {
      env: 'development',
      format: 'esm',
    },
    {
      env: 'production',
      format: 'esm',
    },
  ]
    .map(config => ({
      ...config,
      name: packageJson.name,
    }))
    .map(createRollupConfig)

  await ensureDistFolder()

  console.log('Creating entry file')
  await writeCjsEntryFile(packageJson.name)

  console.log('Building modules')
  await Promise.all(
    buildConfigs.map(async config => {
      const bundle = await rollup(config)
      await bundle.write(config.output)
    })
  )
}

build()
