<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="theme">
    <n-dialog-provider>
      <n-message-provider>
        <n-global-style />
        
        <div style="position: absolute;width: 100%;height: 100%;">
          <JmniSurveyEdit v-model:value="value" @save="test" @preview="preview" />
          <n-modal
            v-model:show="showPreview"
            style="width: 780px"
            preset="card"
            :bordered="false"
            :closeOnEsc="false"
            :maskClosable="false"
          >
            <JmniSurveyPreview
              :topics="previewValue.topics"
              :survey="previewValue.surveyConfig"
            />
          </n-modal>
        </div>
        
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import json from "./q.json";
import { storeToRefs } from "pinia";
import { useThemeStore } from "./store/useThemeStore";

export default defineComponent({
  name: "App",
  setup() {
    const themeStore = useThemeStore();
    const { themeOverrides, theme } = storeToRefs(themeStore);
    const showPreview = ref(false);
    const surveyConfig = {
      title: "问卷标题",
      desc: "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！",
      theme_color: "#fff",
      login_required: true,
    };
    const topics = json;

    const value = {
      surveyConfig: surveyConfig,
      // topics: []
      topics,
    };

    const previewValue = ref();
    const save = () => {
      console.log("save");
    };
    const preview = () => {
      previewValue.value = JSON.parse(JSON.stringify(value));
      console.log("preview");
      showPreview.value = true;
    };
    const test = () => {
      console.log(JSON.stringify(value, null, 2));
    };
    return {
      surveyConfig,
      topics,
      value,
      previewValue,
      showPreview,
      preview,
      save,
      test,
      themeOverrides,
      theme,
    };
  },
});
</script>

<style lang="scss" scoped></style>
