<template>
  <div class="edit" id="editContent"  ref="contentRef" @click="handleClick">

    <div class="control left">
      <n-scrollbar  trigger="none" content-class="scrollbarContent" ref="scrollbar">

        <n-alert :show-icon="false" :bordered="false" title="题目设置" type="info" >
          <template #header>
            <n-text type="primary" style="font-size: 18px;">题目设置</n-text>
          </template>
          <n-collapse-transition :show="!!activeTopic?.id">
            <n-text type="primary">[{{ activeTopic?.index }}: {{ activeTopic?.title }}]</n-text>
            <n-space vertical v-if="activeTopic">
              <n-space align="center">
                <n-text >是否必答</n-text><n-switch v-model:value="activeTopic!.check!.required" @update:value="updateTopicItemByActive"/>
              </n-space>
              <n-space vertical v-show="activeTopic!.check!.required">
                <n-text >未答时错误提示文案</n-text><n-input v-model:value="activeTopic!.check!.message" placeholder="" @update:value="updateTopicItemByActive"/>
              </n-space>
              <!-- <n-space align="center" v-show="activeTopic.type === 'radio' || activeTopic.type === 'checkbox'">
                <n-text >选项顺序随机</n-text><n-switch type="info" v-model:value="activeTopic!.isOptionRandom" @update:value="updateTopicItemByActive"/>
              </n-space> -->
              <n-space vertical v-show="activeTopic.type.includes('Text')">
                <n-text >提示文案</n-text><n-input v-model:value="activeTopic!.placeholder" placeholder="" @update:value="updateTopicItemByActive"/>
              </n-space>
            </n-space>
          </n-collapse-transition>
        </n-alert>

        <n-alert :show-icon="false" :bordered="false" type="default">
          <n-h3><n-text type="primary" style="font-size: 18px;">整卷设置</n-text></n-h3>
          <n-form :model="configModel">
            <n-form-item label="标题" path="surveyTitle">
              <n-input type="text" v-model:value="configModel.title"/>
            </n-form-item>
            <n-form-item label="描述" path="surveyDesc">
              <n-input type="textarea" v-model:value="configModel.desc"/>
            </n-form-item>
            <n-form-item label="主题色" path="theme_color" v-if="configModel.theme_color">
              <n-color-picker v-model:value="configModel.theme_color" :show-alpha="false" />
            </n-form-item>
            <n-form-item label="限制登陆后答题" path="themeLight">
              <n-switch v-model:value="configModel.login_required" />
            </n-form-item>
            <n-form-item :label="'限制答卷日期范围 ' + formatTimeZoneOffset()" path="themeLight">
              <n-space align="center">
                <n-switch v-model:value="configModel.answer_limit_date" />
                <n-date-picker v-if="configModel.answer_limit_date" v-model:value="configModel.datetimerange" type="datetimerange" />
              </n-space>
            </n-form-item>
            <n-form-item label="显示题目序号" path="themeLight">
              <n-switch v-model:value="configModel.show_question_index" />
            </n-form-item>
          </n-form>
          <n-h3><n-text type="primary" style="font-size: 18px;">添加题目</n-text></n-h3>
          <div v-for="item in componentArr">
            <n-button size="small" @click="addTopic(item.type)">{{ item.label }}</n-button>
          </div>
        </n-alert>

        <n-space justify="center" style="margin: 30px 0;">
          <n-button type="info" @click="preview">快速预览</n-button>
          <n-button type="info" @click="save">保存</n-button>
        </n-space>
      </n-scrollbar>
      
    </div>
   
    <div class="center bg" ref="contentbgRef">
      
        <div class="shadow_q">
          <div class="shadow">
            <n-scrollbar  trigger="none" content-class="scrollbarContent" ref="scrollbar">
              <n-alert type="default" :show-icon="false" :bordered="false" style="padding: 4% 1% 8% 0;">
                <div v-for="(item, index) in topics" class="question_item" :class="{ active: activeTopic?.id === item.id }">
                  <n-card size="small" :bordered="false" style="padding: 0;">
                    <component
                      :is="item.type"
                      :item="item"
                      :themeColor="configModel.theme_color"
                      :showQuestionIndex="configModel.show_question_index"
                      :active="activeTopic?.id === item.id"
                      :index="item.index"
                      @update:topics="updateTopics(index, $event)"
                      @click="setActive(item)"
                      class="setActive"
                      style="padding: 8px 20px 0 46px"
                    ></component>
                  </n-card>
                  <alertlogic style="margin-top: 4px;" v-if="item?.logic?.conditions.some(v=>v.targetId)" :logicValue="item.logic"/>
                  <n-card :bordered="false" size="small" class="hover-card">
                    <template #action>
                      <n-space>
                        <n-popover trigger="hover">
                          <template #trigger>
                            <n-button  type="tertiary" size="small">添加上一题</n-button>
                          </template>
                          <div v-for="typeitem in componentArr">
                            <n-button size="small" @click="addTopic(typeitem.type, index-1)">{{ typeitem.label }}</n-button>
                          </div>
                        </n-popover>
                        <n-popover trigger="hover">
                          <template #trigger>
                            <n-button  type="tertiary" size="small">添加下一题</n-button>
                          </template>
                          <div v-for="typeitem in componentArr">
                            <n-button size="small" @click="addTopic(typeitem.type, index)">{{ typeitem.label }}</n-button>
                          </div>
                        </n-popover>
                        <n-button  type="tertiary" size="small" @click="delTopic(item, index)" :disabled="topics.length === 1">删除</n-button>
                        <n-button  type="tertiary" size="small" @click="addLogic(item, index)" :disabled="index === 0">添加逻辑</n-button>
                      </n-space>
                    </template>
                  </n-card>
                  <n-divider style="margin-bottom:0"/>
                </div>
              </n-alert>
            </n-scrollbar>
          </div>

        </div>
    </div> 
  </div>

  <n-modal
    v-model:show="showLogicModal"
    style="width: 780px;"
    preset="card"
    :bordered="false"
    :closeOnEsc="false"
    :closable="false"
    :maskClosable="false"
  >
    <template #header>
      <n-text type="primary">
        <n-space>
          <n-text>满足以下</n-text>
          <n-radio-group v-model:value="activeTopic!.logic!.logicOperator" name="radiogroup">
            <n-radio value="AND">全部</n-radio>
            <n-radio value="OR">任一</n-radio>
          </n-radio-group>
          <n-text>条件，</n-text>
          <n-text type="primary">展示本题[{{ activeTopic?.title }}]。否则隐藏</n-text>
        </n-space>
      </n-text>
    </template>
    <n-card :bordered="false" size="small">
      <n-space vertical>
        <n-space align="center" v-for="(condition, index) in activeTopic!.logic?.conditions">
          <n-text>条件{{ index+1 }}: 题目</n-text>
          <n-select
            v-model:value="condition.targetId"
            style="width: 200px;"
            placeholder="请选择"
            @update:value="changeLogicModelOption(condition, index)"
            :options="selectedLogicTopics"
          />
          <n-select
            v-model:value="condition.type"
            style="width: 100px;"
            placeholder="请选择"
            :options="conditionOptions"
          />
          <n-select
            v-show="condition.type == 'checked' || condition.type == 'unchecked'"
            v-model:value="condition.answerId"
            style="width: 200px;"
            placeholder="请选择"
            :options="condition.target?.options?.map((option) => ({
              label: option.index + ': ' + option.label,
              value: option.optionId,
            }))"
          />
          <n-button 
              size="tiny" 
              @click="removeCondition(activeTopic!.logic!.conditions, index)" 
              type="error" 
            >
              <n-icon size="small"><Minus /></n-icon>
            </n-button>
            <n-button size="tiny" @click="addCondition(index)">
              <n-icon size="small"><Plus /></n-icon>
            </n-button>
         
        </n-space>
      </n-space>
    </n-card>
    <template #footer>
      <n-space justify="end">
        <n-button @click="cancelLogic">取消</n-button>
        <n-button @click="confirmLogic">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
