import { useEffect, useRef } from 'react'

const useLatestRef = <T extends any>(value: T) => {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref
}

export default useLatestRef
