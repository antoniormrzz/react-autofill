import { X } from "@phosphor-icons/react"
import { cnm } from "../../utils/classNameMerger.util"
import { RickAndMortyCharacter } from "../../types"

type AutofillValueProps = {
  value: RickAndMortyCharacter,
  onRemove: (value: RickAndMortyCharacter) => void,
  isNavigated: boolean
}

/** Rick and Morty character autofill value
 * @prop value - value to render
 * @prop onRemove - callback for remove
 * @prop isNavigated - is value navigated
 * */
const AutofillValue = ({
  value,
  onRemove,
  isNavigated
}: AutofillValueProps) => {
  return (
    <div
      className={cnm("autofill-field__value",
        {
          "autofill-field__value--navigated": isNavigated
        }
      )}
    >
      {value.name}
      <X
        size={14}
        className="autofill-field__value__remove"
        onClick={() => onRemove(value)}
      />
    </div>
  )
}

export default AutofillValue