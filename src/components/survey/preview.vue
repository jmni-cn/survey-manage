<template>
  <n-alert v-if="answer_limit_date" type="info" :bordered="false" :show-icon="false" style="margin: 4px 0">
    问卷答题时间: {{ formatDate(datetimerange[0], 'yyyy-MM-dd HH:mm:ss') }} - {{ formatDate(datetimerange[1], 'yyyy-MM-dd HH:mm:ss') }}
  </n-alert>
  <div v-if="step === 1" class="step1">
    <n-h2 style="text-align: center;"><n-text>{{ title }}</n-text></n-h2>
    <p style="margin-top: 30px;"><n-text>{{ desc }}</n-text></p>
    <div class="startbtn">
      <n-button class="btn" type="primary" @click="start">开始填写</n-button>
    </div>
  </div>


  <n-form v-if="step === 2" ref="modelformRef" require-mark-placement="left" :model="formModel" :rules="validationRules" class="step2">
    <template v-for="item in topics">
      <n-form-item v-if="isVisible(item)" :key="item.id" :path="item.id" >

        <template #label>
          <n-space vertical>
            <n-text type="primary"><n-text type="primary" v-if="show_question_index">{{ getVisibleIndex(item.id) }}：</n-text>{{ item.title }}</n-text>
            <n-text depth="3">{{ item.desc }}</n-text>
          </n-space>
        </template>


        <template v-if="item.type === 'radio'">
          <n-radio-group v-model:value="item.answer.value">
            <n-space vertical>
              <n-radio v-for="option in item.options" :value="option.optionId">{{ option.label }}</n-radio>
            </n-space>
          </n-radio-group>
        </template>
        <template v-if="item.type === 'checkbox'">
          <n-checkbox-group v-model:value="item.answer.value">
            <n-space vertical>
              <n-checkbox v-for="option in item.options" :value="option.optionId">{{ option.label }}</n-checkbox>
            </n-space>
          </n-checkbox-group>
        </template>
        <template v-if="item.type === 'singleText'">
          <n-input v-model:value="item.answer.value" type="text" :placeholder="item.placeholder" />
        </template>
        <template v-if="item.type === 'multipleText'">
          <n-input v-model:value="item.answer.value" type="textarea" :placeholder="item.placeholder" />
        </template>
      </n-form-item>

      <n-divider v-if="isVisible(item)"  />
    </template>

    <div class="submitbtn">
      <n-button class="btn" :loading="submitLoading" @click="handleSubmit" type="primary">提交</n-button>
    </div>
  </n-form>

