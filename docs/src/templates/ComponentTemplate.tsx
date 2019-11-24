import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'

const ComponentTemplate: React.FC<any> = ({ data: { mdx } }) => {
  return (
    <Layout>
      <Helmet title={mdx.frontmatter.title} />
      <div className="mdx-container">
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`

export default ComponentTemplate
