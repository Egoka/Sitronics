import * as Vue from 'vue';
import Alert from "@/components/functional/Alert.vue";
import type { Properties as CSS } from 'csstype';
import type {Size, StyleClass} from "@/components/BaseTypes";
export interface IAlert {
  modelValue?: boolean
  type?: "success"|"warning"|"info"| "error"|"neutral"
  position?: "top"|"bottom"|"left"|"right"|"center"|"bottom-left"|"top-left"|"bottom-right"|"top-right"
  size?: Size
  title?: string
  subtitle?: string
  class?: StyleClass
  style?: CSS
  displayTime?: string|number|1000|2000|3000|4000|5000
  notAnimate?: boolean
  closeButton?: boolean|undefined
}
export interface IAlertProps extends Omit<IAlert, 'position'> {
  position?: "top"|"bottom"|"left"|"right"|"center"
}
// ---------------------------------------
export default function openAlert(optionsAlert:IAlert) {
  /////////////////////////////////////////////////////////
  // SET options
  const options:IAlert = Object.assign({},optionsAlert)
  /////////////////////////////////////////////////////////
  // SET alertId
  const max = 1000; const min = 100
  const id = Math.floor(Math.random() * (max - min)) + min
  const alertId = `alert-${id}`
  /////////////////////////////////////////////////////////
  // SET options
  if (!options.position) { options.position = "top" }
  if (typeof options?.modelValue !== "boolean") { options.modelValue = true }
  // const alerts = [...document.querySelectorAll('.alert.top .alert-body')]
  // if (alerts.length) {
  //   const lastAlert = alerts[alerts.length-1].getBoundingClientRect()
  //   options.style = {
  //     transform: `translate(-50%, ${lastAlert.height + lastAlert.top}px)`
  //   }
  // }
  /////////////////////////////////////////////////////////
  const alertBody = document.querySelector(`.alert-${options.position}`)
  if (alertBody) {
    let divAlert = document.createElement('div');
    divAlert.id = alertId;
    divAlert.className = 'z-[100]'
    divAlert.style.cssText = "pointer-events: all;"
    alertBody.prepend(divAlert);
  } else {
    let div = document.createElement('div');
    div.className = `alert-${options.position} fixed z-[100] flex gap-4 overflow-auto max-h-screen pointer-events-none transition-all duration-500 ${
      options.position.includes("bottom") ? 'flex-col-reverse': 'flex-col'
    } ${
      options.position.includes("left") 
        ? 'items-start'
        : options.position.includes("right")
        ? 'items-end'
        : 'items-center'
    } ${alertClassPosition(options.position).join(" ")}`
    document.body.append(div);
    // SET div alert
    let divAlert = document.createElement('div');
    divAlert.id = alertId;
    divAlert.className = 'z-[100]'
    divAlert.style.cssText = "pointer-events: all;"
    div.prepend(divAlert);
  }
  /////////////////////////////////////////////////////////
  // SET mount
  const alert = Vue.createApp(Alert, {...options})
  alert.mount(`#${alertId}`)
  /////////////////////////////////////////////////////////
  // SET destroy
  let timer:number|null = null
  if (options.displayTime && +(options.displayTime) >= 100){
    timer = setTimeout(()=>destroy(), +(options.displayTime))
  }
  const alertButton = document.querySelector(`#${alertId} .button-delete`)
  if (alertButton){
    alertButton.addEventListener("click", destroy)
  }
  /////////////////////////////////////////////////////////
  // functions
  function destroy() {
    const alertEl = document.querySelector(`#${alertId}`);
    if (alertEl) {
      alertEl.className = 'z-10'
    }
    if (typeof timer === "number" && timer > 0) {
      clearTimeout(timer)
    }
    setTimeout( ()=>{
      alert.unmount()
      const divAlert = document.querySelector(`#${alertId}`)
      if (divAlert){ divAlert.remove() }
      const alertBodyForDelete = document.querySelector(`.alert-${options.position}`)
      if (alertBodyForDelete && alertBodyForDelete.childElementCount === 0){
        alertBodyForDelete.remove()
      }
    }, 600)
  }
  function alertClassPosition(position:IAlert["position"]="center"):Array<string>{
    const arrayClass = [];
    if (position === "center") {
      arrayClass.push("top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2")}
    if(position.includes("bottom")) { arrayClass.push(`bottom-0 mb-5`)
    } else if(position.includes("top")) { arrayClass.push(`top-0 mt-5`)
    } else { arrayClass.push("top-1/2 -translate-y-1/2") }
    if(position.includes("right")) { arrayClass.push(`right-0 mr-5`)
    } else if(position.includes("left")) { arrayClass.push(`left-0 ml-5`)
    } else { arrayClass.push("left-1/2 -translate-x-1/2") }
    return arrayClass
  }
}