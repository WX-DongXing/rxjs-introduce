<template>
  <div class="console">
    <a-row :gutter="16" class="console__container">
      <a-col :span="16" class="console__content">
        <router-view />
      </a-col>
      <a-col :span="8" class="console__log">
        <Logger />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Logger from '@/components/Logger'

export default {
  name: 'Console',
  components: {
    Logger
  }
}
</script>

<style scoped lang="less">
.console {
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: hidden;

  &__container, &__content, &__log {
    height: calc(100vh - 64px);
  }
}
</style>
