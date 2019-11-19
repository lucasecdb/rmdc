import * as React from 'react'
import { Checkbox, FormField, t } from '@lucasecdb/rmdc'

const CheckboxShowcase: React.FC = () => {
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
      <t.Caption>Checkboxes</t.Caption>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FormField
          label={<t.Body2>Agree to the terms and conditions</t.Body2>}
          input={<Checkbox nativeControlId="my-checkbox" />}
          inputId="my-checkbox"
        />
        <FormField
          label="Cyclic checkbox!"
          input={
            <Checkbox
              indeterminate={indeterminate}
              checked={checked}
              onChange={handleCheckboxChange}
              nativeControlId="checkbox-2"
            />
          }
          inputId="checkbox-2"
        />
      </div>
    </>
  )
}

export default CheckboxShowcase
