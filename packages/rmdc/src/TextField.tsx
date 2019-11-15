import {
  MDCTextFieldFoundation,
  MDCTextFieldRootAdapter,
} from '@material/textfield'
import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'
import useClassList from './hooks/useClassList'

const noop = () => {}

export interface TextFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth: boolean
  outlined: boolean
  textarea: boolean
}

export const TextField: React.FC<TextFieldProps> = ({
  fullWidth = false,
  outlined = false,
  textarea = false,
  className,
  ...props
}) => {
  const { addClass, removeClass, classList } = useClassList()
  const foundationRef = useRef<MDCTextFieldFoundation | null>(null)

  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  useEffect(() => {
    const adapter: MDCTextFieldRootAdapter = {
      addClass,
      removeClass,
      hasClass: cls => classListRef.current.includes(cls),

      registerTextFieldInteractionHandler: noop,
      deregisterTextFieldInteractionHandler: noop,

      // @ts-ignore
      registerValidationAttributeChangeHandler: noop,
      deregisterValidationAttributeChangeHandler: noop,
    }

    foundationRef.current = new MDCTextFieldFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current?.destroy()
    }
  }, [addClass, classList, removeClass])

  const classes = classNames(className, 'mdc-text-field', {
    'mdc-text-field--outlined': outlined,
    'mdc-text-field--fullwidth': fullWidth,
    'mdc-text-field--textarea': textarea,
  })

  return (
    <div className={classes} {...props}>
      <input type="text" id="my-text-field" className="mdc-text-field__input" />
      <label className="mdc-floating-label" htmlFor="my-text-field">
        Hint text
      </label>
      <div className="mdc-line-ripple"></div>
    </div>
  )
}
