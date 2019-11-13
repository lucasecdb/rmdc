import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { t } from '@lucasecdb/rmdc'

import ButtonShowcase from './ButtonShowcase'
import CheckboxShowcase from './CheckboxShowcase'

import '@lucasecdb/rmdc/rmdc.css'
import './styles.css'

const App = () => {
  return (
    <div className="container">
      <t.Headline3>RMDC Showcase</t.Headline3>
      <hr />
      <ButtonShowcase />
      <CheckboxShowcase />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
