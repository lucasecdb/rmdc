import {
  MDCTextFieldFoundation,
  MDCTextFieldRootAdapter,
} from '@material/textfield'
import classNames from 'classnames'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import useClassList from './hooks/useClassList'
import { NotchedOutline } from './NotchedOutline'
import { LineRipple } from './LineRipple'

const noop = () => {}

interface ContextType {
  textarea: boolean
}

const ctx = React.createContext<ContextType>({
  textarea: false,
})

export interface TextFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth: boolean
  outlined: boolean
  textarea: boolean
}

export interface TextFieldLabelProps {
  label?: React.ReactNode
}

export interface TextFieldInputProps {
  value?: string
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export const Label: React.FC<TextFieldLabelProps> = ({ children }) => {
  const { textarea } = useContext(ctx)

  if (textarea) {
    return (
      <NotchedOutline>
        <label htmlFor="textarea" className="mdc-floating-label">
          {children}
        </label>
      </NotchedOutline>
    )
  }

  return (
    <label className="mdc-floating-label" htmlFor="my-text-field">
      {children}
    </label>
  )
}

export const Input: React.FC<TextFieldInputProps> = () => {
  const { textarea } = useContext(ctx)

  if (textarea) {
    return (
      <textarea
        id="textarea"
        className="mdc-text-field__input"
        rows={8}
        cols={40}
      />
    )
  }

  return (
    <input type="text" id="tf-outlined" className="mdc-text-field__input" />
  )
}

export const TextField: React.FC<TextFieldProps> = ({
  fullWidth = false,
  outlined = false,
  textarea = false,
  className,
  children,
  ...props
}) => {
  const [lineRippleActive, setLineRippleActive] = useState(false)
  const [lineRippleOrigin, setLineRippleOrigin] = useState(0)
  const { addClass, removeClass, classList } = useClassList()
  const foundationRef = useRef<MDCTextFieldFoundation | null>(null)

  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  useEffect(() => {
    const lineRippleAdapter: MDCTextFieldLineRippleAdapter = {
      activateLineRipple: () => setLineRippleActive(true),
      deactivateLineRipple: () => setLineRippleActive(false),
      setLineRippleTransformOrigin: normalizedX =>
        setLineRippleOrigin(normalizedX),
    }

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

    foundationRef.current = new MDCTextFieldFoundation(
      Object.assign({}, adapter, lineRippleAdapter)
    )
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

  const handleFocus = () => {
    foundationRef.current?.activateFocus()
  }

  const handleBlur = () => {
    foundationRef.current?.deactivateFocus()
  }

  const context = useMemo(() => ({ textarea }), [textarea])

  return (
    <ctx.Provider value={context}>
      <div
        className={classes}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
        {!outlined && !fullWidth && !textarea && (
          <LineRipple
            active={lineRippleActive}
            rippleCenter={lineRippleOrigin}
          />
        )}
      </div>
    </ctx.Provider>
  )
}
