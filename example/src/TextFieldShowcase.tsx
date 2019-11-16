import * as React from 'react'
import { Input, Label, TextField, t } from '@lucasecdb/rmdc'

const TextFieldShowcase: React.FC = () => {
  return (
    <>
      <t.Caption>Text fields</t.Caption>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField>
          <Input />
          <Label>Hello</Label>
        </TextField>
        <TextField outlined>
          <Input />
          <Label>Outlined input</Label>
        </TextField>
        <TextField textarea>
          <Input />
          <Label>Textarea input</Label>
        </TextField>
      </div>
    </>
  )
}

export default TextFieldShowcase
