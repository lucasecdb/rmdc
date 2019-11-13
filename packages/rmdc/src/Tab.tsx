import { MDCTabAdapter, MDCTabFoundation } from '@material/tab'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import { Ripple } from './Ripple'
import { useTabBar } from './TabBar'
import TabIndicator from './TabIndicator'
import useClassList from './hooks/useClassList'
import useId from './hooks/useId'

export interface TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  focusOnActivate?: boolean
  isFadingIndicator?: boolean
  indicatorContent?: React.ReactNode
  minWidth?: boolean
  isMinWidthIndicator?: boolean
  stacked?: boolean
  onInteraction?: () => void
}

const Tab: React.FC<TabProps> = ({
  focusOnActivate = true,
  className,
  isFadingIndicator = false,
  indicatorContent = null,
  minWidth = false,
  onInteraction = () => {},
  stacked = false,
  children,
  isMinWidthIndicator = false,
  ...otherProps
}) => {
  const id = useId()
  const [indicatorActive, setIndicatorActive] = useState(false)
  const { classList, addClass, removeClass } = useClassList()
  const foundationRef = useRef<MDCTabFoundation | null>(null)
  const tabRef = useRef<HTMLButtonElement>(null)
  const tabContentRef = useRef<HTMLSpanElement>(null)
  const { register, onTabChange } = useTabBar()
  const tabIndicatorRef = useRef<any | null>(null)
  const tabRippleRef = useRef<HTMLDivElement>(null)
  const previousIndicatorClientRectRef = useRef<ClientRect | null>(null)

  const [attributes, setAttributes] = useState<any>({
    'aria-selected': 'false',
    tabIndex: -1,
  })

  const computeIndicatorClientRect = useCallback(() => {
    return (
      tabIndicatorRef.current?.computeContentClientRect() ?? ({} as ClientRect)
    )
  }, [])

  const computeDimensions = useCallback(() => {
    return foundationRef.current?.computeDimensions()
  }, [])

  const focus = useCallback(() => {
    tabRef.current?.focus()
  }, [])

  useEffect(() => {
    const unregister = register(id, {
      activate: (clientRect?: ClientRect) => {
        foundationRef.current?.activate(clientRect)
      },
      deactivate: () => foundationRef.current?.deactivate(),
      computeIndicatorClientRect,
      computeDimensions,
      focus,
      tabRef,
    })

    return () => {
      unregister()
    }
  }, [computeDimensions, computeIndicatorClientRect, focus, id, register])

  const classListRef = useRef(classList)

  useEffect(() => {
    classListRef.current = classList
  }, [classList])

  useEffect(() => {
    const adapter: MDCTabAdapter = {
      addClass,
      removeClass,
      hasClass: cls => classListRef.current.includes(cls),
      setAttr: (attr, value) => {
        setAttributes((prevAttributes: any) => ({
          ...prevAttributes,
          [attr]: value,
        }))
      },
      getOffsetLeft: () => Number(tabRef.current?.offsetLeft),
      getOffsetWidth: () => Number(tabRef.current?.offsetWidth),
      getContentOffsetLeft: () => tabContentRef.current?.offsetLeft ?? 0,
      getContentOffsetWidth: () => tabContentRef.current?.offsetWidth ?? 0,
      focus: () => tabRef.current?.focus(),
      notifyInteracted: onInteraction,
      activateIndicator: clientRect => {
        previousIndicatorClientRectRef.current =
          clientRect ?? ({} as ClientRect)
        setIndicatorActive(true)
      },
      deactivateIndicator: () => {
        setIndicatorActive(false)
      },
    }
    foundationRef.current = new MDCTabFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current?.destroy()
    }
  }, [addClass, className, onInteraction, removeClass])

  useEffect(() => {
    foundationRef.current?.setFocusOnActivate(focusOnActivate)
  }, [focusOnActivate])

  const handleFocus = () => {
    tabRippleRef.current?.focus()
  }

  const handleBlur = () => {
    tabRippleRef.current?.blur()
  }

  const handleClick = () => {
    onTabChange(id)
  }

  const classes = classNames('mdc-tab', Array.from(classList), className, {
    'mdc-tab--min-width': minWidth,
    'mdc-tab--stacked': stacked,
  })

  const indicator = (
    <TabIndicator
      icon={!!indicatorContent}
      fade={isFadingIndicator}
      active={indicatorActive}
      previousIndicatorClientRect={
        previousIndicatorClientRectRef.current ?? undefined
      }
      ref={tabIndicatorRef}
    >
      {indicatorContent}
    </TabIndicator>
  )

  return (
    <button
      {...otherProps}
      className={classes}
      role="tab"
      aria-selected={attributes['aria-selected']}
      tabIndex={attributes.tabIndex}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={tabRef}
    >
      <span className="mdc-tab__content" ref={tabContentRef}>
        {children}
        {isMinWidthIndicator && indicator}
      </span>
      {!isMinWidthIndicator && indicator}
      <Ripple ref={tabRippleRef} className="mdc-tab__ripple" unbounded />
    </button>
  )
}

export default Tab
