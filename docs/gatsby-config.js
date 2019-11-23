/* eslint-env node */

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
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['Material+Icons'],
      },
    },
  ],
}
