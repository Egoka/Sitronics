import type {ILabelMode} from "@/components/functional/Label.vue";
import {type ILayout} from "@/components/functional/inputLayout.vue";

// @ts-ignore
export const getLabelType = (value:any, label:ILayout["label"], labelMode:ILabelMode)=> {
  if (label?.length) {
    if (!!(value)) {
      if (["offsetDynamic","offsetStatic"].includes(labelMode)){
        return "offsetStatic"
      } else if (["vanishing"].includes(labelMode)){
        return "none"
      } else { return "static" }
    } else { return labelMode }
  } else { return "none" }
}