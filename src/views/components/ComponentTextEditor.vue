<script setup lang="ts">
import ComponentViews from "@/components/ComponentViews.vue";
import StTextEditor from "@/components/form/StTextEditor.vue";
import {ref} from "vue";
const text = ref("<p class=\"ql-align-center\"><strong>1.&nbsp;&nbsp;&nbsp;&nbsp;Внесение данных по контрагентам и договорам контрагентов.</strong></p><p class=\"ql-align-justify\">Исторические данные по контрагентам и договорам были разово перенесены в «1С:Логистика»</p><p class=\"ql-align-justify\">(далее – СЛЦ) из соответствующих справочников из «1С:Бухгалтерия» (далее – БУХ) Заказчика. Далее новые записи по Контрагентам и договорам заносятся в СЛЦ и передаются в БУХ. <span style=\"background-color: yellow;\">Также новые записи по контрагентам и договорам заносятся в БУХ и передаются в СЛЦ (признак – «контрагент</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">в группе» «Перевозка ж д (Амбал, Балтийск)»).</span></p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\">В СЛЦ используется имеющийся справочник «Контрагенты».</p><p class=\"ql-align-justify\">В привязке к Контрагенту (Клиенту) ведется учет договоров/приложений к договорам</p><p class=\"ql-align-justify\">с Контрагентом.</p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\">После заключения договора с клиентом, Оператором СЛЦ вносится запись в СЛЦ Контрагент – Договор (справочник «Контрагенты», группа <span style=\"background-color: yellow;\">«Перевозка ж/д (Амбал, Балтийск)»</span>). Новые записи передаются в «1С:Бухгалтерия» (справочник «Контрагенты» группа «Перевозка ж/д (Амбал, Балтийск)» и справочник «Договоры»). <span style=\"background-color: yellow;\">И наоборот</span></p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">Механизм синхронизации следующий:</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">БУХ – всегда эталон, по всем дублирующимся реквизитам, любых записей, документов</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">и справочников.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">Если в БУХ есть сведения – передаются в СЛЦ, если сведений нет, записываются из СЛЦ.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">Для сравнения контрагентов используем связку ИНН + КПП.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">Для сравнения договоров контрагентов используем связку Контрагент + Вид договора + Номер договора + дата (от).</span></p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">Для сравнения счетов используем связку Контрагент + договор + номер + дата (от). Подразделение для БУХ ВСЕГДА «Судно «Амбал». Номенклатура ВСЕГДА «Организация паромной перевозки «Амбал». НДС ВСЕГДА «НДС сверху».</span></p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\">Могут быть следующие варианты:</p><p class=\"ql-align-justify\"><span style=\"background-color: yellow;\">1.&nbsp;&nbsp;&nbsp;&nbsp;нет сведений о Контрагенте, нет договоров;</span></p><p class=\"ql-align-justify\">2.&nbsp;&nbsp;&nbsp;&nbsp;есть сведения о Контрагенте, но нет ни одного связанного с Контрагентом договора;</p><p class=\"ql-align-justify\">3.&nbsp;&nbsp;&nbsp;&nbsp;есть сведения о Контрагенте, есть один связанный с Контрагентом договор;</p><p class=\"ql-align-justify\">4.&nbsp;&nbsp;&nbsp;&nbsp;есть сведения о Контрагенте, есть более одного связанных с Контрагентом договоров.</p><p><br></p>")
</script>

<template>
  <ComponentViews>
    <template #title>Text editor</template>
    <StTextEditor v-model="text" clear/>
<!--    <StTextEditor v-model="text" clear/>-->
<!--    <StTextEditorQ v-model="text"/>-->
<!--    text : {{ text }}-->
<!--    <div v-html="text"/>-->
  </ComponentViews>
</template>

<style scoped>

</style>