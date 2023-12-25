import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RickAndMortyCharacter } from "../../types"
import useDebounce from "../../utils/useDebounce.hook"
import Popover, { PopoverProps } from "../Popover/Popover"
import { cnm } from "../../utils/classNameMerger.util"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import AutofillOption from "./AutofillOption"
import AutofillValue from "./AutofillValue"

import "./autofill.css"

export type AutofillProps = {
  /** input placeholder */
  placeholder?: string,
  /** additional wrapper class name */
  className?: string,
  /** selected values.
   * Yes I'm aware that this is an array, but this is also an input component.
   * So it will be value rather than values.
   * */
  value: RickAndMortyCharacter[],
  /** callback for selected values */
  onChange: (value: RickAndMortyCharacter[]) => void,
  /** search query
   * Won't be bound to the input since it's debounced,
   * but it's still useful for highlighting.
  */
  search: string,
  /** search query update */
  onSearch: (value: string) => void,
  /** list of options */
  options: RickAndMortyCharacter[],
  /** show loading indicator */
  isLoading?: boolean,
  /** error */
  error?: string,
  /** additional Popover props */
  popoverProps?: Partial<PopoverProps>,
  /** additional popover class name */
  popoverClass?: string,
}

/** Rick and Morty character autofill input
 *  @prop value - selected values
 *  @prop onChange - callback for selected values
 *  @prop options - list of options
 *  rest of the props are jsdoc'd in the type definition.
 */
function Autofill({
  placeholder = "",
  className,
  value = [],
  onChange,
  search,
  onSearch,
  options,
  isLoading,
  error,
  popoverProps = {},
  popoverClass,
}: AutofillProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)

  ////// search
  const [inputValue, setInputValue] = useState<string>("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const debouncedOnSearch = useDebounce((searchQuery: unknown) => {
    onSearch(searchQuery as string);
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    debouncedOnSearch(inputValue);
  }, [inputValue, debouncedOnSearch]);

  ////// option click
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOptionClick = useCallback((option: RickAndMortyCharacter) => {
    if (value.some((v) => v.id === option.id)) {
      onChange(value.filter((v) => v.id !== option.id))
    } else {
      onChange([...value, option])
    }
    setNavigatedValue(-1)
    setNavigatedOption(-1)
    inputRef.current?.focus()
  }, [value, onChange]);

  ////// keyboard navigation
  const [navigatedOption, setNavigatedOption] = useState<number>(-1);
  const [navigatedValue, setNavigatedValue] = useState<number>(-1);

  const optionRefs = useMemo(() => options.map(() => createRef<HTMLDivElement>()), [options]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isPopoverOpen) {
        setIsPopoverOpen(true)
      } else {
        setNavigatedOption((prevOption) => Math.min(prevOption + 1, options.length - 1));
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setNavigatedOption((prevOption) => Math.max(prevOption - 1, 0));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setNavigatedValue((prevValue) => Math.max(prevValue - 1, 0));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setNavigatedValue((prevValue) => Math.min(prevValue + 1, value.length - 1));
    } else if (event.key === "Enter" && navigatedOption !== -1) {
      event.preventDefault();
      if (value.some((v) => v.id === options[navigatedOption].id)) {
        onChange(value.filter((v) => v.id !== options[navigatedOption].id))
      } else {
        onChange([...value, options[navigatedOption]])
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsPopoverOpen(false);
    } else if (event.key === "Delete" && navigatedValue !== -1) {
      event.preventDefault();
      setNavigatedValue((prevValue) => {
        if (prevValue === value.length - 1) {
          return Math.max(prevValue - 1, 0);
        } else if (prevValue === 0 && value.length === 1) {
          return -1;
        }
        return prevValue;
      });
      onChange(value.filter((_, index) => index !== navigatedValue));
    }
  }, [navigatedOption, options, navigatedValue, value, onChange, isPopoverOpen]);

  useEffect(() => {
    if (!isPopoverOpen) {
      setNavigatedOption(-1)
      setNavigatedValue(-1)
    }
  }, [isPopoverOpen])

  // scroll into view when navigating
  useEffect(() => {
    if (navigatedOption !== -1 && optionRefs[navigatedOption].current) {
      optionRefs[navigatedOption].current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [navigatedOption, optionRefs]);

  return (
    <div
      className={cnm("autofill", className)}
      onKeyDown={handleKeyDown}
    >
      <Popover
        className={cnm("autofill__popover", popoverClass)}
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        content={
          error ?
            <div style={{ color: "red" }}>Out of portal gun juice, Morty. {error}</div> :
            isLoading ?
              <div className="bg-shimmer">Loading...</div> :
              options.length === 0 ?
                <div>Somebody needs to learn spelling, Jerry.</div> :
                <div className="autofill__options">
                  {options.map((option, index) => (
                    <AutofillOption
                      key={option.id}
                      option={option}
                      isNavigated={index === navigatedOption}
                      isSelected={value.some((value) => value.id === option.id)}
                      search={search}
                      onClick={handleOptionClick}
                      ref={optionRefs[index]}
                    />
                  ))}
                </div>
        }
        triggerClassName="autofill__trigger"
        {...popoverProps}
      >
        <div
          className="autofill-field__values"
        >
          {
            value.map((v, i) => (
              <AutofillValue
                key={v.id}
                value={v}
                onRemove={(_value) => onChange(value.filter((v) => v.id !== _value.id))}
                isNavigated={i === navigatedValue}
              />
            ))
          }
        </div>
        <input
          className="autofill__input"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsPopoverOpen(true)
          }}
          placeholder={placeholder}
        />
        {isPopoverOpen ?
          <CaretUp
            size={14}
            className="autofill__input__caret"
          /> :
          <CaretDown
            size={14}
            className="autofill__input__caret"
          />
        }
      </Popover>
    </div>
  )
}

export default Autofill

