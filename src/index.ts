import { App } from 'vue'
import DomButton from './components/DomButton.vue'
import JmniSurveyEdit from './components/survey/edit.vue'
import JmniSurveyPreview from './components/survey/preview.vue'
const components = {
  DomButton,
  JmniSurveyEdit,
  JmniSurveyPreview,
};
export { 
  DomButton,
  JmniSurveyEdit,
  JmniSurveyPreview,
 }

export default {
  install(app: App) {
    for (const [key, component] of Object.entries(components)) {
      app.component(key, component);
    }
  },
} 