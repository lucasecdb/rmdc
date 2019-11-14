import classNames from 'classnames'
import React, { useRef } from 'react'

import { useRipple } from './Ripple'
import { IconTypes } from './IconTypes'

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  icon?: IconTypes
  className?: string
  rippled?: boolean
  unbounded?: boolean
}

export const Icon: React.FunctionComponent<IconProps> = ({
  icon = '',
  className,
  unbounded = true,
  rippled = false,
  ...otherProps
}) => {
  const ref = useRef<HTMLElement>(null)
  const { rippleClasses, rippleStyle } = useRipple({
    surfaceRef: ref,
    disabled: !rippled,
    unbounded,
  })

  const classes = classNames('material-icons', className, rippleClasses, {
    'mdc-icon--rippled': rippled,
  })

  return (
    <i style={rippleStyle} className={classes} ref={ref} {...otherProps}>
      {icon}
    </i>
  )
}
