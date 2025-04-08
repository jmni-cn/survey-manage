<template>
  <n-alert
    :show-icon="false"
    title="逻辑规则"
    type="info"
    v-if="logicValue.conditions.some((v) => v.targetId)"
  >
  <template #header>
    <n-text>逻辑规则：满足以下{{ logicValue.logicOperator === "AND" ? "全部" : "任一" }}条件，展示本题。否则隐藏</n-text>
  </template>
    <ul>
      <li
        v-for="(logic, li) in logicValue.conditions"
        :key="logic.targetId"
      >
        条件{{ li + 1 }}：题目
        <n-text type="info"
          >{{ logic.target?.index }}: {{ logic.target?.title }}</n-text
        >
        ，{{
          conditionType[
            logic.type as "answered" | "unanswered" | "checked" | "unchecked"
          ]
        }}
        <n-text v-if="logic.answerId" type="info">
          {{
            logic.target?.options?.find((v) => v.optionId === logic.answerId)
              ?.label
          }}
        </n-text>
      </li>
    </ul>
  </n-alert>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { Logic } from "../type";

export default defineComponent({
  props: {
    logicValue: {
      type: Object as PropType<Logic>,
      required: true,
    },
  },
  components: {},
  setup() {
    const conditionType: Record<"answered" | "unanswered" | "checked" | "unchecked", string> ={
      answered: '已答',
      unanswered: '未答',
      checked: '选中',
      unchecked: '未选中',
    } as const
    return {
      conditionType
    };
  },
});
</script>

<style lang="scss" scoped></style>
