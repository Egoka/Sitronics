import {getCurrentInstance, render, h, isRef} from 'vue'
import type {IController, IProps, ISlots, IStructure, RefEl} from "./Controller.interface"
import listComponents from "@/components/listComponents";
import type {VNode} from "@vue/runtime-core";
export default class Controller implements IController {
  private readonly components: any
  private readonly listComponentsName: Array<string>
  private readonly listComponentsVNode: { [key: string]: VNode }
  public instances: { [key: string]: any }
  constructor(structure: Array<IStructure>, components?: any) {
    this.instances = {};
    this.listComponentsName = []
    this.listComponentsVNode = {}
    this.components = {...listComponents, ...components};
    (getCurrentInstance() as any).render = ()=>this.setH(structure)
  }
  private setH(structures: Array<IStructure|string>|string):Array<VNode|string>|string|any {
    if (structures === undefined) { return undefined}
    if (typeof structures === "string" || isRef(structures)) { return isRef(structures) ? structures.value : structures}
    return structures.map((structure:IStructure|string)=>{
      if (structure === undefined) { return undefined}
      if (typeof structure === "string") {
        return isRef(structure) ? structure.value : structure
      }
      const componentName = this.getComponentName(structure)
      const props:IProps = structure?.props && typeof structure.props === "object" ?
        Object.keys(structure.props).reduce((target:any, key:string)=>{
          target[key] = isRef((structure.props as IProps)[key])
            ? (structure.props as IProps)[key].value
            : (structure.props as IProps)[key]
          return target},{}) : {}
      const slots = structure?.slots && typeof structure.slots === "object"
        ? Object.keys(structure?.slots).reduce((target:any, key:string)=>{
          target[key] = (params:any) => <Array<VNode>>this.setH((structure.slots as ISlots)[key](params))
          return target},{})
        : structure?.children ? <Array<VNode>>this.setH(structure.children) : {}
      const elVNode = h(this.components?.[structure.component]||structure.component,
        {id: componentName, ...props, ref: (el:RefEl)=> this.instances[componentName] = el},
        slots)
      this.listComponentsVNode[componentName] = elVNode
      return elVNode
    })
  }
  private getComponentName(structure: IStructure):string {
    const componentName = structure?.name || structure?.component
    const countName = this.listComponentsName.filter((name:string)=>name.includes(componentName)).length
    const resultComponentName = `${componentName}${countName?"_"+countName:""}`
    this.listComponentsName.push(resultComponentName)
    return resultComponentName
  }
  public getVNodeComponent (componentName:string, component:Array<IStructure>):void {
    render(h("div", <Array<VNode>>this.setH(component)), (document.getElementById(componentName) as HTMLElement))
  }
}