</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
import { defineComponent } from 'vue'
import { zhCN, dateZhCN, type ScrollbarInst, type FormInst } from 'naive-ui'
import type { AnswerValue, Condition, ItemOption, ItemQuestionLogic } from './type'
import { formatDate, padZero } from 'jmni'
const PAGENUMBER = 1

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '问卷标题',
    },
    desc: {
      type: String,
      default: '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！',
    },
    theme_color: {
      type: String,
    },
    show_question_index: {
      type: Boolean,
      default: false,
    },
    answer_limit_date: {
      type: Boolean,
      default: false,
    },
    datetimerange: {
      type: Array as PropType<number[]>,
      default: () => [Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000],
    },
    type: {
      type: String as PropType<'preview' | 'write'>,
      default: 'write',
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    topics: {
      type: Array as PropType<ItemQuestionLogic[]>,
      default: () => [],
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const modelformRef = ref<FormInst | null>(null)

    const scrollbar = ref<ScrollbarInst | null>(null)
    const step = ref(1)
    const page = ref(1)
    const showModal = ref(false)
    const resMsg = ref('')
    const startTime = ref(0)

    const percentage = computed(() => {
      return (page.value * 100) / PAGENUMBER
    })

    const start = () => {
      step.value = 2
      page.value = 1
      startTime.value = Date.now()
    }
    const scrollTofeedback = () => {
      const elArr = Array.from(
        document.getElementsByClassName('n-form-item-feedback')
      )
      if (elArr.length) {
        const first = elArr[0]
        const fart = first.parentElement?.parentElement
        const height = fart?.offsetTop
        scrollbar.value?.scrollTo({ top: height, behavior: 'smooth' })
      }
    }

    const scrollToTop = () => {
      if (scrollbar.value) {
        scrollbar.value.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const visibleTopics = computed(() =>
      props.topics.filter((item) => isVisible(item))
    )
    const visibleIndexMap = computed(() => {
      const map = new Map<string, number|string>()
      visibleTopics.value.forEach((item, idx) => {
        map.set(item.id, padZero(idx + 1))
      })
      return map
    })

    const getVisibleIndex = (id: string) => visibleIndexMap.value.get(id)

    const isVisible = (item: ItemQuestionLogic) => {
      if (!item.logic) return true

      const { conditions, logicOperator = 'AND' } = item.logic

      const results = conditions
        .map((condition: Condition) => {
          const target = props.topics.find((t) => t.id === condition.targetId)
          const { type, answerId } = condition

          if (!target || !type) return null

          const targetValue = target.answer.value

          switch (type) {
              case 'checked':
                return Array.isArray(targetValue)
                  ? targetValue.includes(answerId!)
                  : targetValue === answerId
              case 'unchecked':
                return Array.isArray(targetValue)
                  ? !targetValue.includes(answerId!)
                  : targetValue !== answerId
              case 'answered':
                return Array.isArray(targetValue)
                  ? targetValue.length > 0
                  : targetValue !== ''
              case 'unanswered':
                return Array.isArray(targetValue)
                  ? targetValue.length === 0
                  : targetValue === ''
              default:
                return false
            }
        })
        .filter((result:any) => result !== null)

      // 如果没有有效的判断条件，默认返回 true
      if (results.length === 0) return true

      return logicOperator === 'AND'
        ? results.every(Boolean)
        : results.some(Boolean)
    }

    // 生成表单模型
    const formModel = computed(() =>
    props.topics.reduce(
        (model, topic) => {
          model[topic.id] = topic.answer.value
          return model
        },
        {} as Record<string, any>
      )
    )

    // 动态生成校验规则
    const validationRules = computed(() =>
    props.topics.reduce(
        (rules, topic) => {
          if (topic.check?.required) {
            rules[topic.id] = {
              required: true,
              message: topic.check.message,
            }
          }
          return rules
        },
        {} as Record<string, any>
      )
    )

    const parseAnswers = (data: ItemQuestionLogic[], userAnswersData: Record<string, string | string[]>) => {
      const answersdata: Record<string, AnswerValue> = {}
      data.forEach((question) => {
        const { id, type, options = [] } = question;
        const answer = userAnswersData[id];
        const getOptionLabel = (optionId: string): ItemOption => {
          const option = options.find((opt) => opt.optionId === optionId);
          if (!option) {
            throw new Error(`Option with ID ${optionId} not found`);
          }
          return option;
        };
        
        if (type === 'radio') {
          answersdata[id] = getOptionLabel(answer as string) as ItemOption;
        } else if (type === 'checkbox' && Array.isArray(answer)) {
          answersdata[id] = (answer as string[]).map(getOptionLabel) as ItemOption[];
        } else if (type === 'singleText' || type === 'multipleText') {
          answersdata[id] = answer as string;
        }
      });
      return answersdata
    }
    // 提交表单
    const handleSubmit = () => {
      modelformRef.value?.validate((errors: any) => {
        if (!errors) {
          const params = {
            answers: parseAnswers(props.topics, formModel.value),
            duration: (Date.now() - startTime.value)/1000,
          }
          console.log('提交成功:', params)
          emit('submit', params)
        } else {
          scrollTofeedback()
          console.log('校验失败:', errors)
        }
      })
    }

    return {
      zhCN,
      dateZhCN,
      scrollToTop,
      scrollbar,
      percentage,

      isVisible,
      formModel,
      validationRules,
      handleSubmit,

      step,
      page,
      start,
      modelformRef,
      showModal,
      resMsg,
      getVisibleIndex,
      formatDate
    }
  }
})
</script>

<style lang="scss" scoped>
.step1{
  padding: 60px 80px 0;
}
.step2{
  padding: 30px 80px 0;
}
.submitbtn{
  display: flex;
  margin-top: 30px;
}
.startbtn{
  display: flex;
  justify-content: center;
  margin: 100px auto 0;
}
@media screen and (max-width: 640px) {
  .step1{
    padding: 120px 6px 0;
  }
  .step2{
    padding: 30px 6px;
  }
  .submitbtn{
    justify-content: center;
    .btn{
      width: 90%;
    }
  }
  .startbtn{
    .btn{
      width: 90%;
    }
  }
}
</style>
