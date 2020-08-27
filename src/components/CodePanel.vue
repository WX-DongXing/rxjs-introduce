<template>
  <div class="code-panel">
    <panel :title="title" :play="play" @run="() => $emit('run')">
      <prism class="code-panel__prism" language="javascript">
        <slot />
      </prism>
      <slot name="extra" />
    </panel>
  </div>
</template>

<script>
import Panel from './Panel'
import Prism from 'vue-prism-component'

export default {
  name: 'CodePanel',
  components: {
    Panel,
    Prism
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    play: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
.code-panel {
  margin-bottom: 16px;

  &__prism.language-javascript {
    background: #3b3b47 !important;
  }
}
</style>
