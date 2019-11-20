import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const ComponentTemplate: React.FC<any> = ({ data: { mdx } }) => {
  return (
    <div className="container">
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </div>
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
