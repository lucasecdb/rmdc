/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const scss = require('rollup-plugin-scss')
const copy = require('rollup-plugin-copy')

module.exports = {
  rollup(config) {
    config.plugins.concat([
      scss({
        includePaths: ['./node_modules/'],
        output: 'rmdc.css',
      }),
      copy({
        targets: [{ src: './src/index.scss', dest: 'rmdc.scss' }],
      }),
    ])
    return config
  },
}
