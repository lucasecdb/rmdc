/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const scss = require('rollup-plugin-scss')

module.exports = {
  rollup(config) {
    config.plugins.push(
      scss({
        includePaths: ['./node_modules/'],
        output: 'rmdc.css',
      })
    )

    return config
  },
}
