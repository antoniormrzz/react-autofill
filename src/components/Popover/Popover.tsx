import { Popper } from "react-popper"
import { useCallback, useRef } from "react"
import useEventListener from "../../utils/useEventListener.hook"
import { mergeRefs } from "../../utils/mergeRefs.util"
import { cnm } from "../../utils/classNameMerger.util"

import "./popover.css"

export type PopoverProps = {
  /**
   * The prop with jsx for the content of the popover.
   * */
  content: React.ReactNode
  /**
   * The children that the popover will be positioned relative to.
   * Also the element that popover is triggered by.
   * */
  children: React.ReactNode
  /**
   * Whether or not the popover is open.
   * If this is not provided, the popover will be uncontrolled and manage its own state.
   * */
  isOpen?: boolean
  /**
   * On open state change callback.
   * */
  setIsOpen?: (isOpen: boolean) => void
  /**
   * The callback that is called when the popover is opened.
   * */
  onOpen?: () => void
  /**
   * The callback that is called when the popover is closed.
   * */
  onClose?: () => void
  /**
   * children span wrapper className
   * */
  triggerClassName?: string
  /**
   * children span wrapper style
   * */
  triggerStyle?: React.CSSProperties
  /**
   * popover className
   * */
  className?: string
  /**
   * popover style
   * */
  style?: React.CSSProperties
  /**
   * popover arrow className
   * */
  arrowClassName?: string
  /**
   * popover arrow style
   * */
  arrowStyle?: React.CSSProperties
}

function Popover({
  content,
  children,
  isOpen,
  setIsOpen,
  onOpen,
  onClose,
  triggerClassName,
  className,
  style: popoverStyle
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const handleClick = useCallback((event: MouseEvent) => {
    // if clicked outside popover, close popover
    if (
      isOpen
      && popoverRef.current
      && !popoverRef.current.contains(event.target as Node)
      && triggerRef.current
      && !triggerRef.current.contains(event.target as Node)
    ) {
      setIsOpen?.(false)
      onClose?.()
    }

    // if clicked on trigger, open popover
    if (/* for readability */
      isOpen === false
      && popoverRef.current
      && !popoverRef.current.contains(event.target as Node)
      && triggerRef.current
      && triggerRef.current.contains(event.target as Node)
    ) {
      setIsOpen?.(true)
      onOpen?.()
    }
  }, [
    isOpen,
    setIsOpen,
    onClose,
    onOpen
  ])

  useEventListener("mousedown", handleClick, window)

  const popperElement = (
    <Popper
      placement="bottom"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 12],
          },
        }
      ]}
      referenceElement={triggerRef.current as HTMLElement}
    >
      {({ ref, style, placement }) => (
        <div
          ref={mergeRefs(popoverRef, ref)}
          data-placement={placement}
          className={cnm("popover", className)}
          style={{ ...style, ...popoverStyle }}
        >
          {content}
        </div>
      )}
    </Popper>
  )


  return (
    <span
      ref={triggerRef}
      className={cnm("popover__trigger", triggerClassName)}
    >
      {children}
      {isOpen ? popperElement : null}
    </span>
  )
}

export default Popover
