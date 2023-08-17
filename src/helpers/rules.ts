type message = string
interface IResultCallback {
  isInvalid:boolean
  message?:string
}
interface IRule {
  message?: message
}
// ---------------------------------------
interface IRequiredRule extends IRule {}
interface IEmailRule extends IRule {}
interface IPhoneRule extends IRule {}
interface INumericRule extends IRule{}
interface IRegularRule extends IRule {
  regular: RegExp|string
}
interface IRangeRule extends IRule {
  min?: number
  max?: number
}
interface ILengthRule extends IRule {
  min?: number
  max?: number
}
interface IAsyncRule extends IRule {
  validationCallback(value:any): Promise<IResultCallback>
}
interface ICustomRule extends IRule {
  validationCallback(value:any): IResultCallback
}
interface ICompareRule extends IRule {
  compareField: any
}
// ---------------------------------------
type Rules = {
  required?: IRequiredRule|message|boolean,
  email?: IEmailRule|message,
  phone?: IPhoneRule|message,
  numeric?: INumericRule|message
  regular?: IRegularRule
  range?: IRangeRule
  length?: ILengthRule
  async?: IAsyncRule
  custom?: ICustomRule
  compare?: ICompareRule
}
export {
  type Rules,
  type IRequiredRule,
  type IEmailRule,
  type IPhoneRule,
  type INumericRule,
  type IRegularRule,
  type IRangeRule,
  type ILengthRule,
  type IAsyncRule,
  type ICustomRule,
  type ICompareRule,
  type IResultCallback
}
// ---------------------------------------
const emptyData = [undefined, null, ""]
// ---------------------------------------
function required(value:boolean|string|number|{[index:string]:any}|[any]) {
  if (value && Array.isArray(value)) { return !!(value) && value?.length
  }else if (Object.prototype.toString.call(value) === '[object Date]'){
    return true
  } else if (value && !Object.keys(value)?.filter(i=>(value as any)[i]).length) {
    return Object.keys(value)?.filter(i=>(value as any)[i]).length
  } else { return !!(value) }
}
function email(value:string) {
  if (emptyData.includes(value)) { return false }
  return !(value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)?.[0])
}
function phone(value:string) {
  if (emptyData.includes(value)) { return false }
  return !value.match(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{1,3})[-. )]*)?((\d{1,4})[-. ]*(\d{0,4})[-. ]*(\d{0,4})[-. ]*(\d{0,7}))$/m)
}
function numeric(value:string) {
  if (emptyData.includes(value)) { return false }
  return !(value.match(/^\d+$/)?.[0])
}
function regular(value:string, regular:IRegularRule["regular"]) {
  if (emptyData.includes(value)) { return false }
  return typeof regular === "string"
    ? !(value.match(new RegExp(regular))?.[0])
    : !(value.match(regular)?.[0])
}
function range(value:string, min:IRangeRule["min"], max:IRangeRule["max"] ) {
  if (emptyData.includes(value)) { return false }
  if (!(value.match(/^\d+$/)?.[0])) return true
  if (min && +value < min) return true
  if (max && +value > max) return true
}
function length(value:string, min:IRangeRule["min"], max:IRangeRule["max"] ) {
  if (emptyData.includes(value)) { return false }
  if (min && value.length < min) return true
  if (max && value.length > max) return true
}
export function getValidate (value: any, field:any): {isInvalid: boolean, message: string} {
  const rules:Rules = field.rules
  let message:string = ""
  const arrayOfOrderRules = ["required", "email", "phone", "numeric", "regular", "range", "length", "custom", "compare"]
  const isInvalid = arrayOfOrderRules.filter(rule=>Object.keys(rules).includes(rule))
    .some((rule)=>{
      if(rule === "required"){
        if(!required(value)){
          message = typeof rules["required"] === "string"
            ? rules["required"]||""
            : typeof rules["required"] === "boolean"
              ? rules["required"] ? "Обязательное поле" : ""
              : rules["required"]?.message||""
          return true
        }
      } else if(rule === "email"){
        if(email(value)){
          message = typeof rules["email"] === "string"
            ? rules["email"]||""
            : rules["email"]?.message||""
          return true
        }
      } else if(rule === "phone"){
        if(phone(value)){
          message = typeof rules["phone"] === "string"
            ? rules["phone"]||""
            : rules["phone"]?.message||""
          return true
        }
      } else if (rule === "numeric"){
        if(numeric(value)){
          message = typeof rules["numeric"] === "string"
            ? rules["numeric"]||""
            : rules["numeric"]?.message||""
          return true
        }
      } else if (rule === "regular"){
        if(regular(value, rules["regular"]?.regular||"")){
          message = rules["regular"]?.message||""
          return true
        }
      } else if (rule === "range"){
        if(range(value, rules["range"]?.min, rules["range"]?.max)){
          message = rules["range"]?.message||""
          return true
        }
      } else if (rule === "length"){
        if(length(value, rules["length"]?.min, rules["length"]?.max)){
          message = rules["length"]?.message||""
          return true
        }
      } else if (rule === "custom"){
        const result = rules["custom"]?.validationCallback(value)
        if(result !== undefined && result?.isInvalid){
          message = result?.message||rules["custom"]?.message||""
          return true
        }
      } else if (rule === "compare"){
        // if (rules["compare"]?.compareField) {
        //   message = rules["compare"]?.message||""
        //   return true
        // }
      }
    })
  return {isInvalid, message}
}
export async function getAsyncValidate (value: any, field:any) {
  const rules:Rules = field.rules
  let isInvalid:boolean = false
  let message:string = ""
  const result = await rules["async"]?.validationCallback(value)
  if (result !== undefined) {
    isInvalid = result.isInvalid
    message = result.message||rules["async"]?.message||""
  }
  return {isInvalid, message}
}
//https://webdevnerdstuff.github.io/vue3-code-block/#add-lang-examples
//https://github.com/Leecason/element-tiptap/tree/alpha
//https://ui.shadcn.com/