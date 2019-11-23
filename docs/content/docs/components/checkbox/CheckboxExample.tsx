import * as React from 'react'
import { Checkbox } from '@lucasecdb/rmdc'

const CheckboxExample: React.FC = () => {
  const [{ indeterminate, checked }, setCheckboxState] = React.useState({
    indeterminate: false,
    checked: false,
  })

  const handleCheckboxChange = React.useCallback(() => {
    if (checked) {
      setCheckboxState({ indeterminate: false, checked: false })
    } else if (indeterminate) {
      setCheckboxState({ indeterminate: false, checked: true })
    } else {
      setCheckboxState({ indeterminate: true, checked: false })
    }
  }, [checked, indeterminate])

  return (
    <>
      <div style={{ display: 'flex', marginBottom: '1.45rem' }}>
        <Checkbox />
        <Checkbox
          indeterminate={indeterminate}
          checked={checked}
          onChange={handleCheckboxChange}
        />
      </div>
    </>
  )
}

export default CheckboxExample
