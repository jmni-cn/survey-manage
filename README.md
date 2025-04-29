# Vue3 DOM Component Survey Library

这是一个基于 Vue3 + Vite + TypeScript 的 问卷支持创建和预览 组件库。

## 特性

- 🎨 开箱即用问卷创建预览
- 📦 支持 ESM 和 UMD 两种打包方式
- 🔧 基于 TypeScript，提供完整的类型定义
- 🎯 轻量级，按需引入

## 安装

```bash
npm install jmni-survey
# or
yarn add jmni-survey
```

## 使用

```typescript
// 在 main.ts 中引入
import { createApp } from 'vue'
import DomComponents from 'jmni-survey'
import 'jmni-survey/dist/style.css'

const app = createApp(App)
app.use(DomComponents)
```

### 按需引入
```typescript
import { JmniSurveyEdit, JmniSurveyPreview } from 'jmni-survey'
app.component('JmniSurveyEdit', JmniSurveyEdit);
app.component('JmniSurveyPreview', JmniSurveyPreview);
```
```xtml
<template>
  <JmniSurveyEdit
    :title="surveyValue.title"
    :desc="surveyValue.desc"
    :topics="surveyValue.topics"
    :login_required="surveyValue.login_required"
    :show_question_index="surveyValue.show_question_index"
    :answer_limit_date="surveyValue.answer_limit_date"
    :datetimerange="surveyValue.datetimerange"
    :theme_color="surveyValue.theme_color"
    @save="save"
    @preview="preview"
  />
  <n-modal
    v-model:show="showPreview"
    style="width: 780px;"
    preset="card"
    :bordered="false"
    :closeOnEsc="false"
    :closable="false"
    :maskClosable="false"
  >
    <JmniSurveyPreview
      :title="previewValue.title"
      :desc="previewValue.desc"
      :topics="previewValue.topics"
      :show_question_index="!!previewValue.show_question_index"
      :theme_color="previewValue.theme_color"
      :answer_limit_date="!!previewValue.answer_limit_date"
      :datetimerange="previewValue.datetimerange"
      :submitLoading="submitLoading"
    />
  </n-modal>
```

## 组件

### DomButton

按钮组件，支持多种类型和尺寸。

```vue
<template>
  <dom-button type="primary" size="medium">
    点击我
  </dom-button>
</template>
```

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | 'primary' \| 'success' \| 'warning' \| 'danger' | 'primary' | 按钮类型 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮尺寸 |

#### Slots

| 名称 | 说明 |
|------|------|
| default | 按钮内容 |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建组件库
npm run build
```

## 许可证

MIT 