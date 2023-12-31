import type {IStructure} from "@/classes/Controller.interface";

export const viewComponent = (title?:string, content?:Array<IStructure>|IStructure|any):IStructure=>{
  return {
    component: "main",
    props: {
      class: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    },
    children: [
      {
        component: "div",
        props: {
          class: "flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24"
        },
        children: [{
          component: "h1",
          props: {
            class: "text-4xl font-bold tracking-tight text-gray-900"
          },
          children: [title]
        }]
      },
      {
        component: "section",
        props: {
          "aria-labelledby": "products-heading",
          class: "pb-24 pt-6"
        },
        children: [
          {
            component: "h2",
            props: {
              id: "products-heading",
              class: "sr-only"
            },
            children: ["Products"]
          },
          {
            component: "div",
            props: {
              class: "w-full max-h-full bg-stone-100 dark:bg-stone-900 rounded mt-1 p-3"
            },
            children: [{
              component: "div",
              props: {
                class: "flex flex-col justify-center w-full bg-stone-50 dark:bg-stone-950 rounded m-auto py-10 px-10 md:px-56"
              },
              children: [...content]
            },]
          },
        ]
      }
    ]
  }
}