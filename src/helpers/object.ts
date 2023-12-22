export function removeParamsFromStructure<
  Structure extends { [key: string]: any },
  Fields extends Array<keyof Structure>,
  Key extends Fields[number]
>(
  structure: Structure,
  removedFields: Fields
): Omit<Structure, Key> {
  return Object.keys(structure).reduce(
    (acc: { [key: string]: any }, key: string) => {
      if (!removedFields.includes(key as Key)) {
        acc[key] = structure[key as Key];
      }
      return acc;
    },
    {}
  ) as Omit<Structure, Key>;
}
export function copyObject(o:any,i?:any,r?:any) {
  if(typeof o != "object") return o;
  r = o instanceof Array ? [] : o&&{};
  for(i in o)
    if(o.hasOwnProperty(i))
      r[i] = copyObject(o[i])
  return r
}