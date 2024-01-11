// ---------------------------------------
import {Delta} from "@vueup/vue-quill";
import type {ILayout} from "@/components/functional/InputLayout";

declare type ContentPropType = string | Delta | undefined | null;
declare type Module = {
  name: string;
  module: unknown;
  options?: object;
};
export interface IDataTextEditor {
  content: ContentPropType
  contentType: "delta" | "html" | "text"
  enable: boolean
  readOnly: boolean
  theme: "snow" | "bubble"
  toolbar: "essential" | "minimal" | "full" | string | object | Array<any>
  modules: Module | Module[]
  options: any
  globalOptions: any;
}
export interface ITextEditor extends Omit<ILayout, "value"|"isValue">{
  id?: string
  modelValue?: string|number|null|undefined,
  paramsTextEditor?: Partial<IDataTextEditor>
}