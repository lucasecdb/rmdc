/* eslint-env node */

module.exports = {
  siteMetadata: {
    title: 'RMDC',
    description: 'React Material Design Components',
    pathPrefix: '/rmdc',
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
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['Material+Icons'],
      },
    },
  ],
}
