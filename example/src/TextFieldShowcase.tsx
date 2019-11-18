import * as React from 'react'
import { Input, Label, TextField, t } from '@lucasecdb/rmdc'

import styles from './TextFieldShowcase.module.css'

const TextFieldShowcase: React.FC = () => {
  return (
    <>
      <t.Caption>Text fields</t.Caption>
      <div className={styles.group}>
        <TextField>
          <Input />
          <Label>Hello</Label>
        </TextField>
        <TextField outlined>
          <Input />
          <Label>Outlined input</Label>
        </TextField>
        <TextField textarea>
          <Input rows={8} cols={40} />
          <Label>Textarea input</Label>
        </TextField>
      </div>
    </>
  )
}

export default TextFieldShowcase
