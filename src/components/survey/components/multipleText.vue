<template>
  <div>
    <n-tag :bordered="false" type="primary">{{ item.typeDesc }}</n-tag>
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

    <n-input type="textarea" :placeholder="item.placeholder"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type ItemQuestion } from '../type'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ItemQuestion>, // 使用 PropType 声明类型
      required: true, // 必填
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
  emits: ['update:topics'], // 用于同步到父组件
  components: {
  },
  setup(props, { emit }) {
    // 更新题目数据
    const updateItem = (key: 'title' | 'desc', value: string) => {
      props.item[key] = value
      emit('update:topics', props.item)
    }
    const updateTitle = (value: string) => {
      console.log(value);
      updateItem('title', value)
    }

    const updateDesc = (value: string) => {
      console.log(value);
      updateItem('desc', value)
    }

    return {
      updateItem,
      updateDesc,
      updateTitle,
    }
  },
})
</script>

<style lang="scss" scoped>
.input {
  border: 1px solid rgba($color: #fff, $alpha: 0.09);
  border-radius: 2px;
  padding: 6px 12px;
}
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
</style>
