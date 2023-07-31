import {v4 as uuid} from "uuid";
export interface IDataItem {
  selected: boolean
  item?: any
  [key:string]: any
}
export interface IDataStore {
  value: number|string|[]|null
  key: string
  isUuidKey: boolean
  data: Array<IDataItem>
  multiple: boolean
}
class DataStore {
  value: IDataStore["value"] = null
  key: IDataStore["key"] = "uuid"
  isUuidKey: IDataStore["isUuidKey"] = false
  data: IDataStore["data"] = []
  multiple: IDataStore["multiple"]
  protected constructor(value:IDataStore["value"], key:IDataStore["key"], data:IDataStore["data"], multiple:IDataStore["multiple"]=false) {
    this.multiple = multiple
    this.setData(data)
    this.setValue(value)
    this.setKey(key)
  }
  setValue(value:IDataStore["value"]){
    if (this.data.length) {
      if (this.multiple) {
        this.value = value !== "" && value ? value : []
      } else {
        this.value = value ? value : null
      }
    } else {
      this.value = null
    }
  }
  setKey (key:IDataStore["key"]){
    if (this.data.length && typeof this.data[0] === "object") {
      this.key = key && key.length ? key : Object.keys(this.data[0])[0]
    } else {
      this.key = "uuid"
    }
  }
  setData (data:IDataStore["data"]){
    if (data?.length) {
      if (typeof data[0] === "object") {
        this.data = data.map(item=>{return{...item, selected: false}})
        this.key = this.key.length ? this.key : Object.keys(this.data[0])[0]
        this.isUuidKey = false
      } else {
        this.data = data.map(item=>{return{uuid:uuid(), item, selected: false}})
        this.key = "uuid"
        this.isUuidKey = true
      }
    } else {
      this.data = [];
    }
  }
  select(item:any){
    if (item === null) {
      return this.clearValue()
    }
    const indexData = this.data.findIndex(i=>i[this.key] ===item[this.key])
    if (indexData >= 0) {
      if (this.multiple) {
        if (this.data[indexData].selected){
          const indexValue = (this.value as Array<any>)?.findIndex(i=>i ===this.data[indexData][this.isUuidKey ? "item" : this.key])
          if (indexValue >= 0) {
            (this.value as Array<any>).splice(indexValue, 1);
          }
        } else {
          (this.value as Array<any>).unshift(this.isUuidKey ? item.item : item[this.key])
        }
        this.data[indexData].selected = !this.data[indexData].selected
      } else {
        this.data.forEach(i=>i.selected = i[this.key] === item[this.key])
        this.value = this.isUuidKey ? item.item : item[this.key]
      }
    }
    console.log(this)
  }
  get selected(){
    if (this.multiple) {
      return (this.value as Array<any>)?.map(i=>this.data.find(item=> i === (this.isUuidKey ? item.item : (item[this.key]))))
    } else {
      return this.data.filter(item=>this.value === (this.isUuidKey ? item.item : (item[this.key])))
    }
  }
  clearValue(){
    this.value = this.multiple ? [] : null
    this.data.forEach(i=>i.selected = false)
  }
}
export default DataStore