export function convertToCamelCase(text:string):string {
  return text.replace(/^(\w)|[-|_](\w)/g, function(match, groupOne, groupTwo) {
    return groupOne ? groupOne.toUpperCase() : groupTwo ? groupTwo.toUpperCase() : ''
  })
}
export function convertToDashCase(text:string):string {
  return text.replace(/([A-Z\W_])/g, function(match, letter, item) {
    return letter !== letter.toLowerCase() ? (item > 0 ? '-': '') + letter.toLowerCase() : '-'
  });
}
export function convertToSnakeCase(text:string):string {
  return text.replace(/([A-Z\W])/g, function(match, letter, item) {
    return letter !== letter.toLowerCase() ? (item > 0 ? '_': '') + letter.toLowerCase() : '_'
  });
}