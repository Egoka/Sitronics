export function getParamsStructure (structure:{[key:string]: any}, calculatedFields:Array<string>):{ [key:string]: any } {
  return Object.keys(structure).reduce((acc:{[key:string]: any}, key:string) => {
    calculatedFields.includes(key)||(acc[key] = structure[key])
    return acc
  }, {})
}