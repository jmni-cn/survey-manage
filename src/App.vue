<template>
  <JmniSurveyEdit v-model:value="value" @save="test" @preview="preview"/>
  
  <!-- <button @click="test">jjjk</button> -->
  <n-modal
    v-model:show="showPreview"
    style="width: 780px;"
    preset="card"
    :bordered="false"
    :closeOnEsc="false"
    :closable="false"
    :maskClosable="false"
  >
    <JmniSurveyPreview :topics="previewValue.topics" :survey="previewValue.surveyConfig"/>
  </n-modal>


</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import json from "./q.json";
export default defineComponent({
  name: "App",
  setup() {
    const showPreview = ref(false);
    const surveyConfig = {
      title: "问卷标题",
      desc: "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！",
      theme_color: "#000",
    };
    const topics = json;

    const value = {
      surveyConfig: surveyConfig,
      // topics: []
      topics,
    }

    const previewValue = ref();
    const save = () => {
      console.log("save");
    }
    const preview = () => {
      previewValue.value = JSON.parse(JSON.stringify(value));
      console.log("preview");
      showPreview.value = true;
    }
    const test = () => {
      console.log(JSON.stringify(value, null, 2));
    }
    return {
      surveyConfig,
      topics,
      value,
      previewValue,
      showPreview,
      preview,
      save,
      test
    };
  },
});
</script>

<style lang="scss" scoped></style>
