<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import Alert from "@/components/functional/Alert.vue";
import Button from "@/components/functional/Button.vue";
import openAlert, {IAlert, type IAlertProps} from "@/components/functional/Alert";
import {ref} from "vue";
import Badge from "@/components/functional/Badge.vue";
const badgesClass = "inline-flex items-center rounded-md bg-theme-50 dark:bg-theme-900 px-2 py-0.5 text-xs font-medium text-theme-600 dark:text-theme-400 ring-1 ring-inset ring-theme-500/10"
const sizes = ref<Array<IAlert["size"]>>(["xs","sm","md","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl"])
const positions = ref<Array<IAlert["position"]>>(["top", "bottom", "right", "left", "top-right", "top-left", "bottom-right", "bottom-left", "center"])
const displayTimes = ref<Array<IAlert["displayTime"]>>([1000, 2000, 3000, 4000, 5000])
const alert = ref(false)
const alert1 = ref(false)
const optionsAlert2 = ref<IAlert>({
  type: "error",
  title: 'Attention needed',
  subtitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.',
  displayTime: "1000",
  // notAnimate: true,
  position: "bottom-right"
})
const position = ref<IAlertProps["position"]>()
</script>

<template>
  <ComponentViews>
    <template #title>Alert</template>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Оповещения</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещения используются для сообщения о состоянии, которое влияет на систему, функцию или страницу.</p>
        <p>Такие оповещения могут сообщать пользователю об успешных или ошибочных событиях. Сообщать дополнительную информацию</p><br/>
      </p>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Контент</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>
          В оповещение можно задать заголовок или подзаголовок, или сразу оба.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class="col-span-full m-5">
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'neutral', title:'Заголовок'})">Только заголовок</Button>
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'neutral', subtitle:'Подзаголовок'})">Только подзаголовок</Button>
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'neutral', title:'Заголовок', subtitle:'Подзаголовок'})">Все</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-5">
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        В подзаголовок кроме текста можно передать <Badge mode="outline">html</Badge>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class="col-span-full m-5">
          <Button class="m-2" mode="outline" @click="openAlert({
          position: 'top-right', type: 'neutral', size: 'xs', displayTime: 5000, title: 'Оповещение с html',
          subtitle:`Пример оповещения в котором можно использовать <span class='${badgesClass}'>html разметку</span>
                    <img class='w-56 m-2 rounded-lg' src='https://images.unsplash.com/photo-1682687220989-cbbd30be37e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3870&q=80' alt=''>`
          })">С html</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Тип</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещение может быть оформлено разными стилями. Для базового используется необходимо вызвать параметр <Badge mode="outline">type</Badge>.<br>
          Существует пять сценариев:<br> для успешного сценария нужно указать значение <Badge mode="outline">success</Badge>(по умолчанию) зеленого цвета,<br>
          для предупреждающего <Badge mode="outline">warning</Badge> желтого цвета,<br>
          для ошибочного <Badge mode="outline">error</Badge> красного цвета,<br>
          для информационного <Badge mode="outline">info</Badge> синего цвета и<br>
          для нейтрального оповещения <Badge mode="outline">neutral</Badge> цвета фона.<br>
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class="col-span-full m-5">
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'success', title:'Alert success'})">success</Button>
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'warning', title:'Alert warning'})">warning</Button>
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'error', title:'Alert error'})">error</Button>
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'info', title:'Alert info'})">info</Button>
          <Button class="m-2" mode="outline" @click="openAlert({position: 'top-right', displayTime: 3000, type: 'neutral', title:'Alert neutral'})">neutral</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Расположение</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещению можно задать расположение. Доступные следующие значения <Badge mode="outline">top</Badge>(по умолчанию),
          <Badge mode="outline">bottom</Badge>,
          <Badge mode="outline">left</Badge>,
          <Badge mode="outline">right</Badge>,
          <Badge mode="outline">center</Badge>,
          <Badge mode="outline">bottom-left</Badge>,
          <Badge mode="outline">top-left</Badge>,
          <Badge mode="outline">bottom-right</Badge>,
          <Badge mode="outline">top-right</Badge>.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button v-for="position in positions" :key="position" class="m-2" mode="outline" @click="openAlert({
          type: 'warning', position: position, title: position, displayTime: 3000,
          })">{{ position }}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Размер</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещению можно задать максимальный размер. Доступные следующие значения, перечисленные по возрастанию:
          <Badge mode="outline">xs</Badge>,
          <Badge mode="outline">sm</Badge>,
          <Badge mode="outline">md</Badge>,
          <Badge mode="outline">lg</Badge>,
          <Badge mode="outline">xl</Badge>,
          <Badge mode="outline">2xl</Badge>(по умолчанию),
          <Badge mode="outline">3xl</Badge>,
          <Badge mode="outline">4xl</Badge>,
          <Badge mode="outline">5xl</Badge>,
          <Badge mode="outline">6xl</Badge>,
          <Badge mode="outline">7xl</Badge>.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button v-for="size in sizes" :key="size" class="m-2" mode="outline"
                  @click="openAlert({type: 'error', position:'top-right', title: String(size).toUpperCase(),
                   subtitle: 'Это пример текста подзаголовка для демонстрации различной ширины оповещения. Текст будет переноситься для малых размеров, а для широких будет растягиваться под размер окна оповещения.',
                   size: size,displayTime: 3000,
                  })">{{ String(size).toUpperCase() }}</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Время существования оповещения</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещению можно задать <Badge mode="outline">displayTimes</Badge> время расположения.
          Значение это число указанное в микросекундах.<br> <Badge mode="outline">Количество секунд * 1000</Badge>
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button v-for="time in displayTimes" :key="time" class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'info', position:'top-right', title: String(time).toUpperCase(), size: 'xs', displayTime: time,
                  subtitle: 'Это пример текста подзаголовка для демонстрации'
                  })">{{ time }} мс.</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Дополнительные параметры</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещению можно задать <Badge mode="outline">notAnimate</Badge> для отключения анимации сдвига.<br>
          Еще оповещению можно задать параметр <Badge mode="outline">closeButton</Badge>, который добавит кнопку закрытия.
          Это может пригодиться если время закрытие достаточно продолжительное, а пользователю нужно закрыть окно раньше.<br>
          Если параметр <Badge mode="outline">displayTime</Badge> не указан, то <Badge mode="outline">closeButton</Badge> будет автоматически включен.
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'info', position:'top-right', title: 'Оповещение без анимации', size: 'xs', displayTime: 5000,
                  subtitle: 'Это пример текста подзаголовка для демонстрации', notAnimate: true
                  })">Без анимации</Button>
          <Button class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'info', position:'top-right', title: 'Оповещение с кнопкой закрытия', size: 'xs', displayTime: 10000,
                  subtitle: 'Это пример текста подзаголовка для демонстрации', closeButton: true
                  })">С кнопкой закрытия</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Кастомные</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещению можно задать параметр <Badge mode="outline">class</Badge> и в нем указать кастомные стили.<br>
          Вот несколько примеров
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'success', position:'top-right', title: 'Кастомный', size: 'xs', displayTime: 5000,
                  subtitle: 'Это пример текста подзаголовка для демонстрации', notAnimate: true,
                  class: 'border-r-8 border-r-green-200 dark:border-r-green-900 rounded-r-none rounded-md'
                  })">Кастомный с боковой чертой</Button>
          <Button class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'success', position:'top-right', size: '7xl',displayTime: 5000,
                  subtitle: `<div class='flex'>
                                Доступно новое обновление программного обеспечения. Узнайте, что нового в версии 2.0.4.
                                <p class='mt-3 text-sm md:mx-6 md:mt-0'><a href='#' class='whitespace-nowrap font-medium text-green-500 bko'>Узнать<span aria-hidden='true'> →</span></a></p>
                              <div>`,
                  notAnimate: true,
                  class: 'border-2 border-green-200 dark:border-green-900 rounded '
                  })">Кастомный с углами</Button>
          <Button class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'success', position:'top-right', size: '7xl', displayTime: 5000, notAnimate: true,
                  subtitle: `Доступно новое обновление программного обеспечения. Узнайте, что нового в версии 2.0.4.`,
                  class: 'border-2 border-green-200 dark:border-green-900 rounded-full'
                  })">Кастомный скругленный</Button>
          <Button class="m-2" mode="outline"
                  @click="openAlert({
                  type: 'success', position:'top-right', size: '7xl', displayTime: 5000, notAnimate: true,
                  subtitle: `Доступно новое обновление программного обеспечения. Узнайте, что нового в версии 2.0.4.`,
                  class: 'border-2 border-green-200 dark:border-green-900 rounded-full bg-gradient-to-r from-green-100 to-green-400 dark:from-green-800 dark:to-green-950'
                  })">Кастомный с градиентом</Button>
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <h2 class="ml-5 text-xl font-semibold leading-7 text-theme-600 dark:text-theme-500">Использование в тексте</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Оповещению можно задать тегом в <Badge mode="outline">html</Badge><br>
          Вот несколько примеров
        </p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button class="m-2" mode="line" @click="alert = true;position='center'">Оповещение</Button>
          <Button v-for="positionIn in ['top', 'bottom', 'right', 'left']" :key="positionIn" class="m-2" mode="outline" @click="alert = true;position=positionIn">{{ positionIn }}</Button>
          <Alert v-model="alert" v-bind="optionsAlert2" :position="position" />
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Также при желании можно расположить относительно окна</p>
      </p>
      <div class="grid transition grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-6 mt-5">
        <div class=" col-span-full m-5">
          <Button class="m-2" mode="line" @click="alert1 = true;position='center'">Оповещение</Button>
          <Button v-for="positionOut in ['top', 'bottom', 'right', 'left']" :key="positionOut" class="m-2" mode="outline" @click="alert1 = true;position=positionOut">{{ positionOut }}</Button>
          <Alert v-model="alert1" class="fixed top-5 left-5 z-50" v-bind="optionsAlert2" :position="position" />
        </div>
      </div>
    </div>
    <div class="border-b border-theme-700/50 dark:border-theme-500/50 pb-0 mt-10">
      <p class="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
        <p>Можно сделать статично, частью текста</p>
          Alert - это один из важных элементов пользовательского интерфейса, который используется для вывода важных сообщений или уведомлений пользователю. Он может быть настроен на различные режимы, включая success, warning, error, info и neutral. Каждый режим имеет свою специфику и цель использования. <br><br>
          Режим success (успех)
          <Alert :model-value="true" position="center" type="success" title="Режим success (успех)" class="my-2" :display-time="10" >Используется для сообщений о успешном выполнении определенного действия или операции. Этот режим обычно используется для информирования пользователя о положительных результатах, например, успешном сохранении данных или успешном завершении процесса.</Alert>
          Режим warning (предупреждение)
          <Alert :model-value="true" position="center" type="warning" title="Режим warning (предупреждение)" class="my-2" :display-time="10" >Используется для сообщений о возможных проблемах или ситуациях, на которые пользователь должен обратить внимание. Он предупреждает пользователя о потенциальных рисках или нежелательных последствиях и позволяет ему принять необходимые меры предосторожности.</Alert>
          Режим error (ошибка)
          <Alert :model-value="true" position="center" type="error" title="Режим error (ошибка)" class="my-2" :display-time="10" >Используется для сообщений о возникновении ошибок или неправильных действий. Этот режим информирует пользователя о проблемах, требующих его внимания и решения. Сообщение об ошибке обычно содержит информацию о причине ошибки и предлагает рекомендации по ее устранению.</Alert>
          Режим info (информация)
          <Alert :model-value="true" position="center" type="info" title="Режим info (информация)" class="my-2" :display-time="10" >Используется для предоставления дополнительной информации или объяснений пользователю. Он может содержать полезные советы, инструкции или дополнительные детали, которые помогут пользователю лучше понять контекст или суть происходящего.</Alert>
          Режим neutral (нейтральный)
          <Alert :model-value="true" position="center" type="neutral" title="Режим neutral (нейтральный)" class="my-2" :display-time="10" >Используется для вывода обычных уведомлений или сообщений, которые не относятся к конкретному состоянию или действию. Этот режим часто используется для общих уведомлений, например, о запланированных работах или обновлениях системы.</Alert>
          Каждый из этих режимов Alert имеет свою цель и помогает улучшить пользовательский опыт. Выбор правильного режима зависит от контекста и цели сообщения, которое вы хотите передать пользователю.
      </p>
    </div>
  </ComponentViews>
</template>