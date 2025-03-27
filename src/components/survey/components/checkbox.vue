<template>
  <div>
    <n-tag :bordered="false">{{ item.typeDesc }}{{ item.id }}</n-tag>
    <div class="content">
      <div class="subscript">
        <n-text type="error" v-if="item.check?.required">*</n-text>
        <n-text :style="`color: ${themeColor}`">{{ index }}</n-text>
      </div>
      <div v-show="!active">
        <p class="line title"><n-text :style="`color: ${themeColor}`">{{ item.title }}</n-text></p>
        <p class="line desc"><n-text style="font-size: 12px;" :depth="item.desc? '1' : '3'">{{ item.desc || '请输入题目说明' }}</n-text></p>
      </div>
      <div v-show="active">
          <n-input style="margin-bottom: 4px;" type="text" size="small" v-model:value="item.title" placeholder="" @input="updateTitle"/>
          <n-input style="margin-bottom: 2px;" type="text" size="small" v-model:value="item.desc" placeholder="请输入题目说明" @input="updateDesc"/>
      </div>
    </div>

    <n-checkbox-group v-model:value="value" name="checkboxgroup" style="width: 100%;">
      <n-space vertical class="hover-space">
        <n-space 
          align="center" 
          v-for="(option, idx) in item.options" 
          :key="idx" 
          class="hover-option"
        >
          <!-- <n-checkbox :value="option.optionId"></n-checkbox>
          <n-input v-model:value="option.label" placeholder="" /> -->
          

          <n-checkbox v-show="active" :value="option.optionId"></n-checkbox>
          <n-input v-show="active" size="small" v-model:value="option.label" placeholder="" />
          <n-checkbox v-show="!active" :value="option.optionId">{{ option.label }}</n-checkbox>


          <div class="hover-buttons">
            <n-button 
              size="tiny" 
              @click="removeOption(idx)" 
              type="error" 
              :disabled="item.options?.length === 1"
            >
              <n-icon size="small"><Minus /></n-icon>
            </n-button>
            <n-button size="tiny" @click="addOption(idx)">
              <n-icon size="small"><Plus /></n-icon>
            </n-button>
          </div>
        </n-space>
      </n-space>
    </n-checkbox-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import { type ItemQuestion } from '../type'
import { generateUID } from 'jmni'
import { Plus, Minus } from '@vicons/fa'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemQuestion>,
      required: true,
    },
    index: {
      type: String,
      default: '1',
    },
    active: {
      type: Boolean,
      required: true,
    },
    themeColor: {
      type: String,
      default: '#000',
    },
  },
  emits: ['update:topics'],
  components: {
    Plus,
    Minus,
  },
  setup(props, { emit }) {
    const value = ref(null)

    // 添加选项
    const addOption = (index: number) => {
      const newOption = {
        optionId: generateUID(),
        label: `选项${props.item.options!.length + 1}`,
      }
      if (index >= 0 && index < props.item.options!.length) {
        props.item.options!.splice(index + 1, 0, newOption)
      } else {
        props.item.options!.push(newOption)
      }
      emit('update:topics', props.item)
    }

    // 删除选项
    const removeOption = (index: number) => {
      if (index >= 0 && index < props.item.options!.length) {
        props.item.options!.splice(index, 1)
        emit('update:topics', props.item)
      }
    }

    const updateTitle = (value: string) => {
      console.log(value);
      updateItem('title', value)
    }

    const updateDesc = (value: string) => {
      console.log(value);
      updateItem('desc', value)
    }

    // 更新题目数据
    const updateItem = (key: 'title' | 'desc', value: string) => {
      props.item[key] = value
      emit('update:topics', props.item)
    }

    return {
      value,
      updateDesc,
      updateTitle,
      addOption,
      removeOption,
      updateItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.content{
  position: relative;
  margin: 2px 0;
}
.subscript {
  position: absolute;
  left: 0%;
  transform: translate(-100%, 16%);
}
.line{
  padding: 0 10px;
  margin-bottom: 4px;
  line-height: 28px;
}
.title{
}
.desc{
}
.hover-space{
  width: 100%;
}
.hover-option {
  width: 100%;
  position: relative;
  &:hover .hover-buttons {
    display: flex;
  }
}
.hover-buttons {
  display: none;
  gap: 4px;
}
</style>
