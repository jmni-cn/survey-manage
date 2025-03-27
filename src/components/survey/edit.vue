<template>
  <div class="edit" id="editContent"  ref="contentRef" @click="handleClick">

    <div class="control left">
      <n-card :bordered="false" size="small">
        <n-h3>页面设置</n-h3>
        <n-form :model="configModel">
          <n-form-item label="标题" path="surveyTitle">
            <n-input type="text" v-model:value="configModel.title"/>
          </n-form-item>
          <n-form-item label="描述" path="surveyDesc">
            <n-input type="textarea" v-model:value="configModel.desc"/>
          </n-form-item>
          <!-- <n-form-item label="背景色" path="backgroundColor">
            <n-color-picker v-model:value="configModel.backgroundColor" :show-alpha="false" />
          </n-form-item> -->
          <n-form-item label="主题色" path="theme_color">
            <n-color-picker v-model:value="configModel.theme_color" :show-alpha="false" />
          </n-form-item>
          <!-- <n-form-item label="主题模式" path="themeLight">
            <n-switch v-model:value="configModel.themeLight" >
              <template #checked>亮色</template>
              <template #unchecked>暗色</template>
            </n-switch>
          </n-form-item> -->
        </n-form>
        <n-h3>添加题型</n-h3>
        <div v-for="item in componentArr">
          <n-button size="small" @click="addTopic(item.type)">{{ item.label }}</n-button>
        </div>
        <!-- <n-collapse :default-expanded-names="['1', '2']" arrow-placement="right">
          <n-collapse-item title="页面设置" name="1">
            <n-form :model="configModel">
              <n-form-item label="标题" path="surveyTitle">
                <n-input type="text" v-model:value="configModel.title"/>
              </n-form-item>
              <n-form-item label="描述" path="surveyDesc">
                <n-input type="textarea" v-model:value="configModel.desc"/>
              </n-form-item>
              <n-form-item label="主题色" path="theme_color">
                <n-color-picker v-model:value="configModel.theme_color" :show-alpha="false" />
              </n-form-item>
            </n-form>
          </n-collapse-item>
          <n-collapse-item title="添加题型" name="2">
            <div v-for="item in componentArr">
              <n-button size="small" @click="addTopic(item.type)">{{ item.label }}</n-button>
            </div>
          </n-collapse-item>
        </n-collapse> -->
      </n-card>
    </div>
   
    <div class="center bg" ref="contentbgRef">
      
      <!-- <div class="bg_shadow_q">
        <div class="bg_shadow"></div>
      </div> -->
        <!-- <n-space justify="center" style="padding: 8px;">
          <n-button v-if="type !== 'create'" type="info" size="small" @click="preview">预览</n-button>
          <n-button  type="info" size="small" @click="save">保存</n-button>
        </n-space> -->
        <div class="shadow_q">
          <div class="shadow">
            <n-scrollbar  trigger="none" content-class="scrollbarContent" content-style="padding: 4% 1% 8% 0;" ref="scrollbar">
              <div v-for="(item, index) in topics" class="question_item" :class="{ active: activeTopic?.id === item.id }">
                <component
                  :is="item.type"
                  :item="item"
                  :themeColor="configModel.theme_color"
                  :active="activeTopic?.id === item.id"
                  :index="item.index"
                  @update:topics="updateTopics(index, $event)"
                  @click="setActive(item)"
                  class="setActive"
                  style="padding: 8px 20px 0 46px"
                ></component>
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
              </div>
              <n-space justify="center" style="margin-top: 16px;">
                <n-button type="info" @click="preview">预览</n-button>
                <n-button type="info" @click="save">保存</n-button>
              </n-space>
            </n-scrollbar>
          </div>
          <!-- <n-flex align="flex-start">
            <n-float-button-group shape="square" position="relative">
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
            </n-float-button-group>
            <n-float-button-group position="relative">
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
              <n-float-button>
                <n-icon><CashIcon /></n-icon>
              </n-float-button>
            </n-float-button-group>
          </n-flex> -->
        </div>
    </div> 

    <div class="control right" >
      <n-tabs type="line" animated>
        <n-tab-pane name="1" tab="整卷设置">
          Wonderwall
        </n-tab-pane>
        <n-tab-pane name="2" tab="题目设置">
          <div v-if="activeTopic && !showLogicModal">
            <!-- <n-card :bordered="false" size="small"  > -->
              <n-alert :show-icon="false" title="逻辑规则" type="default" >
                <template #header>
                  <n-text type="info">[{{ activeTopic?.index }}: {{ activeTopic?.title }}]</n-text>
                </template>
                <n-space vertical >
                  <n-space align="center">
                    <n-text >是否必答</n-text><n-switch v-model:value="activeTopic!.check!.required" @update:value="updateTopicItemByActive"/>
                  </n-space>
                  <n-space vertical v-show="activeTopic!.check!.required">
                    <n-text >未答时错误提示文案</n-text><n-input v-model:value="activeTopic!.check!.message" placeholder="" @update:value="updateTopicItemByActive"/>
                  </n-space>
                  <n-space align="center" v-show="activeTopic.type === 'radio' || activeTopic.type === 'checkbox'">
                    <n-text >选项顺序随机</n-text><n-switch type="info" v-model:value="activeTopic!.isOptionRandom" @update:value="updateTopicItemByActive"/>
                  </n-space>
                  <n-space vertical v-show="activeTopic.type.includes('Text')">
                    <n-text >提示文案</n-text><n-input v-model:value="activeTopic!.placeholder" placeholder="" @update:value="updateTopicItemByActive"/>
                  </n-space>
                </n-space>
              </n-alert>
      
              <n-alert :show-icon="false" title="逻辑规则" type="info" v-if="activeTopic?.logic?.conditions.some(v=>v.targetId)">
                <n-space>
                  <n-text>满足以下{{ activeTopic!.logic!.logicOperator === 'AND' ? '全部' : '任一' }}条件，展示本题。否则隐藏</n-text>
                  <n-text type="info"></n-text>
                </n-space>
                <ul>
                  <li v-for="(logic, li) in activeTopic?.logic?.conditions" :key="logic.targetId">
                    条件{{li+1}}：题目
                    <n-text type="info">{{ logic.target?.index }}: {{ logic.target?.title }}</n-text>
                    ，{{ conditionType[logic.type as "answered" | "unanswered" | "checked" | "unchecked"]}} 
                    <n-text v-if="logic.answerId" type="info">
                      {{ logic.target?.options?.find(v=>v.optionId === logic.answerId)?.label}}
                    </n-text>
                  </li>
                </ul>
              </n-alert>
            <!-- </n-card> -->
          </div>
        </n-tab-pane>
      </n-tabs>
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
import { computed, defineComponent, PropType, ref } from 'vue'
import { generateUID, padZero } from 'jmni'
import { type ItemQuestionLogic, type Condition } from './type'
import type { ScrollbarInst } from 'naive-ui'
import { Plus, Minus } from '@vicons/fa'

