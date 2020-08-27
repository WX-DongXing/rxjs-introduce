import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRx from 'vue-rx'
import 'prismjs'
import 'ant-design-vue/dist/antd.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import { Button, Layout, PageHeader, Row, Col, Icon, Tag, Input, Result } from 'ant-design-vue'
import './request'

Vue.use(Button)
Vue.use(Layout)
Vue.use(PageHeader)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Tag)
Vue.use(Input)
Vue.use(Result)

Vue.config.productionTip = false

Vue.use(VueRx)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
