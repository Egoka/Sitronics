export interface IDataItem {
  [key:string]: any
}
export interface IDataStore {
  value: Set<any>
  key: string|null
  data: Set<IDataItem>
  multiple: boolean
}
class DataStore {
  private value: IDataStore["value"] = new Set()
  private key: IDataStore["key"] = null
  private data: IDataStore["data"] = new Set()
  readonly multiple: IDataStore["multiple"]
  protected constructor(value:IDataStore["value"], key:IDataStore["key"], data:Array<IDataItem>, multiple:IDataStore["multiple"]=false) {
    this.multiple = multiple
    this.setData(data)
    this.setValue(value)
    this.setKey(key)
  }
  // ---------------------------------------
  public setData (data:Array<IDataItem>){
    data.map(item=>
      typeof item === "object"
        ? this.data.add(item)
        : this.data.add({uuid:item})
  )}
  public getData ():Array<IDataItem> { return [...this.data]}
  public clearData () { this.data.clear()}
  // ---------------------------------------
  private setValueInValue(value:any) {
    ((!this.data.has(value))|| this.value.has(value)) ? this.value.delete(value) : this.value.add(value)
  }
  public isValue(value:any) {
    return this.data.has(value) && this.value.has(value)
  }
  public setValue(value:any) {
    if (this.multiple) {
      if (Array.isArray(value)) {
        value.map(item => this.setValueInValue(item))
      } else { this.setValueInValue(value) }
    } else {
      this.value.clear()
      this.setValueInValue(value) }
  }
  public getValue ():Array<any>|any { return [...this.value] }
  public getKeyValue ():Array<any>|any { return [...this.value].map(item=>this.key ? item[this.key]: item) }
  public clearValue () { this.value.clear() }
  // ---------------------------------------
  public setKey (key:IDataStore["key"]){
    if (this.getData() && this.getData().length) {
      if (key && Object.keys(this.getData()[0]).includes(key)) {
        this.key = key
      } else { this.key = Object.keys(this.getData()[0])[0] }
    } else { this.key = null }
  }
  public getKey (value?:any):IDataStore["key"]|number {
    if (this.key) { return this.key
    } else{ return null }
  }
  public clearKey () { this.key = null }
  // ---------------------------------------
}
export default DataStore