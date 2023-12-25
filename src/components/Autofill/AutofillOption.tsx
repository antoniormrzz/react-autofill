import { forwardRef } from "react"
import { cnm } from "../../utils/classNameMerger.util"
import { RickAndMortyCharacter } from "../../types"

type AutofillOptionProps = {
  option: RickAndMortyCharacter,
  isNavigated: boolean,
  onClick: (option: RickAndMortyCharacter) => void,
  isSelected: boolean,
  search: string,
}

/** Rick and Morty character autofill option
 *  @prop option - option to render
 *  @prop isNavigated - is option navigated
 *  @prop onClick - callback for click
 *  @prop isSelected - is option selected
 *  @prop search - search query
 */
const AutofillOption = forwardRef<HTMLDivElement, AutofillOptionProps>(({
  option,
  isNavigated,
  onClick,
  isSelected,
  search
}, ref) => {
  return (
    <div
      ref={ref}
      className={
        cnm(
          "autofill__option",
          {
            "autofill__option--navigated": isNavigated
          }
        )
      }
      onClick={() => onClick(option)}
    >
      <input type="checkbox" checked={isSelected} tabIndex={-1} readOnly />
      <img className="autofill__option-img" src={option.image} alt={option.name} />
      <div className="autofill__option-name">
        {search === "" ?
          <span>{option.name}</span> :
          <span
            dangerouslySetInnerHTML={{
              __html: option.name.replace(
                new RegExp(search, "gi"),
                `<span class="autofill__option-name__highlight">${search}</span>`
              )
            }}
          />
        }
        <br />
        <span className="autofill__option-episode">{option.episode.length} edpisodes</span>
      </div>
    </div>
  )
})

export default AutofillOption