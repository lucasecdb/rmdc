import * as React from 'react'
import { Button } from '@lucasecdb/rmdc'

import styles from './ButtonExample.module.css'

const ButtonExample: React.FC = () => {
  return (
    <div className={styles.buttonGroup}>
      <Button>Click me!</Button>

      <Button raised>Raised</Button>

      <Button outlined>Outlined</Button>

      <Button dense raised>
        Dense raised
      </Button>

      <Button disabled>Disabled button</Button>

      <Button unelevated>Unelevated</Button>
    </div>
  )
}

export default ButtonExample
