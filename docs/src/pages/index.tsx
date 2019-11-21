import * as React from 'react'
import { t } from '@lucasecdb/rmdc'

import Layout from '../components/Layout'
import CheckboxShowcase from '../components/CheckboxShowcase'

const App = () => {
  return (
    <Layout>
      <t.Headline3>RMDC Showcase</t.Headline3>
      <hr />
      <CheckboxShowcase />
    </Layout>
  )
}

export default App
