import * as React from 'react'
import { Button, t } from '@lucasecdb/rmdc'

import styles from './ButtonShowcase.module.css'

const ButtonShowcase: React.FC = () => (
  <>
    <t.Caption>Buttons</t.Caption>
    <div className={styles.buttonGroup}>
      <Button>Click Me!</Button>
      <Button raised>Raised</Button>
      <Button outlined>Outlined</Button>
      <Button dense raised>
        Dense raised
      </Button>
      <Button disabled>Disabled button</Button>
      <Button unelevated>Unelevated</Button>
    </div>
  </>
)

export default ButtonShowcase
