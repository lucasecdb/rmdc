import { MDCListAdapter, MDCListFoundation } from '@material/list'
import classNames from 'classnames'
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import useLatestRef from './hooks/useLatestRef'

const HORIZONTAL = 'horizontal'

const noop = () => {}

type ItemAttributes = {
  className: string[]
  tabIndex: number
} & {
  [attr: string]: string
}

interface ListContext {
  attributes: ItemAttributes[]
  items: React.MutableRefObject<React.RefObject<HTMLLIElement | null>[]>
  assigning: React.RefObject<boolean>
  onItemClick: (evt: React.MouseEvent<HTMLLIElement>, index: number) => void
  onItemFocus: (evt: React.FocusEvent<HTMLLIElement>, index: number) => void
  onItemBlur: (evt: React.FocusEvent<HTMLLIElement>, index: number) => void
  onItemKeyDown: (
    evt: React.KeyboardEvent<HTMLLIElement>,
    index: number
  ) => void
}

const ctx = React.createContext<ListContext>({
  attributes: [],
  items: { current: [] },
  assigning: { current: false },
  onItemClick: noop,
  onItemFocus: noop,
  onItemBlur: noop,
  onItemKeyDown: noop,
})

type ListProviderProps = Omit<ListContext, 'assigning'>

const useForceUpdate = (): [object, () => void] => {
  const [sentinel, setSentinel] = useState<object>({})

  return [
    sentinel,
    useCallback(() => {
      setSentinel({})
    }, []),
  ]
}

const ListProvider: React.FC<ListProviderProps> = ({
  items,
  attributes,
  onItemClick,
  onItemFocus,
  onItemBlur,
  onItemKeyDown,
  children,
}) => {
  // On the first render we say we're "assigning", and the children will push
  // into the array when they show up in their own useLayoutEffect.
  const assigning = useRef(true)

  // since children are pushed into the array in useLayoutEffect of the child,
  // children can't read their index on first render.  So we need to cause a
  // second render so they can read their index.
  const [sentinel, forceUpdate] = useForceUpdate()

  const contextValue = useMemo(
    () => ({
      items,
      assigning,
      attributes,
      onItemClick,
      onItemFocus,
      onItemBlur,
      onItemKeyDown,
      // keep this so it is included in the deps array
      _sentinel: sentinel,
    }),
    [
      attributes,
      items,
      onItemBlur,
      onItemClick,
      onItemFocus,
      onItemKeyDown,
      sentinel,
    ]
  )

  // parent useLayoutEffect is always last
  useLayoutEffect(() => {
    if (assigning.current) {
      // At this point all of the children have pushed into the array so we set
      // assigning to false and force an update. Since we're in
      // useLayoutEffect, we won't get a flash of rendered content, it will all
      // happen synchronously. And now that this is false, children won't push
      // into the array on the forceUpdate
      assigning.current = false
      forceUpdate()
    } else {
      // After the forceUpdate completes, we end up here and set assigning back
      // to true for the next update from the app
      assigning.current = true
    }

    return () => {
      // this cleanup function runs right before the next render, so it's the
      // right time to empty out the array to be reassigned with whatever shows
      // up next render.
      if (assigning.current) {
        // we only want to empty out the array before the next render cycle if
        // it was NOT the result of our forceUpdate, so being guarded behind
        // assigning.current works
        items.current = []
      }
    }
  })

  return <ctx.Provider value={contextValue}>{children}</ctx.Provider>
}

const useListIndex = (itemRef: React.RefObject<HTMLLIElement | null>) => {
  const { assigning, items } = useContext(ctx)
  const index = useRef(-1)

  useLayoutEffect(() => {
    if (assigning.current) {
      index.current = items.current.push(itemRef) - 1
    }
  })

  // first render its wrong, after a forceUpdate in parent useLayoutEffect it's
  // right, and its all synchronous so we don't get any flashing
  return index.current
}

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  checkboxList?: boolean
  radioList?: boolean
  nonInteractive?: boolean
  dense?: boolean
  avatarList?: boolean
  twoLine?: boolean
  singleSelection?: boolean
  wrapFocus?: boolean
  selectedIndex?: number | number[]
  onSelectionChange?: (index: number, selectedIndex: number | number[]) => void
  orientation?: 'vertical' | 'horizontal'
}

export type ListItemProps = React.HTMLAttributes<HTMLLIElement>

