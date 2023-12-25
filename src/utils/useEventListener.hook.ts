import { useRef, useEffect } from "react"

/**
 * A hook that adds an event listener to the window or document.
 * @param eventName The name of the event to listen to.
 * @param handler The function to call when the event is fired.
 * @param element The element to add the event listener to. Defaults to window.
 * @param options The options to pass to addEventListener.
 */
export default function useEventListener<E extends Event = Event>(
  eventName: string,
  handler: (event: E) => void,
  element: EventTarget = window,
  options?: AddEventListenerOptions
) {
  const savedHandler = useRef<(event: E) => void>()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if(!isSupported) {
      return
    }

    const eventListener = (event: Event) => savedHandler.current?.(event as E)

    element.addEventListener(eventName, eventListener, options)

    return () => {
      element.removeEventListener(eventName, eventListener, options)
    }
  }, [eventName, element, options])
}


