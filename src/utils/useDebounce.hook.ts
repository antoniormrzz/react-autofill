import { useCallback, useEffect, useRef, useState } from "react"

type CallbackFunction = (...args: unknown[]) => void

/**
 * Debounce a callback function. Good for input events that you don't want to fire too often.
 * @param callback The function you want to debounce, which will be called after the delay.
 * @param delay defaults to 350 milliseconds
 * @returns Debounced Callback Function, which you can call as many times as you want.
 */
function useDebounce(callback: CallbackFunction, delay = 350): CallbackFunction {
  const [args, setArgs] = useState<unknown[]>()
  const savedCallback = useRef<CallbackFunction>()
  const firstRun = useRef(true)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if(firstRun.current) {
      firstRun.current = false
      return
    }
    const timerId = setTimeout(() => {
      if(savedCallback.current && args) {
        savedCallback.current(...args)
      }
    }, delay)
    return () => {
      if(timerId) {
        clearTimeout(timerId)
      }
    }
  }, [args, delay])

  const debouncedCallback = useCallback((...newArgs: unknown[]) => {
    setArgs(newArgs)
  }, [])

  return debouncedCallback
}

export default useDebounce
