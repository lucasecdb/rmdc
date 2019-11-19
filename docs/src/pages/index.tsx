import * as React from 'react'
import { t } from '@lucasecdb/rmdc'

import ButtonShowcase from '../components/ButtonShowcase'
import CheckboxShowcase from '../components/CheckboxShowcase'
import TextFieldShowcase from '../components/TextFieldShowcase'

const App = () => {
  return (
    <div className="container">
      <t.Headline3>RMDC Showcase</t.Headline3>
      <hr />
      <ButtonShowcase />
      <CheckboxShowcase />
      <TextFieldShowcase />
    </div>
  )
}

export default App
