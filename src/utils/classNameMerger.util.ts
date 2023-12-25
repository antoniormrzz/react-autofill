// className merger utility function that merges string class names,
// conditional object class names, and array class names,
// and removes undefined, empty, and null class names
export const cnm = (...classNames:
  (
    string |
    { [key: string]: boolean } |
    (string | null | undefined)[] |
    undefined |
    undefined[] |
    null |
    null[]
  )[]
): string => {
  const classes = []
  for(const _className of classNames) {
    if(typeof _className === "string") {
      classes.push(_className)
    } else if(Array.isArray(_className)) {
      // filter(Boolean) removes falsy values from the array
      classes.push(..._className.filter(Boolean))
    } else if(typeof _className === "object" && _className !== null) {
      classes.push(...Object.keys(_className).filter((key) => _className[key]))
    }
  }
  return classes.join(" ")
}
