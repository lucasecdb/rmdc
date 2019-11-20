import * as React from 'react'
import { t } from '@lucasecdb/rmdc'

import CheckboxShowcase from '../components/CheckboxShowcase'
import TextFieldShowcase from '../components/TextFieldShowcase'

const App = () => {
  return (
    <div className="container">
      <t.Headline3>RMDC Showcase</t.Headline3>
      <hr />
      <CheckboxShowcase />
      <TextFieldShowcase />
    </div>
  )
}

export default App