export const ListItem: React.FC<ListItemProps> = ({
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  children,
  ...props
}) => {
  const {
    attributes,
    onItemClick,
    onItemFocus,
    onItemBlur,
    onItemKeyDown,
  } = useContext(ctx)
  const ref = useRef<HTMLLIElement>(null)

  const index = useListIndex(ref)

  const handleClick: React.MouseEventHandler<HTMLLIElement> = evt => {
    onClick?.(evt)
    onItemClick?.(evt, index)
  }

  const handleFocus: React.FocusEventHandler<HTMLLIElement> = evt => {
    onFocus?.(evt)
    onItemFocus?.(evt, index)
  }

  const handleBlur: React.FocusEventHandler<HTMLLIElement> = evt => {
    onBlur?.(evt)
    onItemBlur?.(evt, index)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLLIElement> = evt => {
    onKeyDown?.(evt)
    onItemKeyDown?.(evt, index)
  }

  const itemAttrs = attributes[index] ?? { className: '', tabIndex: undefined }

  const { className, tabIndex, ...attrs } = itemAttrs

  const classes = classNames('mdc-list-item', className)

  return (
    // the accessibility is already handled by the foundation, and all attributes
    // are inside the `attrs` variable.
    //
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={classes}
      ref={ref}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      {...attrs}
      {...props}
    >
      {children}
    </li>
  )
}

export const List: React.FC<ListProps> = ({
  className = '',
  dense = false,
  twoLine = false,
  orientation = 'vertical',
  singleSelection = false,
  avatarList = false,
  nonInteractive = false,
  radioList = false,
  checkboxList = false,
  wrapFocus = false,
  selectedIndex = -1,
  onSelectionChange,
  role = '',
  children,
  ...props
}) => {
  const [itemAttributes, setItemAttributes] = useState<ItemAttributes[]>([])
  const foundationRef = useRef<MDCListFoundation | null>(null)
  const items = useRef<React.RefObject<HTMLLIElement>[]>([])

  const [isFocused, setFocused] = useState(false)
  const isFocusedRef = useLatestRef(isFocused)

  const itemAttributesRef = useLatestRef(itemAttributes)
  const onSelectionChangeRef = useLatestRef(onSelectionChange)

  useEffect(() => {
    const adapter: MDCListAdapter = {
      getListItemCount: () => items.current.length,

      notifyAction: index => {
        onSelectionChangeRef.current?.(
          index,
          foundationRef.current?.getSelectedIndex() ?? -1
        )
      },

      isRootFocused: () => isFocusedRef.current,
      isFocusInsideList: () => false,
      getFocusedElementIndex: () => -1,

      addClassForElementIndex: (index, className) => {
        setItemAttributes(prevAttrs => {
          const attrs = prevAttrs.slice()

          // @ts-ignore wtf?
          attrs[index] = {
            ...attrs[index],
            className: [className].concat(attrs[index]?.className),
          }

          return attrs
        })
      },
      removeClassForElementIndex: (index, className) => {
        setItemAttributes(prevAttrs => {
          const attrs = prevAttrs.slice()

          // @ts-ignore wtf
          attrs[index] = {
            ...attrs[index],
            className: attrs[index]?.className.filter(cls => cls !== className),
          }

          return attrs
        })
      },

      focusItemAtIndex: index => {
        items.current[index]?.current?.focus()
      },

      hasRadioAtIndex: () => {
        return false
      },
      hasCheckboxAtIndex: () => false,
      isCheckboxCheckedAtIndex: () => false,

      getAttributeForElementIndex: (index, attr) =>
        itemAttributesRef.current[index]?.[attr],
      setAttributeForElementIndex: (index, attribute, value) => {
        setItemAttributes(prevAttrs => {
          const attrs = prevAttrs.slice()

          attrs[index] = {
            ...attrs[index],
            [attribute === 'tabindex' ? 'tabIndex' : attribute]: value,
          }

          return attrs
        })
      },

      setTabIndexForListItemChildren: noop,
      /*
      (index, tabIndex) => {
        setItemAttributes(prevAttrs => {
          const attrs = prevAttrs.slice()

          // @ts-ignore i give up
          attrs[index] = { ...attrs[index], tabIndex: +tabIndex }

          return attrs
        })
      },
      */
      setCheckedCheckboxOrRadioAtIndex: noop,
      // (index, isChecked) => {},
    }

    foundationRef.current = new MDCListFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current?.destroy()
    }
  }, [isFocusedRef, itemAttributesRef, onSelectionChangeRef])

  useEffect(() => {
    foundationRef.current?.setSingleSelection(singleSelection)
  }, [singleSelection])

  useEffect(() => {
    foundationRef.current?.setSelectedIndex(selectedIndex)
  }, [selectedIndex])

  useEffect(() => {
    foundationRef.current?.setVerticalOrientation(orientation !== HORIZONTAL)
  }, [orientation])

  useEffect(() => {
    foundationRef.current?.setWrapFocus(wrapFocus)
  }, [wrapFocus])

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  const handleItemClick = useCallback(
    (_: React.MouseEvent<HTMLLIElement>, index: number) => {
      foundationRef.current?.handleClick(index, false)
    },
    []
  )

  const handleItemFocus = useCallback(
    (evt: React.FocusEvent<HTMLLIElement>, index: number) => {
      foundationRef.current?.handleFocusIn(evt.nativeEvent, index)
    },
    []
  )

  const handleItemBlur = useCallback(
    (evt: React.FocusEvent<HTMLLIElement>, index: number) => {
      foundationRef.current?.handleFocusOut(evt.nativeEvent, index)
    },
    []
  )

  const handleItemKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLLIElement>, index: number) => {
      evt.persist()
      foundationRef.current?.handleKeydown(evt.nativeEvent, true, index)
    },
    []
  )

  const classes = classNames('mdc-list', className, {
    'mdc-list--non-interactive': nonInteractive,
    'mdc-list--dense': dense,
    'mdc-list--avatar-list': avatarList,
    'mdc-list--two-line': twoLine,
  })

  const listRole =
    role ||
    (checkboxList && 'group') ||
    (radioList && 'radiogroup') ||
    undefined

  return (
    <ListProvider
      items={items}
      attributes={itemAttributes}
      onItemClick={handleItemClick}
      onItemFocus={handleItemFocus}
      onItemBlur={handleItemBlur}
      onItemKeyDown={handleItemKeyDown}
    >
      <ul
        className={classes}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role={listRole}
        aria-orientation={
          orientation === HORIZONTAL && !role && listRole
            ? HORIZONTAL
            : undefined
        }
        {...props}
      >
        {children}
      </ul>
    </ListProvider>
  )
}
