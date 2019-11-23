import { Card, CardPrimaryContent, t } from '@lucasecdb/rmdc'
import * as React from 'react'
import { graphql, navigate } from 'gatsby'
import Image from 'gatsby-image'

import Layout from '../components/Layout'

import styles from './index.module.css'

const COMPONENT_PAGE_REGEX = /\scomponent$/i

const App = ({ data: { components } }) => {
  return (
    <Layout>
      <t.Headline4>Components</t.Headline4>
      <hr />
      <div className={styles.componentGrid}>
        {components.edges.map(({ node }) => (
          <Card outlined key={node.id} className={styles.componentCard}>
            <CardPrimaryContent
              tabIndex={0}
              onClick={() => navigate(node.fields.slug)}
            >
              <Image
                className={styles.componentImage}
                {...node.frontmatter.image.childImageSharp}
              />
              <div className={styles.componentContent}>
                <t.Body1>
                  {node.frontmatter.title.replace(COMPONENT_PAGE_REGEX, '')}
                </t.Body1>
                <t.Body2 className={styles.componentDescription}>
                  {node.frontmatter.description}
                </t.Body2>
              </div>
            </CardPrimaryContent>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    components: allMdx(
      filter: { frontmatter: { title: { regex: "/\\scomponent$/i" } } }
      sort: { order: ASC, fields: frontmatter___title }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            description
            image {
              ... on File {
                childImageSharp {
                  fixed {
                    aspectRatio
                    width
                    height
                    src
                    srcSet
                    srcWebp
                    srcSetWebp
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export default App
