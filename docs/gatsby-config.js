/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

module.exports = {
  siteMetadata: {
    title: 'RMDC',
    description: 'React Material Design Components',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/docs`,
        name: 'docs',
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-mdx',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        includePaths: [path.resolve(__dirname, './node_modules')],
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['Material+Icons'],
      },
    },
  ],
}