// import { ref } from 'vue'
import radio from './components/radio.vue'
import checkbox from './components/checkbox.vue'
import singleText from './components/singleText.vue'
import multipleText from './components/multipleText.vue'
import alertlogic from './components/alertlogic.vue'
import { computed, defineComponent, PropType, ref } from 'vue'
import { formatTimeZoneOffset, generateUID, padZero } from 'jmni'
import { type ItemQuestionLogic, type Condition } from './type'
import type { ScrollbarInst } from 'naive-ui'
import { Plus, Minus } from '@vicons/fa'

interface ComponentItem {
  type: string
  label: string
  key: string
}
const componentArr: ComponentItem[] = [
  {type: 'radio', label: '单选', key: 'radio',},
  {type: 'checkbox', label: '多选', key: 'checkbox',},
  {type: 'singleText', label: '文本', key: 'singleText',},
  {type: 'multipleText', label: '多行文本', key: 'multipleText',},
] as const
const components = {
  singleText,
  multipleText,
  checkbox,
  radio,
  alertlogic,
};
export default defineComponent({
  name: 'JmniSurveyEdit',
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
    login_required: {
      type: Boolean,
      default: false,
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
    topics: {
      type: Array as PropType<ItemQuestionLogic[]>,
      default: () => [],
    },
  },
  components: {
    ...components,
    Plus,
    Minus,
  },
  emits: ['preview', 'save', 'update:value'],
  setup(props, { emit }) {
    
    const contentRef = ref<HTMLDivElement | null>(null)
    const contentbgRef = ref<HTMLDivElement | null>(null)

    const scrollbar = ref<ScrollbarInst | null>(null)
    const showLogicModal = ref(false)
    const topics = ref<ItemQuestionLogic[]>(props.topics)
    const configModel = ref({
      title: props.title,
      desc: props.desc,
      theme_color: props.theme_color,
      login_required: props.login_required,
      show_question_index: props.show_question_index,
      answer_limit_date: props.answer_limit_date,
      datetimerange: props.datetimerange,
    })

    const logicTopics = ref<ItemQuestionLogic[]>([])
    const activeTopic = ref<ItemQuestionLogic | null>(null)
    // const currentLogics = ref<Logic| null>(null) // 当前编辑的逻辑

    const conditionOptions = ref<{label:string,value: string}[]>([])
    const selectedLogicTopics = computed(()=>{
      return logicTopics.value.map((item)=>{
        return {
          label: item.index + ': ' + item.title,
          value: item.id,
        }
      })
    })

    const changeLogicModelOption = (condition:Condition, index:number) => {
      condition.answerId = ''
      condition.type = ''
      const target = JSON.parse(JSON.stringify(topics.value.find(v => v.id === condition.targetId)))
      target.logic = null
      activeTopic.value!.logic!.conditions[index].target = target
      
      if(target?.type == 'radio' || target?.type == 'checkbox'){
        conditionOptions.value = [
          { label: '已答', value: 'answered'},
          { label: '未答', value: 'unanswered'},
          { label: '选中', value: 'checked'},
          { label: '未选中', value: 'unchecked'},
        ]
      }else{
        conditionOptions.value = [
          { label: '已答', value: 'answered'},
          { label: '未答', value: 'unanswered'},
        ]
      }
    }
    const confirmLogic = () => {
      // topics.value.find(v => v.id === activeTopic.value?.id)!.logic = activeTopic.value?.logic
      topics.value.find(v => v.id === activeTopic.value?.id)!.logic = JSON.parse(JSON.stringify(activeTopic.value?.logic))
      showLogicModal.value = false
    }
    const cancelLogic = () => {
      showLogicModal.value = false
      // activeTopic.value!.logic = {
      //   conditions: []
      // }
      const topic = topics.value.find(item => item.id === activeTopic.value?.id)
      setActive(topic!)
    }
    const removeCondition = (conditions:Condition[], index: number) => {
      if (conditions.length === 1) {
        conditions.splice(index, 1, addEmptyCondition())
      }else{
        conditions.splice(index, 1)
      }
    }
    const addCondition = (_index: number) => {
      activeTopic.value?.logic?.conditions.push(addEmptyCondition())
    }

    const addEmptyCondition = () => {
      const condition:Condition = {
        type: '',
        targetId: '',
        answerId: '', // 针对选项的条件
      }
      return condition
    }
    const addLogic = (item:ItemQuestionLogic, index:number) => {
      logicTopics.value = topics.value.slice(0, index)
      item.logic = item.logic || {
        conditions: [addEmptyCondition()],
        logicOperator: 'AND',
      }
      setActive(item)
      showLogicModal.value = true
    }
    const setActive = (item:ItemQuestionLogic) => {
      clearActive()
      activeTopic.value = JSON.parse(JSON.stringify(item))
    }
    const updateTopicItemByActive = () => {
      const targetTopics = topics.value.find(v => v.id === activeTopic.value?.id)
      if(targetTopics && activeTopic.value){
        targetTopics.check = activeTopic.value.check
        targetTopics.placeholder = activeTopic.value.placeholder
        targetTopics.isOptionRandom = activeTopic.value.isOptionRandom
      }
    }
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('.question_item') || target.closest('.control')) {
        return
      }
      clearActive()
    }
    const clearActive = () => {
      activeTopic.value = null
    }
    const addTopic = (type:string, index?:number) => {
      let currentTopicTop = 0
      if(index){
        const currentTopicElement = document.querySelectorAll('.question_item')[index] as HTMLElement;
        currentTopicTop = currentTopicElement?.offsetTop
      }
      const typeDesc = componentArr.find(v => v.type === type)?.label
      const unit:ItemQuestionLogic = {
        id: generateUID(),
        type,
        typeDesc: typeDesc!,
        title: '请输入题目标题',
        desc: '',
        placeholder: '',
        isOptionRandom: false,
        check: { "required": true, "message": "此题为必答" },
        answer: {
          label: '',
          value: ''
        }
      }
      if(type === 'checkbox'){
        unit.options = [{optionId: generateUID(), label:'选项1', index: '01'},]
        unit.answer = {
          label: '',
          value: []
        }
      }
      if(type === 'radio'){
        unit.options = [{optionId: generateUID(), label:'选项1', index: '01'},]
      }
      if (index !== undefined) {
        topics.value.splice(index + 1, 0, unit)
      } else {
        topics.value.push(unit)
      }
      addQuestionIndex(topics.value)
      setActive(unit)
      scrollToActive(currentTopicTop)
    }
    const addQuestionIndex = (topics:ItemQuestionLogic[]) => {
      topics.forEach((topic:ItemQuestionLogic, index:number) => {
        topic.index = padZero(index + 1)
        topic.options?.forEach((option, i) => {
          option.index = padZero(i + 1)
        })
      })
    }
    const scrollToActive = (currentTopicTop:number) => {
      Promise.resolve().then(()=>{
        const activeElement = document.querySelector('.question_item.active') as HTMLElement;
        if (activeElement && scrollbar.value) {
          const activeTop = currentTopicTop || activeElement.offsetTop; // 元素顶部位置
          // const activeBottom = activeTop + activeElement.offsetHeight; // 元素底部位置
          if (activeTop) {
            scrollbar.value.scrollTo({
              top: activeTop,
              behavior: 'smooth',
            });
          }
        }
      })
    };
    const delTopic = (item: ItemQuestionLogic, index: number) => {
      if (index >= 0 && index < topics.value.length) {
        topics.value.splice(index, 1)
        addQuestionIndex(topics.value)
      }
      if(item.id === activeTopic.value?.id){
        clearActive()
      }
    }
    const updateTopics = (index: number, updatedItem: ItemQuestionLogic) => {
      updatedItem.options?.forEach((option, i) => {
          option.index = padZero(i + 1)
        })
      topics.value[index] = updatedItem
      // console.log(topics.value);
    }

    const preview = () => {
      emit('preview', getParams())
    }
    const getParams = () => {
      const answer_limit_date = configModel.value.answer_limit_date
      const theme_color = configModel.value.theme_color
      const params:any = {
        topics: JSON.stringify(topics.value),
        title: configModel.value.title,
        desc: configModel.value.desc,
        login_required: configModel.value.login_required,
        answer_limit_date,
        show_question_index: configModel.value.show_question_index,
      }
      if(theme_color){
        params.theme_color = theme_color
      }
      if(answer_limit_date){
        params.start_time = configModel.value.datetimerange?.[0]
        params.end_time = configModel.value.datetimerange?.[1]
        params.datetimerange = configModel.value.datetimerange
      }
      return params
    }
    const save = () => {
      const params = getParams()
      emit('save', params)
    }

    if(props.topics.length === 0){
      addTopic('radio')
    }

    return {
      padZero,
      formatTimeZoneOffset,
      scrollbar,
      showLogicModal,
      changeLogicModelOption,
      updateTopicItemByActive,
      confirmLogic,
      cancelLogic,
      removeCondition,
      addCondition,
      selectedLogicTopics,
      conditionOptions,
      activeTopic,
      handleClick,
      setActive,
      clearActive,
      addLogic,
      addTopic,
      delTopic,
      updateTopics,
      componentArr,
      topics,
      configModel,
      contentRef,
      contentbgRef,
      save,
      preview,
    }
  }
})
</script>
<style lang="scss" scoped>
.edit {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  min-width: 1180px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.control{
  z-index: 1;
}
.left{
  min-width: 300px;
  width: 30%;

  height: 100%;
}
.center{
  min-width: 680px;
  width: 70%;
  height: 100%;
}

.shadow_q {
  position: relative;
  backdrop-filter: blur(4px);
  height: 100%;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  // padding: 0  0 0 1%;

  .shadow {
    transition: all 0.3s ease;
    width: 100%;
    height: 100%;
  }
}

.question_item{
  position: relative;
  margin: 0 20px;
  transition-duration: 0.3s;
  border-radius: 6px;
  border: 1px solid transparent;
  .hover-card{
    transition: all .3s;
    opacity: 0;
  }

  &:hover{
    z-index: 2;
    transform: scale(1.01);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;
    transform: translateY(-2px);
    // background-image: linear-gradient(to bottom right, #fff3, #ccc);
    .hover-card{
      opacity: 1;
    }
  }
  &.active {
    z-index: 1;
    transform: scale(1.01);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;
    transform: translateY(-2px);
    // background-image: linear-gradient(to bottom right, #fff3, #ccc);
    .hover-card{
      opacity: 1;
    }
  }
}
.setActive{
  cursor: text;
}
#editContent{
  .n-modal-mask,.n-modal-container,.n-modal-body-wrapper{
    position: absolute;
  }
}
</style>
