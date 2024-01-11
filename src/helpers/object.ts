export function removeParamsFromStructure<
  Structure extends { [key: string]: any }
>(
  structure: Structure,
  removedFields: Array<keyof Structure>
): Omit<Structure, Array<keyof Structure>[number]> {
  return Object.keys(structure).reduce(
    (acc: { [key: string]: any }, key: string) => {
      if (!removedFields.includes(key as Array<keyof Structure>[number])) {
        acc[key] = structure[key as Array<keyof Structure>[number]];
      }
      return acc;
    },
    {}
  ) as Omit<Structure, Array<keyof Structure>[number]>;
}
export function copyObject(o:any,i?:any,r?:any) {
  if(typeof o != "object") return o;
  r = o instanceof Array ? [] : o&&{};
  for(i in o)
    if(o.hasOwnProperty(i))
      r[i] = copyObject(o[i])
  return r
}