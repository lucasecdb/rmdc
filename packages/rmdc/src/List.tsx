import { MDCListAdapter, MDCListFoundation } from '@material/list'
import classNames from 'classnames'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import useLatestRef from './hooks/useLatestRef'

const HORIZONTAL = 'horizontal'

interface ItemAttributes {
  className: string[]
  tabIndex: number
}

interface ListContext {
  attributes: ItemAttributes[]
  registerItem: (ref: HTMLLIElement) => () => void
}

const ctx = React.createContext<ListContext>({
  attributes: [],
  registerItem: () => () => {},
})

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  checkboxList?: boolean
  radioList?: boolean
  nonInteractive?: boolean
  dense?: boolean
  avatarList?: boolean
  twoLine?: boolean
  singleSelection?: boolean
  wrapFocus?: boolean
  orientation?: 'vertical' | 'horizontal'
}

export const ListItem: React.FC = ({ children }) => {
  const listContext = useContext(ctx)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => listContext.registerItem(ref.current!), [listContext])

  return (
    <li className="mdc-list-item" ref={ref}>
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
  role = '',
  children,
}) => {
  const [itemAttributes, setItemAttributes] = useState<ItemAttributes[]>([])
  const foundationRef = useRef<MDCListFoundation | null>(null)

  const [isFocused, setFocused] = useState(false)
  const isFocusedRef = useLatestRef(isFocused)

  useEffect(() => {
    const adapter: MDCListAdapter = {
      getListItemCount: () => 0,

      notifyAction: index => {
        console.log('index', index)
      },

      isRootFocused: () => isFocusedRef.current,
      isFocusInsideList: () => false,
      getFocusedElementIndex: () => -1,

      addClassForElementIndex: (index, className) => {
        setItemAttributes(prevAttrs => {
          const attrs = prevAttrs.slice()

          attrs[index].className = [className].concat(attrs[index].className)

          return attrs
        })
      },
      removeClassForElementIndex: (index, className) => {
        setItemAttributes(prevAttrs => {
          const attrs = prevAttrs.slice()

          attrs[index].className = attrs[index].className.filter(
            cls => cls !== className
          )

          return attrs
        })
      },

      hasRadioAtIndex: index => {
        return false
      },
      focusItemAtIndex: index => {},

      hasCheckboxAtIndex: index => false,
      isCheckboxCheckedAtIndex: index => false,

      getAttributeForElementIndex: (index, attr) => null,
      setAttributeForElementIndex: (index, attribute, value) => {},

      setTabIndexForListItemChildren: (index, tabIndex) => {},
      setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {},
    }

    foundationRef.current = new MDCListFoundation(adapter)
    foundationRef.current.init()

    return () => {
      foundationRef.current?.destroy()
    }
  }, [isFocusedRef])

  useEffect(() => {
    foundationRef.current?.setSingleSelection(singleSelection)
  }, [singleSelection])

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

  const registerItem = useCallback(() => {
    return () => {}
  }, [])

  const contextValue = useMemo<ListContext>(
    () => ({
      attributes: itemAttributes,
      registerItem,
    }),
    [itemAttributes, registerItem]
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
    <ctx.Provider value={contextValue}>
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
      >
        {children}
      </ul>
    </ctx.Provider>
  )
}
