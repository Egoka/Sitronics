export function getParamsStructure (structure:{[key:string]: any}, calculatedFields:Array<string>):{ [key:string]: any } {
  return Object.keys(structure).reduce((acc:{[key:string]: any}, key:string) => {
    calculatedFields.includes(key)||(acc[key] = structure[key])
    return acc
  }, {})
}
export function copyObject(o:any,i?:any,r?:any) {
  if(typeof o != "object") return o;
  r = o instanceof Array ? [] : o&&{};
  for(i in o)
    if(o.hasOwnProperty(i))
      r[i] = copyObject(o[i])
  return r
}