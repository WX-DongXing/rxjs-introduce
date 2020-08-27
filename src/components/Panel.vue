<template>
  <div class="panel">
    <div class="panel__bar">
      <p>{{ title }}</p>
      <a-icon v-if="play" type="play-circle" style="color: #1890ff" @click="() => $emit('run')" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Panel',
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
.panel {
  background: #3b3b47;

  &__bar {
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #000;
    padding: 0 16px;
    color: rgba(255, 255, 255, 0.85);

    p {
      margin: 0;
    }

    i {
      cursor: pointer;

      &:hover {
        color: lighten(#1890ff, 10%) !important;
      }
    }
  }
}
</style>
