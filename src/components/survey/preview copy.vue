<template>
  <!-- <div class="preview_question" :style="'background-color: ' + survey.bgcolor"> -->
  <div class="preview_question">
      <template v-if="step === 1">
        <n-h3>
          <n-text>{{ title }}</n-text>
        </n-h3>
        <n-p><n-text>{{ desc }}</n-text></n-p>
        <n-button @click="start">开始填写</n-button>
      </template>
      <template v-if="step === 2">
        <n-progress type="line" :show-indicator="false" status="default" :percentage="percentage" />
        <div class="preview_content">
          <n-scrollbar content-class="scrollbar_content" ref="scrollbar">
            
              <n-form ref="modelformRef" require-mark-placement="left" :model="formModel" :rules="validationRules" >
                <template v-for="item in topics">
                  <n-form-item v-if="isVisible(item)" :key="item.id" :path="item.id" >
                    <template #label>
                      <n-space vertical>
                        <n-text :style="`color: ${theme_color}`">{{ item.title }}</n-text>
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
                </template>
              </n-form>
              <n-button @click="handleSubmit">提交</n-button>
          </n-scrollbar>
        </div>
        </template>
        <template v-if="step === 3"> </template>
    </div>
    <n-modal
      v-model:show="showModal"
      :bordered="false"
      :maskClosable="false"
      :close-on-esc="false"
      preset="dialog"
      :showIcon="false"
    >
    {{ resMsg }}
  </n-modal>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
import { defineComponent } from 'vue'
import { zhCN, dateZhCN, type ScrollbarInst, type FormInst } from 'naive-ui'
import type { Condition, ItemQuestionLogic } from './type'
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
    topics: {
      type: Array as PropType<ItemQuestionLogic[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const modelformRef = ref<FormInst | null>(null)

    const scrollbar = ref<ScrollbarInst | null>(null)
    const step = ref(1)
    const page = ref(1)
    const submitLoading = ref(false)
    const showModal = ref(false)
    const resMsg = ref('')

    const percentage = computed(() => {
      return (page.value * 100) / PAGENUMBER
    })

    const start = () => {
      step.value = 2
      page.value = 1
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
    const isVisible = (item: ItemQuestionLogic): boolean => {
      if (!item.logic) return true

      const { conditions, logicOperator = 'AND' } = item.logic

      const results = conditions.map((condition: Condition): boolean => {
        const target = props.topics.find((t) => t.id === condition.targetId)
        if (!target) return false
        const targetValue = target.answer.value
        const { type, answerId } = condition

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
    // 提交表单
    const handleSubmit = () => {
      modelformRef.value?.validate((errors: any) => {
        if (!errors) {
          console.log('提交成功:', formModel.value)
          emit('submit', formModel.value)
          submitLoading.value = true
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
      submitLoading
    }
  }
})
</script>

<style lang="scss">

.preview_question {
  position: relative;
  height: calc(100vh - 80px - 24%);
  margin: 0 auto;
  overflow: hidden;
  padding: 1% 4% 0;
  border-radius: 4px;
  .preview_content {
    padding-top: 2%;
    height: 100%;
    overflow-y: auto;
  }
}



</style>
