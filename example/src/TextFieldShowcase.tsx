import * as React from 'react'
import { TextField, t } from '@lucasecdb/rmdc'

const TextFieldShowcase: React.FC = () => {
  return (
    <>
      <t.Caption>Text fields</t.Caption>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField />
      </div>
    </>
  )
}

export default TextFieldShowcase