interface ComponentItem {
  type: string
  label: string
  key: string
}
interface surveyValue {
  surveyConfig: {
    theme_color: string
    title: string
    desc: string
  }
  topics: ItemQuestionLogic[]
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
};
export default defineComponent({
  name: 'JmniSurveyEdit',
  props: {
    value: {
      type: Object as PropType<surveyValue>,
      default: () => ({
        surveyConfig: {
          theme_color: '#000',
          title: '问卷标题',
          desc: '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！',
        },
        topics: [],
      }),
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
    const topics = ref<ItemQuestionLogic[]>(props.value.topics)
    const configModel = ref(props.value.surveyConfig)

    
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
    const conditionType: Record<"answered" | "unanswered" | "checked" | "unchecked", string> ={
      answered: '已答',
      unanswered: '未答',
      checked: '选中',
      unchecked: '未选中',
    } as const
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
      topics.value.find(v => v.id === activeTopic.value?.id)!.logic = activeTopic.value?.logic
      showLogicModal.value = false
    }
    const updateTopicItemByActive = () => {
      const targetTopics = topics.value.find(v => v.id === activeTopic.value?.id)
      if(targetTopics && activeTopic.value){
        targetTopics.check = activeTopic.value.check
        targetTopics.placeholder = activeTopic.value.placeholder
        targetTopics.isOptionRandom = activeTopic.value.isOptionRandom
      }
    }
    const cancelLogic = () => {
      showLogicModal.value = false
      activeTopic.value!.logic = {
        conditions: []
      }
      const topic = topics.value.find(item => item.id === activeTopic.value?.id)
      setActive(topic!)
    }
    const removeCondition = (conditions:Condition[], index: number) => {
        conditions.splice(index, 1)
    }
    const addCondition = (_index: number) => {
      addEmptyCondition()
    }

    const addEmptyCondition = () => {
      const condition:Condition = {
        type: '',
        targetId: '',
        answerId: '', // 针对选项的条件
      }
      activeTopic.value?.logic?.conditions.push(condition)
    }
    const addLogic = (item:ItemQuestionLogic, index:number) => {
      showLogicModal.value = true
      logicTopics.value = topics.value.slice(0, index)
      item.logic = item.logic || {
        conditions: [{
          type: '',
          targetId: '',
          answerId: '', // 针对选项的条件
        }],
        logicOperator: 'AND',
      }
      setActive(item)
      console.log(item, index);
    }
    const setActive = (item:ItemQuestionLogic) => {
      activeTopic.value = JSON.parse(JSON.stringify(item))
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
        currentTopicTop = currentTopicElement.offsetTop
      }
      const typeDesc = componentArr.find(v => v.type === type)?.label
      const unit:ItemQuestionLogic = {
        id: generateUID(),
        type,
        typeDesc: typeDesc!,
        title: '请输入题目标题',
        desc: '',
        placeholder: '',
        check: { "required": true, "message": "此题为必填项" },
        answer: {
          label: '',
          value: ''
        }
      }
      if(type === 'checkbox'){
        unit.options = [{optionId: generateUID(), label:'选项1', index: 'A1'},]
        unit.answer = {
          label: '',
          value: []
        }
      }
      if(type === 'radio'){
        unit.options = [{optionId: generateUID(), label:'选项1', index: 'A1'},]
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
          option.index = 'A'+(i+1)
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
          option.index = 'A'+(i+1)
        })
      topics.value[index] = updatedItem
    
      console.log(topics.value);
    }

    const preview = () => {
      emit('preview', getParams())
    }
    const getParams = () => {
      const params = {
        // value: JSON.parse(JSON.stringify(topics.value)),
        content: JSON.stringify(topics.value),
        title: props.value.surveyConfig.title,
        desc: props.value.surveyConfig.desc,
        theme_color: props.value.surveyConfig.theme_color
      }
      return params
    }
    const save = () => {
      const params = getParams()
      emit('save', params)
    }


    addTopic('radio')

    return {
      padZero,
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
      conditionType,
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
  align-items: flex-start;
}
.control{
  z-index: 1;
}
.left,
.right {
  min-width: 200px;
}
.left{
  width: 200px;
  left: 0;
}
.right {
  right:0;
  width: 360px;
  padding-left: 10px;
}
.center{
  max-width: 980px;
  min-width: 680px;
  width: 100%;
  height: 100%;
}

.shadow_q {
  position: relative;
  backdrop-filter: blur(4px);
  // box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07);
  // box-shadow: inset 1px 1px 4px #fff9;
  height: 100%;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  padding: 0  0 0 1%;

  .shadow {
    background-image: linear-gradient(to bottom right, #fff9, #fff3);
    // box-shadow: inset -1px -1px 4px #fffc;
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
    background-image: linear-gradient(to bottom right, #fff9, #fff3);
    .hover-card{
      opacity: 1;
    }
  }
  &.active {
    z-index: 1;
    transform: scale(1.01);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;
    transform: translateY(-2px);
    background-image: linear-gradient(to bottom right, #fff9, #fff3);
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
