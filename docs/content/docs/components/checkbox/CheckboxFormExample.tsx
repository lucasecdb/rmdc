import * as React from 'react'
import { Checkbox, FormField } from '@lucasecdb/rmdc'

const CheckboxFormExample: React.FC = () => {
  return (
    <>
      <FormField
        label="Agree to the terms and conditions"
        input={<Checkbox nativeControlId="my-checkbox" />}
        inputId="my-checkbox"
      />
    </>
  )
}

export default CheckboxFormExample
