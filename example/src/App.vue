<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-dialog-provider>
      <n-message-provider>
        <n-global-style />
        
        <div style="position: absolute;width: 100%;height: 100%;">
          <JmniSurveyEdit 
            :title="surveyConfig.title"
            :desc="surveyConfig.desc"
            :topics="topics"
            :login_required="true"
            :show_question_index="true"
            @save="save" @preview="preview" />

          <n-modal
            v-model:show="showPreview"
            style="width: 780px;"
            preset="card"
            :bordered="false"
            :closeOnEsc="false"
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
import { zhCN, dateZhCN } from "naive-ui";
import { useThemeStore } from "./store/useThemeStore";
import { title } from "process";

export default defineComponent({
  name: "App",
  setup() {
    const themeStore = useThemeStore();
    const { themeOverrides, theme } = storeToRefs(themeStore);
    const showPreview = ref(false);
    const surveyConfig = {
      title: "问卷标题",
      desc: "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！",
    };
    const topics = json;
    // const topics = [];

    const previewValue = ref();

    const preview = (params) => {
      // previewValue.value = JSON.parse(JSON.stringify(params));
      previewValue.value = params;
      previewValue.value.topics = JSON.parse(params.topics);

      console.log("preview", previewValue.value);
      showPreview.value = true;
    };
    const save = (params) => {
      params.topics = JSON.parse((params.topics));
      console.log("test", params);

      
      console.log(JSON.stringify(params.topics, null, 2));
    };
    return {
      surveyConfig,
      topics,
      previewValue,
      showPreview,
      preview,
      save,
      themeOverrides,
      theme,
      zhCN,
      dateZhCN,
    };
  },
});
</script>

<style lang="scss" scoped></style>
