const fs = require('fs')
const path = require('path')

const appRoot = fs.realpathSync(process.cwd())

const resolveApp = relativePath => {
  return path.resolve(appRoot, relativePath)
}

const buildNodePath = basePath => {
  const nodePath = []
  const splitted = [''].concat(basePath.split(path.sep))

  for (let i = splitted.length - 1; i > 0; i--) {
    nodePath.push(path.join(splitted.join(path.sep), 'node_modules'))
    splitted.pop()
  }

  return nodePath
}

module.exports = {
  appPath: resolveApp('.'),
  appDist: resolveApp('dist'),
  appIndex: resolveApp('src/index.tsx'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  appNodePath: buildNodePath(appRoot),
}
