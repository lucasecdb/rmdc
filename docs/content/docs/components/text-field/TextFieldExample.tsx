import * as React from 'react'
import { Input, Label, TextField } from '@lucasecdb/rmdc'

import styles from './TextFieldExample.module.css'

const TextFieldExample: React.FC = () => {
  return (
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
  )
}

export default TextFieldExample
