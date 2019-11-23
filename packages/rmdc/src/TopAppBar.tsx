import {
  MDCFixedTopAppBarFoundation,
  MDCShortTopAppBarFoundation,
  MDCTopAppBarAdapter,
  MDCTopAppBarFoundation,
} from '@material/top-app-bar'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import useClassList from './hooks/useClassList'
import { IconButton, IconButtonProps } from './IconButton'

const BASE = 'mdc-top-app-bar'
const SECTION = `${BASE}__section`

const CSS_CLASSES = {
  BASE,
  ROW: `${BASE}__row`,
  SECTION,
  SECTION_START: `${SECTION}--align-start`,
  SECTION_END: `${SECTION}--align-end`,
  FIXED: `${BASE}--fixed`,
  SHORT: `${BASE}--short`,
  SHORT_COLLAPSED: `${BASE}--short-collapsed`,
  PROMINENT: `${BASE}--prominent`,
  DENSE: `${BASE}--dense`,
  TITLE: `${BASE}__title`,
  ACTION_ITEM: `${BASE}__action-item`,
  NAV_ICON: `${BASE}__navigation-icon`,
}

export interface TopAppbarFixedAdjustProps {
  className?: string
  dense?: boolean
  prominent?: boolean
  short?: boolean
}

export const TopAppBarFixedAdjust: React.FunctionComponent<TopAppbarFixedAdjustProps> = ({
  children,
  className = '',
  dense = false,
  prominent = false,
  short = false,
  ...otherProps
}) => {
  const base = 'mdc-top-app-bar'
  const suffix = '-fixed-adjust'
  const classes = classNames(className, {
    [`${base}--short${suffix}`]: short,
    [`${base}--dense${suffix}`]: dense && !prominent,
    [`${base}--dense-prominent${suffix}`]: dense && prominent,
    [`${base}--prominent${suffix}`]: !dense && prominent,
    [`${base}-${suffix}`]: !short && !dense && !prominent,
  })

  return (
    <main className={classes} {...otherProps}>
      {children}
    </main>
  )
}

export interface TopAppBarIconProps {
  actionItem?: boolean
  className?: string
  children: React.ReactElement<any>
  navIcon?: boolean
}

export const TopAppBarIcon: React.FC<TopAppBarIconProps & IconButtonProps> = ({
  actionItem = false,
  navIcon = false,
  className,
  children,
  ...otherProps
}) => {
  return (
    <IconButton
      {...otherProps}
      className={classNames(className, {
        [CSS_CLASSES.ACTION_ITEM]: actionItem,
        [CSS_CLASSES.NAV_ICON]: navIcon,
      })}
    >
      {children}
    </IconButton>
  )
}

export interface TopAppBarRowProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

export const TopAppBarRow: React.FC<TopAppBarRowProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div className={classNames(className, CSS_CLASSES.ROW)} {...otherProps}>
      {children}
    </div>
  )
}

export interface TopAppBarSectionProps extends React.HTMLProps<HTMLElement> {
  align?: 'start' | 'end'
  className?: string
}

export const TopAppBarSection: React.FC<TopAppBarSectionProps> = ({
  align,
  className,
  children,
  ...otherProps
}) => {
  return (
    <section
      className={classNames(className, CSS_CLASSES.SECTION, {
        [CSS_CLASSES.SECTION_START]: align === 'start',
        [CSS_CLASSES.SECTION_END]: align === 'end',
      })}
      {...otherProps}
    >
      {children}
    </section>
  )
}

export interface TopAppBarTitleProps extends React.HTMLProps<HTMLSpanElement> {
  className?: string
}

export const TopAppBarTitle: React.FC<TopAppBarTitleProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <span className={classNames(className, CSS_CLASSES.TITLE)} {...otherProps}>
      {children}
    </span>
  )
}

export interface TopAppBarProps extends React.HTMLProps<HTMLElement> {
  className?: string
  dense?: boolean
  fixed?: boolean
  prominent?: boolean
  short?: boolean
  shortCollapsed?: boolean
  style?: React.CSSProperties
  scrollTarget?: React.RefObject<HTMLElement>
  onNavIconClicked?: () => void
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  children,
  className = '',
  dense = false,
  fixed = false,
  short = false,
  shortCollapsed = false,
  prominent = false,
  scrollTarget,
  style = {},
  onNavIconClicked,
  ...otherProps
}) => {
  const { classList, addClass, removeClass } = useClassList()
  const [activeStyles, setStyles] = useState<React.CSSProperties>({})
  const foundationRef = useRef<
    | MDCTopAppBarFoundation
    | MDCShortTopAppBarFoundation
    | MDCFixedTopAppBarFoundation
    | null
  >(null)
  const headerRef = useRef<HTMLElement>(null)

  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  const onNavIconClickedRef = useRef(onNavIconClicked)

  useEffect(() => {
    onNavIconClickedRef.current = onNavIconClicked
  }, [onNavIconClicked])

  useEffect(() => {
    const adapter: MDCTopAppBarAdapter = {
      addClass,
      removeClass,
      hasClass: cls => {
        return classListRef.current.includes(cls)
      },
      setStyle: (varName, value) => {
        setStyles(prevStyles => {
          const updatedStyle = Object.assign({}, prevStyles)
          // @ts-ignore
          updatedStyle[varName as keyof React.CSSProperties] = value
          return updatedStyle
        })
      },
      getTopAppBarHeight: () => {
        return headerRef.current?.clientHeight ?? 0
      },
      getViewportScrollY: () => {
        return scrollTarget && scrollTarget.current
          ? scrollTarget.current.scrollTop
          : window.pageYOffset
      },
      getTotalActionItems: () => {
        return (
          headerRef.current?.querySelectorAll(`.${CSS_CLASSES.ACTION_ITEM}`)
            .length ?? 0
        )
      },
      notifyNavigationIconClicked: () => {
        if (onNavIconClickedRef.current) {
          onNavIconClickedRef.current()
        }
      },
    }

    if (short || shortCollapsed) {
      foundationRef.current = new MDCShortTopAppBarFoundation(adapter)
    } else if (fixed) {
      foundationRef.current = new MDCFixedTopAppBarFoundation(adapter)
    } else {
      foundationRef.current = new MDCTopAppBarFoundation(adapter)
    }

    foundationRef.current.init()

    return () => {
      foundationRef.current?.destroy()
    }
  }, [addClass, fixed, removeClass, scrollTarget, short, shortCollapsed])

  useEffect(() => {
    const handler = () => foundationRef.current?.handleTargetScroll()

    const eventTarget = scrollTarget?.current ?? window

    eventTarget.addEventListener('scroll', handler)

    return () => {
      eventTarget.removeEventListener('scroll', handler)
    }
  }, [scrollTarget])

  useEffect(() => {
    const handler = () => foundationRef.current?.handleWindowResize()

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  const classes = classNames(
    CSS_CLASSES.BASE,
    Array.from(classList),
    className,
    {
      [CSS_CLASSES.FIXED]: fixed,
      [CSS_CLASSES.SHORT]: shortCollapsed || short,
      [CSS_CLASSES.SHORT_COLLAPSED]: shortCollapsed,
      [CSS_CLASSES.PROMINENT]: prominent,
      [CSS_CLASSES.DENSE]: dense,
    }
  )

  return (
    <header
      {...otherProps}
      className={classes}
      style={Object.assign({}, style, activeStyles)}
      ref={headerRef}
    >
      {children}
    </header>
  )
}
