import {
  MDCTextFieldFoundation,
  MDCTextFieldInputAdapter,
  MDCTextFieldLabelAdapter,
  MDCTextFieldLineRippleAdapter,
  MDCTextFieldOutlineAdapter,
  MDCTextFieldRootAdapter,
  cssClasses,
} from '@material/textfield'
import classNames from 'classnames'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import useClassList from './hooks/useClassList'
import useLatestRef from './hooks/useLatestRef'
import { NotchedOutline } from './NotchedOutline'
import { FloatingLabel } from './FloatingLabel'
import { LineRipple } from './LineRipple'

const noop = () => {}

interface ContextType {
  textarea: boolean
  outlined: boolean
  registerLabel: (ref: any) => void
  labelFloat: boolean
  onLabelWidthChange: (width: number) => void
  notchActive: boolean
  notchWidth: number
}

const ctx = React.createContext<ContextType>({
  textarea: false,
  outlined: false,
  registerLabel: noop,
  onLabelWidthChange: noop,
  labelFloat: false,
  notchActive: false,
  notchWidth: 0,
})

export interface TextFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth: boolean
  outlined: boolean
  textarea: boolean
  noLabel: boolean
}

export interface TextFieldLabelProps {
  label?: React.ReactNode
}

export interface TextFieldInputProps {
  value?: string
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export const Label: React.FC<TextFieldLabelProps> = ({ children }) => {
  const {
    textarea,
    outlined,
    labelFloat,
    registerLabel,
    onLabelWidthChange,
    notchActive,
    notchWidth,
  } = useContext(ctx)
  const labelRef = useRef<any | null>(null)

  useEffect(() => {
    registerLabel(labelRef.current)
  }, [registerLabel])

  const labelElement = (
    <FloatingLabel
      ref={labelRef}
      float={labelFloat}
      onWidthChange={onLabelWidthChange}
    >
      {children}
    </FloatingLabel>
  )

  if (textarea || outlined) {
    return (
      <NotchedOutline notch={notchActive} notchWidth={notchWidth}>
        {labelElement}
      </NotchedOutline>
    )
  }

  return labelElement
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
  noLabel = false,
  className,
  children,
  ...props
}) => {
  const [lineRippleActive, setLineRippleActive] = useState(false)
  const [lineRippleOrigin, setLineRippleOrigin] = useState(0)
  const { addClass, removeClass, classList } = useClassList()
  const foundationRef = useRef<MDCTextFieldFoundation | null>(null)

  const [isFocused, setFocused] = useState(false)
  const [labelFloat, setLabelFloat] = useState(false)
  const labelRef = useRef<any | null>(null)
  const [labelWidth, setLabelWidth] = useState(0)
  const [notchActive, setNotchActive] = useState(false)
  const [notchWidth, setNotchWidth] = useState(0)

  const classListRef = useLatestRef(classList)
  const labelWidthRef = useLatestRef(labelWidth)
  const outlinedRef = useLatestRef(outlined)
  const textareaRef = useLatestRef(textarea)
  const nativeInputRef = useLatestRef(null)
  const isFocusedRef = useLatestRef(isFocused)

  useEffect(() => {
    const lineRippleAdapter: MDCTextFieldLineRippleAdapter = {
      activateLineRipple: () => setLineRippleActive(true),
      deactivateLineRipple: () => setLineRippleActive(false),
      setLineRippleTransformOrigin: normalizedX =>
        setLineRippleOrigin(normalizedX),
    }

    const labelAdapter: MDCTextFieldLabelAdapter = {
      shakeLabel: shouldShake => {
        if (shouldShake) {
          labelRef.current?.shake()
        }
      },
      hasLabel: () => !!labelRef.current,
      floatLabel: shouldFloat => {
        setLabelFloat(shouldFloat)
      },
      getLabelWidth: () => labelWidthRef.current,
    }

    const notchAdapter: MDCTextFieldOutlineAdapter = {
      hasOutline: () => {
        return outlinedRef.current || textareaRef.current
      },
      closeOutline: () => {
        setNotchActive(false)
      },
      notchOutline: labelWidth => {
        setNotchActive(true)
        setNotchWidth(labelWidth)
      },
    }

    const inputAdapter: MDCTextFieldInputAdapter = {
      isFocused: () => isFocusedRef.current,
      getNativeInput: () => nativeInputRef.current,

      registerInputInteractionHandler: noop,
      deregisterInputInteractionHandler: noop,
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
      Object.assign(
        {},
        adapter,
        lineRippleAdapter,
        labelAdapter,
        notchAdapter,
        inputAdapter
      )
    )
    foundationRef.current.init()

    return () => {
      foundationRef.current?.destroy()
    }
  }, [
    addClass,
    classList,
    classListRef,
    isFocusedRef,
    labelWidthRef,
    nativeInputRef,
    outlinedRef,
    removeClass,
    textareaRef,
  ])

  const classes = classNames(className, cssClasses.ROOT, {
    [cssClasses.OUTLINED]: outlined,
    [cssClasses.FULLWIDTH]: fullWidth,
    [cssClasses.TEXTAREA]: textarea,
    [cssClasses.NO_LABEL]: noLabel,
    [cssClasses.FOCUSED]: isFocused,
  })

  const handleFocus = () => {
    setFocused(true)
    foundationRef.current?.activateFocus()
  }

  const handleBlur = () => {
    setFocused(false)
    foundationRef.current?.deactivateFocus()
  }

  const registerLabel = useCallback((ref: any) => {
    labelRef.current = ref
  }, [])

  const onLabelWidthChange = useCallback((width: number) => {
    setLabelWidth(width)
  }, [])

  const context = useMemo(
    () => ({
      textarea,
      outlined,
      labelFloat,
      registerLabel,
      onLabelWidthChange,
      notchActive,
      notchWidth,
    }),
    [
      labelFloat,
      notchActive,
      notchWidth,
      onLabelWidthChange,
      outlined,
      registerLabel,
      textarea,
    ]
  )

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
