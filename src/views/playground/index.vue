<template>
  <div class="playground">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Playground'
}
</script>

<style scoped lang="less">
.playground {
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: hidden;

  &__container, &__content, &__log {
    height: calc(100vh - 64px);
  }
}
</style>
